#!/usr/bin/env node

/**
 * Palindrome Scraper - Background job for scraping palindrome license plates
 * 
 * This script runs locally to scrape check-car.co.il for palindrome vehicle data.
 * It processes palindromes in batches with retry logic and saves found vehicles to the database.
 * 
 * Configuration:
 * Modify the variables below before running the script
 */

// ============== CONFIGURATION ==============
// Modify these variables to control the scraping behavior

const BATCH_SIZE = 4;                    // Number of palindromes to process in one batch
const MAX_RETRIES = 3;                   // Maximum retry attempts per palindrome
const DELAY = 800;                       // Delay between requests in milliseconds
const CONCURRENCY = 4;                   // Number of parallel requests per batch
const INIT_ONLY = false;                 // Only initialize palindromes, don't scrape
const RESET = false;                     // Reset all palindromes to pending status
const STATUS = false;                    // Show current progress and exit
const TEST = false;                      // Test mode with limited palindromes (40)

// ===============================================

import { generateAllPalindromes, TOTAL_PALINDROMES } from '../lib/palindrome-generator';
import { CheckCarApiClient } from '../lib/check-car-client';
import { PalindromeTracker } from '../lib/palindrome-tracker';
import { db } from '../lib/db';
import { palindromes, brands } from '../lib/db/schema/palindromes';
import { eq } from 'drizzle-orm';

interface ScrapingOptions {
  batchSize: number;
  maxRetries: number;
  delay: number;
  concurrency: number;
  initOnly: boolean;
  reset: boolean;
  status: boolean;
  test: boolean;
}

class PalindromeScraper {
  private client: CheckCarApiClient;
  private tracker: PalindromeTracker;
  private options: ScrapingOptions;

  constructor(options: ScrapingOptions) {
    this.options = options;
    this.client = new CheckCarApiClient({ 
      requestDelay: options.delay,
      concurrency: options.concurrency,
      batchDelay: 1500 // 1.5 second delay between batches
    });
    this.tracker = new PalindromeTracker();
  }

  /**
   * Main entry point for the scraper
   */
  async run(): Promise<void> {
    console.log('🔍 Palindrome License Plate Scraper Starting...');
    console.log(`📊 Total possible palindromes: ${TOTAL_PALINDROMES.toLocaleString()}`);
    
    // Handle different command modes
    if (this.options.status) {
      this.tracker.printProgress();
      return;
    }

    if (this.options.reset) {
      this.tracker.resetAllToPending();
      this.tracker.printProgress();
      return;
    }

    // Initialize palindromes for tracking
    await this.initializePalindromes();

    if (this.options.initOnly) {
      console.log('✅ Initialization complete. Use --status to see progress.');
      return;
    }

    // Start scraping process
    await this.startScraping();
  }

  /**
   * Initialize palindromes for tracking
   */
  private async initializePalindromes(): Promise<void> {
    console.log('🔧 Initializing palindromes for tracking...');
    
    const existingCount = Object.keys(this.tracker.getProgress().palindromes).length;
    if (existingCount === 0) {
      // Initialize all palindromes if none exist
      const palindromeList = this.options.test 
        ? generateAllPalindromes({ sevenDigit: true, eightDigit: true, maxGenerate: 40 })
        : generateAllPalindromes();

      this.tracker.initializePalindromes(palindromeList, this.options.maxRetries);
      console.log(`✅ Initialized ${palindromeList.length} palindromes`);
    } else {
      console.log(`✅ Found ${existingCount} existing palindromes in tracking.`);
    }
  }

  /**
   * Start the scraping process
   */
  private async startScraping(): Promise<void> {
    console.log('🚀 Starting scraping process...');
    
    let totalProcessed = 0;
    let round = 1;

    while (true) {
      const palindromesToScrape = this.tracker.getPalindromesToScrape(this.options.batchSize);
      
      if (palindromesToScrape.length === 0) {
        console.log('✅ No more palindromes to scrape!');
        break;
      }

      console.log(`\n📦 Round ${round}: Processing batch of ${palindromesToScrape.length} palindromes`);
      
      // Scrape batch
      const results = await this.client.queryBatch(palindromesToScrape);
      
      // Update tracking
      for (const result of results) {
        console.log(`🔄 Updating status for ${result.plateNumber}: success=${result.success}, found=${result.data?.found}, isOffRoad=${result.data?.isOffRoad}`);
        this.tracker.updatePalindromeStatus(result);
        totalProcessed++;
        
        // Log different types of findings
        if (result.success && result.data?.found) {
          if (result.data.isOffRoad) {
            console.log(`🚫 Off-road vehicle (not saving): ${result.plateNumber}`);
          } else {
            console.log(`🎯 Found vehicle: ${result.plateNumber} - ${result.data.manufacturer || 'Unknown'} ${result.data.model || ''} ${result.data.year || ''}`);
          }
        } else if (result.success && !result.data?.found) {
          console.log(`❌ Not found: ${result.plateNumber}`);
        } else {
          console.log(`⚠️  Error: ${result.plateNumber} - ${result.error}`);
        }
      }

      // Save found vehicles to database
      await this.savePalindromesToDatabase();

      // Print progress every batch
      this.tracker.printProgress();

      console.log(`✅ Batch ${round} complete. Total processed: ${totalProcessed}`);
      
      // Small delay between batches
      if (palindromesToScrape.length === this.options.batchSize) {
        console.log('⏳ Waiting 200 ms before next batch...');
        await this.sleep(200);
      }
      
      round++;
    }

    console.log(`🏁 Scraping complete! Total processed: ${totalProcessed}`);
    
    // Print final summary with insights
    const finalProgress = this.tracker.getProgress();
    this.tracker.printProgress();
    
    const totalVehiclesFound = finalProgress.found + finalProgress.offRoad;
    const activeRate = totalVehiclesFound > 0 ? (finalProgress.found / totalVehiclesFound * 100).toFixed(1) : '0';
    
    console.log(`📈 Final Summary:`);
    console.log(`- Total vehicles found: ${totalVehiclesFound}`);
    console.log(`- Active vehicles: ${finalProgress.found} (${activeRate}%)`);
    console.log(`- Off-road vehicles: ${finalProgress.offRoad}`);
    console.log(`- Saved to database: ${finalProgress.addedToDatabase}`);
    
    // Estimate actual active palindromes in the wild
    if (totalVehiclesFound > 50) { // Only estimate if we have enough data
      const estimatedActiveTotal = Math.round((finalProgress.totalPalindromes * finalProgress.found) / totalVehiclesFound);
      console.log(`📊 Estimated active palindromes on road: ~${estimatedActiveTotal.toLocaleString()}`);
    }
  }

