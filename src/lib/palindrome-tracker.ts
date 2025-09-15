/**
 * Tracking system for palindrome scraping progress
 * Manages a local JSON file to track which palindromes have been:
 * - Scraped successfully
 * - Not found in database
 * - Failed and need retry
 * - Pending for scraping
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ScrapingResult, VehicleData } from './check-car-client';

export interface PalindromeStatus {
  plateNumber: string;
  status: 'pending' | 'found' | 'not_found' | 'error' | 'retry_needed' | 'off_road';
  lastAttempt?: Date;
  attemptCount: number;
  maxRetries: number;
  data?: VehicleData;
  lastError?: string;
  addedToDatabase?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScrapingProgress {
  totalPalindromes: number;
  pending: number;
  found: number;
  notFound: number;
  errors: number;
  retryNeeded: number;
  offRoad: number;
  addedToDatabase: number;
  lastUpdated: Date;
  palindromes: Record<string, PalindromeStatus>;
}

export class PalindromeTracker {
  private filePath: string;
  private progress: ScrapingProgress;

  constructor(dataDir: string = './scraping-data') {
    // Create data directory if it doesn't exist
    if (!existsSync(dataDir)) {
      try {
        mkdirSync(dataDir, { recursive: true });
      } catch {
        console.warn(`Could not create directory ${dataDir}, using current directory`);
        dataDir = '.';
      }
    }
    
    this.filePath = join(dataDir, 'palindrome-scraping-progress.json');
    this.progress = this.loadProgress();
  }

  /**
   * Load progress from JSON file or create new if doesn't exist
   */
  private loadProgress(): ScrapingProgress {
    if (existsSync(this.filePath)) {
      try {
        const data = readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(data);
        
        // Parse dates back from JSON
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(parsed.palindromes).forEach((palindrome: any) => {
          palindrome.createdAt = new Date(palindrome.createdAt);
          palindrome.updatedAt = new Date(palindrome.updatedAt);
          if (palindrome.lastAttempt) {
            palindrome.lastAttempt = new Date(palindrome.lastAttempt);
          }
        });
        
        return parsed;
      } catch (error) {
        console.warn('Error loading progress file, starting fresh:', error);
      }
    }

    return {
      totalPalindromes: 0,
      pending: 0,
      found: 0,
      notFound: 0,
      errors: 0,
      retryNeeded: 0,
      offRoad: 0,
      addedToDatabase: 0,
      lastUpdated: new Date(),
      palindromes: {},
    };
  }

  /**
   * Save progress to JSON file
   */
  private saveProgress(): void {
    try {
      const dataToSave = {
        ...this.progress,
        lastUpdated: new Date(),
      };
      
      writeFileSync(this.filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving progress file:', error);
    }
  }

  /**
   * Initialize tracking for a list of palindromes
   */
  initializePalindromes(palindromes: string[], maxRetries: number = 3): void {
    const now = new Date();
    let addedCount = 0;

    for (const palindrome of palindromes) {
      if (!this.progress.palindromes[palindrome]) {
        this.progress.palindromes[palindrome] = {
          plateNumber: palindrome,
          status: 'pending',
          attemptCount: 0,
          maxRetries,
          addedToDatabase: false,
          createdAt: now,
          updatedAt: now,
        };
        addedCount++;
      }
    }

    this.progress.totalPalindromes = Object.keys(this.progress.palindromes).length;
    this.updateCounts();
    
    if (addedCount > 0) {
      console.log(`Initialized ${addedCount} new palindromes for tracking`);
      this.saveProgress();
    }
  }

  /**
   * Update palindrome status based on scraping result
   */
  updatePalindromeStatus(result: ScrapingResult): void {
    const palindrome = this.progress.palindromes[result.plateNumber];
    if (!palindrome) {
      console.warn(`Palindrome ${result.plateNumber} not found in tracking`);
      return;
    }

    palindrome.lastAttempt = result.timestamp;
    palindrome.attemptCount++;
    palindrome.updatedAt = new Date();

    if (result.success && result.data) {
      if (result.data.found) {
        if (result.data.isOffRoad) {
          palindrome.status = 'off_road';
          palindrome.data = result.data;
        } else {
          palindrome.status = 'found';
          palindrome.data = result.data;
        }
      } else {
        palindrome.status = 'not_found';
      }
    } else {
      palindrome.lastError = result.error;
      
      if (palindrome.attemptCount >= palindrome.maxRetries) {
        palindrome.status = 'error';
      } else {
        palindrome.status = 'retry_needed';
      }
    }

    this.updateCounts();
    this.saveProgress();
  }

  /**
   * Mark palindrome as added to database
   */
  markAddedToDatabase(plateNumber: string): void {
    const palindrome = this.progress.palindromes[plateNumber];
    if (palindrome) {
      palindrome.addedToDatabase = true;
      palindrome.updatedAt = new Date();
      this.updateCounts();
      this.saveProgress();
    }
  }

  /**
   * Get palindromes that need to be scraped (pending + retry_needed)
   */
  getPalindromesToScrape(limit?: number): string[] {
    const toScrape = Object.values(this.progress.palindromes)
      .filter(p => p.status === 'pending' || p.status === 'retry_needed')
      .sort((a, b) => {
        // Prioritize pending over retry, then by attempt count
        if (a.status !== b.status) {
          return a.status === 'pending' ? -1 : 1;
        }
        return a.attemptCount - b.attemptCount;
      })
      .map(p => p.plateNumber);

    return limit ? toScrape.slice(0, limit) : toScrape;
  }

  /**
   * Get palindromes that were found but not yet added to database (excluding off-road)
   */
  getFoundNotInDatabase(): PalindromeStatus[] {
    return Object.values(this.progress.palindromes)
      .filter(p => (p.status === 'found' || p.status === 'off_road') && !p.addedToDatabase);
  }

  /**
   * Get current progress statistics
   */
  getProgress(): ScrapingProgress {
    this.updateCounts();
    return { ...this.progress };
  }

  /**
   * Update the counts in progress object
   */
  private updateCounts(): void {
    const palindromes = Object.values(this.progress.palindromes);
    
    this.progress.pending = palindromes.filter(p => p.status === 'pending').length;
    this.progress.found = palindromes.filter(p => p.status === 'found').length;
    this.progress.notFound = palindromes.filter(p => p.status === 'not_found').length;
    this.progress.errors = palindromes.filter(p => p.status === 'error').length;
    this.progress.retryNeeded = palindromes.filter(p => p.status === 'retry_needed').length;
    this.progress.offRoad = palindromes.filter(p => p.status === 'off_road').length;
    this.progress.addedToDatabase = palindromes.filter(p => p.addedToDatabase).length;
  }

  /**
   * Print progress summary
   */
  printProgress(): void {
    const progress = this.getProgress();
    
    console.log('\n=== Palindrome Scraping Progress ===');
    console.log(`Total palindromes: ${progress.totalPalindromes}`);
    console.log(`Pending: ${progress.pending}`);
    console.log(`Found (active): ${progress.found}`);
    console.log(`Off-road: ${progress.offRoad}`);
    console.log(`Not found: ${progress.notFound}`);
    console.log(`Need retry: ${progress.retryNeeded}`);
    console.log(`Errors: ${progress.errors}`);
    console.log(`Added to database: ${progress.addedToDatabase}`);
    console.log(`Last updated: ${progress.lastUpdated.toLocaleString()}`);
    
    const completedPercent = progress.totalPalindromes > 0 
      ? Math.round(((progress.found + progress.offRoad + progress.notFound + progress.errors) / progress.totalPalindromes) * 100)
      : 0;
    console.log(`Progress: ${completedPercent}%`);
    
    // Show how many active vehicles vs. total vehicles found
    const totalVehiclesFound = progress.found + progress.offRoad;
    if (totalVehiclesFound > 0) {
      console.log(`Active vehicles: ${progress.found}/${totalVehiclesFound} (${Math.round((progress.found / totalVehiclesFound) * 100)}%)`);
    }
    console.log('=====================================\n');
  }

  /**
   * Reset all palindromes to pending status (for testing)
   */
  resetAllToPending(): void {
    const now = new Date();
    Object.values(this.progress.palindromes).forEach(palindrome => {
      palindrome.status = 'pending';
      palindrome.attemptCount = 0;
      palindrome.lastAttempt = undefined;
      palindrome.lastError = undefined;
      palindrome.data = undefined;
      palindrome.addedToDatabase = false;
      palindrome.updatedAt = now;
    });
    
    this.updateCounts();
    this.saveProgress();
    console.log('Reset all palindromes to pending status');
  }

  /**
   * Get file path for the tracking file (useful for gitignore)
   */
  getTrackingFilePath(): string {
    return this.filePath;
  }
}