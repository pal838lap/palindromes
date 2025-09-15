import { drizzle } from 'drizzle-orm/postgres-js'
import { count, eq } from 'drizzle-orm'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'
import type { DashboardStats } from '../api/api.types'

// Create the connection
const connectionString = env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

// Create postgres client with simpler configuration
const client = postgres(connectionString)

// Create drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: env.NODE_ENV === 'development'
})

// Export the client for direct use if needed
export { client }

// Export schema for external use
export * from './schema'

// Database operations using Drizzle ORM
export const dbOperations = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    try {
      // Count total users
      const [{ totalUsers }] = await db
        .select({ totalUsers: count() })
        .from(schema.users)
      
      return {
        totalUsers,
      }
    } catch (error) {
      console.error('Database error:', error)
      // Return fallback data
      return {
        totalUsers: 0,
      }
    }
  },

  // Get user by ID
  async getUserById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1)
      
      return user || null
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  },

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      return await db.select().from(schema.users)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  },
}
