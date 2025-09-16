/**
 * API client for check-car.co.il vehicle information
 * Uses direct HTTP requests to query vehicle data by license plate number
 */

import { CheerioAPI, load, Cheerio } from 'cheerio';

export interface VehicleData {
  plateNumber: string;
  found: boolean;
  isOffRoad?: boolean; // Vehicle registration is not valid/active
  manufacturer?: string;
  model?: string;
  year?: number;
  vehicleType?: string;
  engineVolume?: number;
  fuelType?: string;
  chassisNumber?: string;
  registrationDate?: string;
  productionCountry?: string;
  color?: string;
  weight?: number;
  seats?: number;
  rawData?: Record<string, unknown>;
}

export interface ScrapingResult {
  plateNumber: string;
  success: boolean;
  data?: VehicleData;
  error?: string;
  statusCode?: number;
  timestamp: Date;
}

export class CheckCarApiClient {
  private baseUrl = 'https://www.check-car.co.il/report/';
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private requestDelay = 800; // 0.8 second delay between requests
  private concurrency = 16; // Number of parallel requests
  private batchDelay = 1500; // Delay between batches in milliseconds

  constructor(options?: { requestDelay?: number; userAgent?: string; concurrency?: number; batchDelay?: number }) {
    if (options?.requestDelay) this.requestDelay = options.requestDelay;
    if (options?.userAgent) this.userAgent = options.userAgent;
    if (options?.concurrency) this.concurrency = options.concurrency;
    if (options?.batchDelay) this.batchDelay = options.batchDelay;
  }

  /**
   * Query vehicle information for a specific license plate
   */
  async queryVehicle(plateNumber: string): Promise<ScrapingResult> {
    const startTime = new Date();
    
    try {
      const url = `${this.baseUrl}${plateNumber}/`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      });

      if (!response.ok) {
        return {
          plateNumber,
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
          timestamp: startTime,
        };
      }

      const html = await response.text();
      const vehicleData = this.parseVehicleData(plateNumber, html);

