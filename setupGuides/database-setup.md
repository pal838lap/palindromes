# Database Setup Guide

This guide walks you through setting up PostgreSQL with Drizzle ORM and NextAuth.js integration.

## Prerequisites

- Node.js and npm installed
- Docker (for local development)
- Supabase CLI: `npm install -g supabase`

## Local Development Setup (Recommended)

### 1. Start Local Supabase

```bash
# Start local Supabase with Docker
npm run supabase:start
```

This starts PostgreSQL on `localhost:54322` with user/password: `postgres/postgres`

### 2. Environment Variables

Update your `.env.local`:

```bash
# Database - Local Supabase
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret_for_local_development_only

# OAuth providers (see setup guides)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Apply Database Schema

```bash
# Push schema to database
npm run db:push
```

### 4. Verify Setup

```bash
# Open Drizzle Studio to browse your database
npm run db:studio
```

## Production Setup

### 1. Create Supabase Project

- Go to [supabase.com](https://supabase.com) → New Project
- Note your database password

### 2. Get Connection String

- Settings → Database → Connection pooling
- Copy the connection string (format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)

### 3. Production Environment Variables

```bash
# Database - Hosted Supabase  
DATABASE_URL=your-supabase-connection-string

# Authentication
NEXTAUTH_URL=https://yourapp.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# OAuth providers
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
```

### 4. Deploy Schema

```bash
# Apply schema to production database
npm run db:push
```

## Database Operations

### Available Scripts

```bash
npm run supabase:start    # Start local Supabase
npm run supabase:stop     # Stop local Supabase
npm run supabase:reset    # Reset local database
npm run supabase:status   # Check service status

npm run db:push           # Apply schema changes
npm run db:generate       # Generate migrations
npm run db:studio         # Open database browser
```

### Schema Structure

The project includes NextAuth.js tables:
- `users` - User accounts
- `accounts` - OAuth provider accounts  
- `sessions` - User sessions
- `verification_tokens` - Email verification

Schema files are in `src/lib/db/schema/`.

## Adding New Tables

1. **Create schema file** (`src/lib/db/schema/app.ts`):
```typescript
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  userId: text('userId').references(() => users.id),
  createdAt: timestamp('createdAt').defaultNow(),
})
```

2. **Apply changes**:
```bash
npm run db:push
```

3. **Add to database operations** (`src/lib/db/index.ts`)

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` 
- Generate secure production secrets: `openssl rand -base64 32`
- Use connection pooling URLs in production
- Validate inputs with Zod

## Troubleshooting

**Connection issues:** Verify `DATABASE_URL` format and database is running
**Schema errors:** Run `npm run db:push` to sync schema
**Auth not working:** Check OAuth provider setup and callback URLs

Your database is now ready with type-safe operations via Drizzle ORM!
