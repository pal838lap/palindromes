# Supabase Local Development

This folder contains configuration files for running Supabase locally during development.

## Purpose

This folder is **only for local development** - it provides the PostgreSQL database infrastructure that your Drizzle ORM connects to.

## What's in this folder

- `config.toml` - Essential configuration for local Supabase services
- `.branches/`, `.temp/`, `.gitignore` - Supabase CLI internal files

## Important Notes

- **Database schema is managed by Drizzle** in `src/lib/db/schema/`
- **Migrations are handled by Drizzle** in `src/lib/db/migrations/`
- This folder just provides the PostgreSQL infrastructure
- Don't add schema files here - use Drizzle for all database management

## Local Development Commands

```bash
npm run supabase:start   # Start local database
npm run supabase:stop    # Stop local database
npm run supabase:status  # Check service status
```

## Workflow

1. Start Supabase: `npm run supabase:start`
2. Apply your schema: `npm run db:push` or `npm run db:migrate`
3. Your Drizzle schema becomes the database structure