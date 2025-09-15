# Palindrome License Plate Database Schema & Components

## Database Schema Overview

### Core Tables Created
- **`userProfiles`** - Admin-managed user profiles (separate from auth users)
  - `id`, `name`, `avatar` (optional), timestamps
- **`palindromes`** - Main palindrome tracking table
  - `id` (palindrome string as PK), `userProfileId` (nullable), `picture`, `model`, `color`, `foundAt`
- **`brands`** - Normalized car brands (`id`, `name`, `createdAt`)
- **`categories`** - Normalized palindrome categories (`id`, `name`, `description`)

### Auth Enhancement
- Added `isAdmin` boolean field to existing `users` table (defaults to false)

### Key Design Decisions
- Palindrome string itself used as primary key for uniqueness
- Foreign keys allow null (palindromes can exist before being "found")
- Proper indexing for common queries (user, category, prefix searches)
- Normalized brands/categories for data integrity

## Components Created

### PalindromeCard Component
- **Location**: `src/components/palindrome-card.tsx`
- **Features**: 
  - Full detailed card with image, status badges, vehicle info
  - Compact variant for lists
  - Action handlers (edit, delete, view details)
  - Responsive design with dark mode support
  - Next.js Image optimization with fallbacks

### Badge Component
- **Location**: `src/components/ui/badge.tsx`
- Created missing shadcn/ui Badge component with variants

## Showcase Page
- **Location**: `src/app/showcase/page.tsx`
- **Purpose**: Demo both card variants with comprehensive dummy data
- **Navigation**: Added to both mobile and desktop nav menus
- **Features**: Tests all data scenarios (found/unfound, missing images, optional fields)

## Configuration Updates
- **next.config.ts**: Added image domains for Unsplash (`images.unsplash.com`) and placeholder images
- **Database migrations**: Generated and applied for new schema

## Key Query Patterns Supported
```sql
-- All palindromes found by user
SELECT p.*, up.name FROM palindromes p JOIN userProfiles up ON p.userProfileId = up.id WHERE up.name = ?

-- All palindromes by category  
SELECT p.*, c.name FROM palindromes p JOIN categories c ON p.categoryId = c.id WHERE c.name = ?

-- Prefix searches
SELECT * FROM palindromes WHERE id LIKE '12%'
```

## Files Modified/Created
- `src/lib/db/schema/palindromes.ts` - New schema tables
- `src/lib/db/schema/auth.ts` - Added isAdmin field
- `src/components/palindrome-card.tsx` - New component
- `src/components/ui/badge.tsx` - New UI component
- `src/app/showcase/page.tsx` - New demo page
- Navigation components - Added showcase link
- `next.config.ts` - Image domain configuration