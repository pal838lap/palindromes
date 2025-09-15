import { count, eq } from 'drizzle-orm'
import { db, users } from './db/index'
import { DashboardStats } from './api/api.types'

// Database operations using Drizzle ORM
export class DBService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    try {
      // Count total users
      const [{ totalUsers }] = await db
        .select({ totalUsers: count() })
        .from(users)
      
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
  }

  // Example: Get user by ID (for future use)
  async getUserById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1)
      
      return user || null
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  }

  // Example: Get all users (for admin purposes)
  async getAllUsers() {
    try {
      return await db.select().from(users)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  }
}

// Export singleton instance
export const drizzleDb = new DBService()

// Export types for external use
export type { User, NewUser } from './db/schema/auth'
