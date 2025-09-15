/**
 * Palindrome generator for Israeli license plates
 * 
 * Rules:
 * - 7 digits: 1234321 (can start with any digit 1-9)
 * - 8 digits: 12344321 (can only start with 10, 20, 30, 40)
 * - Numbers cannot start with 0
 */

export interface PalindromeRules {
  sevenDigit: boolean;
  eightDigit: boolean;
  maxGenerate?: number;
}

/**
 * Check if a number string is a palindrome
 */
export function isPalindrome(str: string): boolean {
  return str === str.split('').reverse().join('');
}

/**
 * Generate all valid 7-digit palindromes
 * Format: ABCDCBA where A is 1-9, B,C,D can be 0-9
 */
export function generateSevenDigitPalindromes(): string[] {
  const palindromes: string[] = [];
  
  // First digit: 1-9 (cannot be 0)
  for (let a = 1; a <= 9; a++) {
    // Second digit: 0-9
    for (let b = 0; b <= 9; b++) {
      // Third digit: 0-9
      for (let c = 0; c <= 9; c++) {
        // Fourth digit (middle): 0-9
        for (let d = 0; d <= 9; d++) {
          const palindrome = `${a}${b}${c}${d}${c}${b}${a}`;
          palindromes.push(palindrome);
        }
      }
    }
  }
  
  return palindromes;
}

/**
 * Generate all valid 8-digit palindromes
 * Format: ABCDDCBA where AB must be 10, 20, 30, or 40
 */
export function generateEightDigitPalindromes(): string[] {
  const palindromes: string[] = [];
  const validPrefixes = ['10', '20', '30', '40'];
  
  for (const prefix of validPrefixes) {
    const [a, b] = prefix.split('');
    
    // Third digit: 0-9
    for (let c = 0; c <= 9; c++) {
      // Fourth digit: 0-9
      for (let d = 0; d <= 9; d++) {
        // Fifth digit: same as fourth (middle)
        // Sixth digit: same as third
        // Seventh digit: same as second
        // Eighth digit: same as first
        const palindrome = `${a}${b}${c}${d}${d}${c}${b}${a}`;
        palindromes.push(palindrome);
      }
    }
  }
  
  return palindromes;
}

/**
 * Generate all valid palindromes based on rules
 */
export function generateAllPalindromes(rules: PalindromeRules = { sevenDigit: true, eightDigit: true }): string[] {
  const palindromes: string[] = [];
  
  if (rules.sevenDigit) {
    palindromes.push(...generateSevenDigitPalindromes());
  }
  
  if (rules.eightDigit) {
    palindromes.push(...generateEightDigitPalindromes());
  }
  
  // Shuffle the array to randomize scraping order
  const shuffled = palindromes.sort(() => Math.random() - 0.5);
  
  if (rules.maxGenerate) {
    return shuffled.slice(0, rules.maxGenerate);
  }
  
  return shuffled;
}

/**
 * Get total count of possible palindromes
 */
export function getPalindromeCount(rules: PalindromeRules = { sevenDigit: true, eightDigit: true }): number {
  let count = 0;
  
  if (rules.sevenDigit) {
    // 9 choices for first digit (1-9) * 10 * 10 * 10 for middle digits
    count += 9 * 10 * 10 * 10; // 9,000
  }
  
  if (rules.eightDigit) {
    // 4 valid prefixes (10,20,30,40) * 10 * 10 for middle digits
    count += 4 * 10 * 10; // 400
  }
  
  return count;
}

/**
 * Validate if a palindrome follows Israeli license plate rules
 */
export function isValidIsraeliPalindrome(palindrome: string): boolean {
  // Must be exactly 7 or 8 digits
  if (!/^\d{7}$|^\d{8}$/.test(palindrome)) {
    return false;
  }
  
  // Must be a palindrome
  if (!isPalindrome(palindrome)) {
    return false;
  }
  
  // Cannot start with 0
  if (palindrome.startsWith('0')) {
    return false;
  }
  
  // 8-digit palindromes must start with 10, 20, 30, or 40
  if (palindrome.length === 8) {
    const prefix = palindrome.substring(0, 2);
    if (!['10', '20', '30', '40'].includes(prefix)) {
      return false;
    }
  }
  
  return true;
}

// Export for testing and utilities
export const SEVEN_DIGIT_COUNT = 9000;
export const EIGHT_DIGIT_COUNT = 400;
export const TOTAL_PALINDROMES = SEVEN_DIGIT_COUNT + EIGHT_DIGIT_COUNT;