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
const START_FROM = '1100011';             // Start scraping from this palindrome (resets all >= this to pending). Set to '' to disable.
const INIT_ONLY = false;                 // Only initialize palindromes, don't scrape
const RESET = false;                     // Reset all palindromes to pending status
const STATUS = false;                    // Show current progress and exit
const TEST = false;                      // Test mode with limited palindromes (40)

// ===============================================

import { existsSync, unlinkSync } from 'fs';
import { generateAllPalindromes, TOTAL_PALINDROMES } from '../lib/palindrome-generator';
import { CheckCarApiClient } from '../lib/check-car-client';
import { PalindromeTracker } from '../lib/palindrome-tracker';
import { db } from '../lib/db';
import { palindromes, brands } from '../lib/db/schema/palindromes';
import { eq, inArray, and, isNotNull } from 'drizzle-orm';

interface ScrapingOptions {
  batchSize: number;
  maxRetries: number;
  delay: number;
  concurrency: number;
  startFrom: string;
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

    // Remove previous run's tracking file so each run starts fresh
    const progressFile = './scraping-data/palindrome-scraping-progress.json';
    if (existsSync(progressFile)) {
      console.log('🗑️  Removing previous tracking file for fresh run...');
      unlinkSync(progressFile);
    }

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
      const palindromesToScrape = this.tracker.getPalindromesToScrape(this.options.batchSize, this.options.startFrom);
      
      if (palindromesToScrape.length === 0) {
        console.log('✅ No more palindromes to scrape!');
        break;
      }

      // Filter out palindromes already assigned to a user in the DB
      const filteredPalindromes = await this.filterOutAssignedInDb(palindromesToScrape);
      const skippedPalindromes = palindromesToScrape.filter(p => !filteredPalindromes.includes(p));
      
      // Mark skipped palindromes as found + addedToDatabase so they exit the pending pool
      if (skippedPalindromes.length > 0) {
        this.tracker.markAsAlreadyInDatabase(skippedPalindromes);
      }
      
      if (filteredPalindromes.length === 0) {
        console.log(`⏭️  All ${palindromesToScrape.length} palindromes in this batch are already assigned — skipping`);
        round++;
        continue;
      }

      console.log(`\n📦 Round ${round}: Processing batch of ${filteredPalindromes.length} palindromes (${palindromesToScrape.length - filteredPalindromes.length} skipped — already assigned)`);
      
      // Scrape batch
      const results = await this.client.queryBatch(filteredPalindromes);
      
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
      if (filteredPalindromes.length > 0) {
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
   * Save found palindromes to the database.
   * - Skips palindromes already assigned to a user (userProfileId set).
   * - Updates existing unassigned records with fresh vehicle data.
   * - Inserts new records for palindromes not yet in the DB.
   */
  private async savePalindromesToDatabase(): Promise<void> {
    const foundPalindromes = this.tracker.getFoundNotInDatabase();
    
    if (foundPalindromes.length === 0) {
      return;
    }

    console.log(`💾 Processing ${foundPalindromes.length} found vehicles for database...`);

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedAssignedCount = 0;
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

        // Check if palindrome already exists in the DB
        const existing = await db
          .select({
            id: palindromes.id,
            userProfileId: palindromes.userProfileId,
          })
          .from(palindromes)
          .where(eq(palindromes.id, palindromeStatus.plateNumber))
          .limit(1);

        if (existing.length > 0) {
          // Already assigned to a user — do not overwrite
          if (existing[0].userProfileId) {
            console.log(`🔒 ${palindromeStatus.plateNumber} already assigned to user — skipping`);
            this.tracker.markAddedToDatabase(palindromeStatus.plateNumber);
            skippedAssignedCount++;
            continue;
          }

          // Exists but unassigned — update with fresh vehicle data
          await db
            .update(palindromes)
            .set({
              brandId,
              model: vehicleData.model ?? null,
              year: vehicleData.year ?? null,
              color: vehicleData.color ?? null,
              updatedAt: new Date(),
            })
            .where(eq(palindromes.id, palindromeStatus.plateNumber));

          this.tracker.markAddedToDatabase(palindromeStatus.plateNumber);
          updatedCount++;
          console.log(`🔄 Updated ${palindromeStatus.plateNumber} in database`);
        } else {
          // New palindrome — insert
          await db.insert(palindromes).values({
            id: palindromeStatus.plateNumber,
            brandId,
            model: vehicleData.model ?? null,
            year: vehicleData.year ?? null,
            color: vehicleData.color ?? null,
            picture: null,
            userProfileId: null,
            categoryId: null,
            foundAt: null,
          });

          this.tracker.markAddedToDatabase(palindromeStatus.plateNumber);
          insertedCount++;
          console.log(`✅ Saved ${palindromeStatus.plateNumber} to database`);
        }
        
      } catch (error) {
        console.error(`❌ Error saving ${palindromeStatus.plateNumber} to database:`, error);
      }
    }

    if (insertedCount > 0) {
      console.log(`💾 Inserted ${insertedCount} new vehicles to database`);
    }
    if (updatedCount > 0) {
      console.log(`🔄 Updated ${updatedCount} existing vehicles in database`);
    }
    if (skippedAssignedCount > 0) {
      console.log(`🔒 Skipped ${skippedAssignedCount} palindromes already assigned to users`);
    }
    if (skippedOffRoadCount > 0) {
      console.log(`🚫 Skipped ${skippedOffRoadCount} off-road vehicles (marked as processed)`);
    }
  }

  /**
   * Filter out palindromes that already exist in the DB with an assigned userProfileId.
   * Returns only the plate numbers that are safe to scrape & write.
   */
  private async filterOutAssignedInDb(plateNumbers: string[]): Promise<string[]> {
    if (plateNumbers.length === 0) return [];

    try {
      const CHUNK_SIZE = 500;
      const assignedIds = new Set<string>();

      for (let i = 0; i < plateNumbers.length; i += CHUNK_SIZE) {
        const chunk = plateNumbers.slice(i, i + CHUNK_SIZE);
        const rows = await db
          .select({ id: palindromes.id })
          .from(palindromes)
          .where(
            and(
              inArray(palindromes.id, chunk),
              isNotNull(palindromes.userProfileId)
            )
          );
        rows.forEach(r => assignedIds.add(r.id));
      }

      const filtered = plateNumbers.filter(p => !assignedIds.has(p));

      if (assignedIds.size > 0) {
        console.log(`🔒 Filtered out ${assignedIds.size} palindromes already assigned to users in DB`);
      }

      return filtered;
    } catch (error) {
      console.error('❌ Error checking DB for assigned palindromes:', error);
      return plateNumbers; // On error, don't filter — safe fallback
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
      startFrom: START_FROM,
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
      startFrom: options.startFrom || 'disabled',
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