  /**
   * Save found palindromes to the database
   */
  private async savePalindromesToDatabase(): Promise<void> {
    const foundPalindromes = this.tracker.getFoundNotInDatabase();
    
    if (foundPalindromes.length === 0) {
      return;
    }

    console.log(`💾 Processing ${foundPalindromes.length} found vehicles for database...`);

    let savedCount = 0;
    let skippedOffRoadCount = 0;

    for (const palindromeStatus of foundPalindromes) {
      try {
        const vehicleData = palindromeStatus.data;
        
        // Skip if no vehicle data is available
        if (!vehicleData) {
          console.warn(`⚠️  No vehicle data for ${palindromeStatus.plateNumber}, skipping database save`);
          continue;
        }
        
        // Skip off-road vehicles - don't save to database but mark as processed
        if (vehicleData.isOffRoad) {
          this.tracker.markAddedToDatabase(palindromeStatus.plateNumber);
          skippedOffRoadCount++;
          continue;
        }
        
        // Get or create brand (manufacturer)
        let brandId: string | null = null;
        if (vehicleData.manufacturer) {
          brandId = await this.getOrCreateBrand(vehicleData.manufacturer);
        }

        // Insert palindrome record
        await db.insert(palindromes).values({
          id: palindromeStatus.plateNumber,
          brandId,
          model: vehicleData.model,
          year: vehicleData.year,
          color: vehicleData.color,
          // Note: We're not fetching images yet as per requirements
          picture: null,
          userProfileId: null, // Not found by a user yet
          categoryId: null, // No category system yet
          foundAt: null, // Not found by a user yet
        });

        this.tracker.markAddedToDatabase(palindromeStatus.plateNumber);
        savedCount++;
        console.log(`✅ Saved ${palindromeStatus.plateNumber} to database`);
        
      } catch (error) {
        console.error(`❌ Error saving ${palindromeStatus.plateNumber} to database:`, error);
      }
    }

    if (savedCount > 0) {
      console.log(`💾 Saved ${savedCount} active vehicles to database`);
    }
    if (skippedOffRoadCount > 0) {
      console.log(`🚫 Skipped ${skippedOffRoadCount} off-road vehicles (marked as processed)`);
    }
  }

  /**
   * Get existing brand or create new one
   */
  private async getOrCreateBrand(brandName: string): Promise<string> {
    try {
      // Check if brand exists
      const existingBrand = await db
        .select()
        .from(brands)
        .where(eq(brands.name, brandName))
        .limit(1);

      if (existingBrand.length > 0) {
        return existingBrand[0].id;
      }

      // Create new brand
      const newBrand = await db
        .insert(brands)
        .values({ name: brandName })
        .returning();

      return newBrand[0].id;
    } catch (error) {
      console.error(`Error handling brand ${brandName}:`, error);
      throw error;
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    const options: ScrapingOptions = {
      batchSize: BATCH_SIZE,
      maxRetries: MAX_RETRIES,
      delay: DELAY,
      concurrency: CONCURRENCY,
      initOnly: INIT_ONLY,
      reset: RESET,
      status: STATUS,
      test: TEST,
    };
    
    console.log('🔧 Configuration:', {
      batchSize: options.batchSize,
      maxRetries: options.maxRetries,
      delay: options.delay,
      concurrency: options.concurrency,
      test: options.test,
      initOnly: options.initOnly,
      reset: options.reset,
      status: options.status,
    });
    
    const scraper = new PalindromeScraper(options);
    await scraper.run();
  } catch (error) {
    console.error('❌ Scraper failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main();
}

export { PalindromeScraper };