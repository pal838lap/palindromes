import {
  text,
  timestamp,
  pgTable,
  integer,
  index,
} from 'drizzle-orm/pg-core'

// User profiles table - admin-managed profiles separate from auth users
export const userProfiles = pgTable('userProfile', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  avatar: text('avatar'), // URL to avatar image
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('userProfile_name_idx').on(table.name),
}))

// Brands table - normalized car brands
export const brands = pgTable('brand', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('brand_name_idx').on(table.name),
}))

// Categories table - normalized palindrome categories
export const categories = pgTable('category', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  nameIdx: index('category_name_idx').on(table.name),
}))

// Main palindromes table
export const palindromes = pgTable('palindrome', {
  id: text('id').primaryKey(), // The actual palindrome string (e.g., "12321", "ABCBA")
  userProfileId: text('userProfileId').references(() => userProfiles.id, { 
    onDelete: 'set null' 
  }), // Who found it (nullable if not found yet)
  picture: text('picture'), // URL to picture of the license plate
  brandId: text('brandId').references(() => brands.id, { 
    onDelete: 'set null' 
  }), // Foreign key to brands table
  year: integer('year'), // Car year
  categoryId: text('categoryId').references(() => categories.id, { 
    onDelete: 'set null' 
  }), // Foreign key to categories table
  model: text('model'), // Car model
  color: text('color'), // Car color
  foundAt: timestamp('foundAt', { mode: 'date' }), // When it was found
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  // Index for finding palindromes by user
  userProfileIdx: index('palindrome_userProfile_idx').on(table.userProfileId),
  // Index for finding palindromes by category
  categoryIdx: index('palindrome_category_idx').on(table.categoryId),
  // Index for finding palindromes by brand
  brandIdx: index('palindrome_brand_idx').on(table.brandId),
  // Index for prefix searches on the palindrome itself
  palindromeTextIdx: index('palindrome_text_idx').on(table.id),
  // Index for year-based queries
  yearIdx: index('palindrome_year_idx').on(table.year),
  // Index for found date queries
  foundAtIdx: index('palindrome_foundAt_idx').on(table.foundAt),
}))

// Export types for TypeScript
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
export type Brand = typeof brands.$inferSelect
export type NewBrand = typeof brands.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Palindrome = typeof palindromes.$inferSelect
export type NewPalindrome = typeof palindromes.$inferInsert

// Export joined types for common queries
export type PalindromeWithDetails = Palindrome & {
  userProfile?: UserProfile | null
  brand?: Brand | null
  category?: Category | null
}