      return {
        plateNumber,
        success: true,
        data: vehicleData,
        timestamp: startTime,
      };

    } catch (error) {
      return {
        plateNumber,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: startTime,
      };
    }
  }

  /**
   * Parse vehicle data from HTML response
   */
  private parseVehicleData(plateNumber: string, html: string): VehicleData {
    const $ = load(html);

    // Check if vehicle was not found
    const notFoundTitle = $('h1').first();
    if (notFoundTitle.text().includes('לא נמצא')) {
      return {
        plateNumber,
        found: false,
      };
    }

    // Check if vehicle is off the road (registration not valid)
    const bodyText = $('body').text();
    const isOffRoad = bodyText.includes('הרישיון של רכב זה אינו בתוקף') || 
                     bodyText.includes('רכב זה ירד מהכביש') ||
                     bodyText.includes('תאריך ירידה מהכביש');
    
    if (isOffRoad) {
      return {
        plateNumber,
        found: true,
        isOffRoad: true,
      };
    }

    // Parse vehicle information from the page
    const vehicleData: VehicleData = {
      plateNumber,
      found: true,
      isOffRoad: false,
    };

    try {
      // Extract data using the structured format: <span class="label">FIELD</span><span class="value">VALUE</span>
      // Extract vehicle information using improved selectors
      vehicleData.manufacturer = this.extractValueByDataName($, 'tozar') || this.extractValueByLabel($, 'שם היצרן') || this.extractValueByLabel($, 'שם התוצר');
      vehicleData.model = this.extractValueByDataName($, 'kinuy_mishari') || this.extractValueByLabel($, 'כינוי מסחרי') || this.extractValueByDataName($, 'degem_nm') || this.extractValueByLabel($, 'מספר דגם');
      vehicleData.color = this.extractValueByDataName($, 'tzeva_rechev') || this.extractValueByLabel($, 'צבע רכב');
   
      
      // Parse year
      const yearStr = this.extractValueByLabel($, 'שנת ייצור');
      if (yearStr) {
        vehicleData.year = parseInt(yearStr);
      }
      
      // Extract other fields if available
      vehicleData.engineVolume = parseInt(this.extractValueByLabel($, 'נפח מנוע') || '0') || undefined;
      vehicleData.fuelType = this.extractValueByLabel($, 'סוג דלק');
      vehicleData.chassisNumber = this.extractValueByLabel($, 'מספר שילדה');
      vehicleData.registrationDate = this.extractValueByLabel($, 'מועד עלייה לכביש');
      vehicleData.vehicleType = this.extractValueByLabel($, 'מרכב');
      vehicleData.productionCountry = this.extractValueByLabel($, 'ארץ ייצור');
      vehicleData.weight = parseInt(this.extractValueByLabel($, 'משקל כולל') || '0') || undefined;
      vehicleData.seats = parseInt(this.extractValueByLabel($, 'מספר מושבים') || '0') || undefined;

    } catch (error) {
      console.warn(`Error parsing vehicle data for ${plateNumber}:`, error);
    }

    return vehicleData;
  }

  /**
   * Extract value from structured HTML format: <span class="label">FIELD</span><span class="value">VALUE</span>
   */
  private extractValueByLabel($: CheerioAPI, labelText: string): string | undefined {
    // Find the span with class="label" containing the labelText
    const labelSpan = $('span.label').filter((_, element) => {
      return $(element).text().trim() === labelText;
    });
    
    if (labelSpan.length > 0) {
      // Get the next sibling span with class="value"
      const valueSpan = labelSpan.next('span.value');
      if (valueSpan.length > 0) {
        return valueSpan.text().trim();
      }
    }
    
    return undefined;
  }

  /**
   * Extract value from div with data-name attribute
   * Looks for: <div class="table_col type-string" data-name="tozar"><span class="label">שם היצרן</span><span class="value">שברולט</span></div>
   */
  private extractValueByDataName($: CheerioAPI, dataName: string): string | undefined {
    // Find the div with the specific data-name attribute
    const containerDiv = $(`div[data-name="${dataName}"]`);
    
    if (containerDiv.length > 0) {
      // Look for span with class="value" inside this div
      const valueSpan = containerDiv.find('span.value');
      if (valueSpan.length > 0) {
        return valueSpan.text().trim();
      }
    }
    
    return undefined;
  }

  /**
   * Find a section element by its heading text
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private findSectionByText($: CheerioAPI, text: string): Cheerio<any> {
    const headings = $('h1, h2, h3, h4, h5, h6, .section-title');
    for (let i = 0; i < headings.length; i++) {
      const heading = headings.eq(i);
      if (heading.text().includes(text)) {
        return heading.parent().length ? heading.parent() : heading.next();
      }
    }
    return $(); // Return empty cheerio object
  }

  /**
   * Extract field value from a section
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractFieldValue(section: Cheerio<any>, fieldName: string): string | undefined {
    const text = section.text() || '';
    
    // Try multiple patterns for Hebrew text parsing
    const patterns = [
      new RegExp(`${fieldName}([^\\n]*?)([\\n]|$)`, 'g'),
      new RegExp(`${fieldName}\\s*:?\\s*([^\\n\\s]+)`, 'g'),
      new RegExp(`${fieldName}([^א-ת]*?)([א-ת]|$)`, 'g'),
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match && match[1]) {
        return match[1].trim().replace(/[:;,]/g, '');
      }
    }

    return undefined;
  }

  /**
   * Add delay between requests to be respectful
   */
  async wait(customDelay?: number): Promise<void> {
    const delay = customDelay ?? this.requestDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Process a batch of plate numbers with controlled concurrency
   */
  private async processBatch(plateNumbers: string[], batchIndex: number, totalBatches: number): Promise<ScrapingResult[]> {
    console.log(`📦 Processing batch ${batchIndex + 1}/${totalBatches} (${plateNumbers.length} palindromes)`);
    
    const promises = plateNumbers.map(async (plateNumber, index) => {
      // Stagger the start times to avoid all requests hitting at once
      const staggerDelay = (index % this.concurrency) * (this.requestDelay / this.concurrency);
      if (staggerDelay > 0) {
        await this.wait(staggerDelay);
      }
      
      console.log(`Querying ${plateNumber}...`);
      return this.queryVehicle(plateNumber);
    });

    return Promise.all(promises);
  }

  /**
   * Batch query multiple vehicles with parallel processing and rate limiting
   */
  async queryBatch(plateNumbers: string[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // Split into smaller batches for parallel processing
    const batches: string[][] = [];
    for (let i = 0; i < plateNumbers.length; i += this.concurrency) {
      batches.push(plateNumbers.slice(i, i + this.concurrency));
    }
    
    console.log(`🚀 Processing ${plateNumbers.length} palindromes in ${batches.length} parallel batches (${this.concurrency} concurrent requests per batch)`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResults = await this.processBatch(batch, i, batches.length);
      results.push(...batchResults);
      
      // Add delay between batches (except for the last one)
      if (i < batches.length - 1) {
        console.log(`⏳ Waiting ${this.batchDelay}ms before next batch...`);
        await this.wait(this.batchDelay);
      }
    }
    
    return results;
  }

  /**
   * Legacy sequential method for comparison/fallback
   */
  async queryBatchSequential(plateNumbers: string[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    for (let i = 0; i < plateNumbers.length; i++) {
      const plateNumber = plateNumbers[i];
      console.log(`Querying ${i + 1}/${plateNumbers.length}: ${plateNumber}`);
      
      const result = await this.queryVehicle(plateNumber);
      results.push(result);
      
      // Add delay between requests (except for the last one)
      if (i < plateNumbers.length - 1) {
        await this.wait();
      }
    }
    
    return results;
  }
}