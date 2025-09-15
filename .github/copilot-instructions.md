# Copilot Instructions for Next.js Golden Template

## Project Overview
This is a comprehensive Next.js template project designed to be a production-ready foundation for full-stack progressive web applications. Always reference the project's README.md for the complete tech stack, features, and setup instructions.

## Key Requirements

### 1. Always Reference README.md
- **MUST** review `/README.md` for:
  - Current tech stack and dependencies
  - Project structure and conventions
  - Setup and configuration details
  - Available scripts and commands
  - Environment variables required

### 2. Always Update PROGRESS.md
- **MUST** update `/PROGRESS.md` when:
  - Completing any task or feature
  - Moving between development phases
  - Checking off completed items
  - Adding new issues or blockers
  - Making significant progress on any phase

### 3. Documentation Structure
- **`setupGuides/`** - User setup guides (auth, database, PWA, etc.)
- **`docs/`** - Implementation documentation for developers/AI

### 4. Project Structure Awareness
Follow the established patterns in:
- `app/` - Next.js App Router structure
- `components/` - Reusable UI components
- `lib/` - Utility functions and configurations
- `hooks/` - Custom React hooks
- `types/` - TypeScript definitions

### 5. Development Phases
The project is organized into 9 phases as outlined in PROGRESS.md:
1. Core Setup
2. UI Foundation (Tailwind + Shadcn/ui)
3. Authentication (NextAuth.js + Supabase)
4. Database Integration (Supabase)
5. Data Management (TanStack Query + Zod)
6. PWA Setup
7. Example Implementation
8. Developer Experience
9. Production Ready

### 6. Code Quality Standards
- Use TypeScript throughout
- Follow semantic color system with Tailwind CSS
- Implement dark/light mode support
- Ensure accessibility compliance
- Maintain type safety with Zod validation

### 7. When Making Changes
1. Check current progress in PROGRESS.md
2. Reference README.md for context and standards
3. Make the requested changes
4. Update PROGRESS.md to reflect completed work
5. Update README.md if adding new features or changing setup
6. Add user guides to `setupGuides/` and implementation docs to `docs/`

### 8. Feature Implementation Pattern
When adding new features with database operations, follow this 8-step pattern:

1. **Database Schema** (`src/lib/db/schema/`) - Define tables with Drizzle ORM
2. **Database Operations** (`src/lib/db/index.ts`) - Add CRUD operations to `dbOperations`
3. **API Types & Validation** (`src/lib/api/api.types.ts`) - Define types and Zod schemas  
4. **API Endpoints** (`src/lib/api/api-client.types.ts`) - Configure endpoint definitions
5. **API Client Methods** (`src/lib/api/api-client.ts`) - Implement type-safe HTTP methods
6. **API Routes** (`src/app/api/`) - Create Next.js route handlers with validation
7. **Custom Hooks** (`src/hooks/`) - Create React Query hooks for data management
8. **Components** (`src/components/`) - Build UI with imported types and validation

### 9. Adding New UI Pages
When adding a new page to the application:

1. **Create Page Component** - Add new page in `src/app/[page-name]/page.tsx` using Next.js App Router
2. **Add SiteHeader** - Include `<SiteHeader pageTitle="Page Name" />` for consistent navigation
3. **Update Navigation** - Add the page to `navigationItems` array in both `src/components/layout/mobile-nav.tsx` and `src/components/layout/desktop-nav.tsx`
4. **Set Visibility** - Configure as `public: true` for all users or `protected: true` for authenticated users only
5. **Import Icon** - Add appropriate Lucide React icon for the navigation menu
6. **Test Responsive** - Verify the page works correctly on both mobile hamburger menu and desktop navigation

## Important Notes
- This template emphasizes developer experience and production readiness
- Always consider the overall architecture when making changes
- Maintain consistency with established patterns and conventions