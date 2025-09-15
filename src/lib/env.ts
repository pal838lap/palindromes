/**
 * Environment variables validation and configuration
 */

// Helper function to check if a value is a valid placeholder
function isPlaceholder(value: string): boolean {
  return !value || value.startsWith('your_') || value === 'development' || value === 'http://localhost:3000'
}

export const env = {
  // Database - PostgreSQL via Drizzle
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-please-change-in-production',
  
  // OAuth Providers
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
}

/**
 * Check if required services are configured
 */
export function hasDatabaseConfig(): boolean {
  return !isPlaceholder(env.DATABASE_URL)
}

export function hasAuthProviders(): boolean {
  const hasGithub = !isPlaceholder(env.GITHUB_CLIENT_ID) && !isPlaceholder(env.GITHUB_CLIENT_SECRET)
  const hasGoogle = !isPlaceholder(env.GOOGLE_CLIENT_ID) && !isPlaceholder(env.GOOGLE_CLIENT_SECRET)
  return hasGithub || hasGoogle
}

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const warnings: string[] = []
  
  if (!hasDatabaseConfig()) {
    warnings.push('DATABASE_URL is not configured - database features will not work')
  }
  
  if (!hasAuthProviders()) {
    warnings.push('No OAuth providers configured - authentication will not work')
  }
  
  if (env.IS_PRODUCTION && isPlaceholder(env.NEXTAUTH_SECRET)) {
    warnings.push('NEXTAUTH_SECRET must be set to a secure value in production (generate with: openssl rand -base64 32)')
  }
  
  if (env.IS_PRODUCTION && env.NEXTAUTH_SECRET === 'dev_secret_for_local_development_only') {
    warnings.push('NEXTAUTH_SECRET is using development value - change to a secure secret in production')
  }
  
  if (warnings.length > 0) {
    console.warn('Environment configuration warnings:')
    warnings.forEach(warning => console.warn(`  - ${warning}`))
    console.warn('See .env.example for required variables')
  }
  
  return warnings.length === 0
}
