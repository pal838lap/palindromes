# Database Architecture

## Stack
Drizzle ORM with PostgreSQL (via Supabase) for type-safe database operations.

## Schema Structure

### Authentication (NextAuth.js)
- `user` - Core user accounts
- `account` - OAuth provider accounts  
- `session` - User sessions
- `verification_token` - Email verification tokens

## Development Commands
```bash
npm run db:push          # Apply schema changes
npm run db:studio        # Open database browser
npm run supabase:start   # Start local database
```

## Adding Tables
1. Define schema in `src/lib/db/schema/`
2. Run `npm run db:push` to apply changes
3. Add operations to `src/lib/db/index.ts`
4. Create API types in `src/lib/api/api.types.ts`

## File Structure
```
src/lib/db/
├── schema/
│   ├── auth.ts          # NextAuth tables
│   └── index.ts         # Schema exports
└── index.ts             # Database client + operations
```