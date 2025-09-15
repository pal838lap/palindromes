# Next.js Golden Template 🚀

A comprehensive, production-ready Next.js template for building full-stack progressive web apps with TypeScript, modern UI components, and enterprise-grade tooling.

## 🎯 Purpose

This template eliminates repetitive setup work by providing a pre-configured, production-ready foundation for Next.js applications. Use it to bootstrap new projects instantly with best practices baked in.

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with semantic colors
- **Shadcn/ui** - Beautiful, accessible components with dark mode support
- **Dark Mode** - Built-in dark/light theme switching
- **Lucide React** - Modern icon library

### Backend & Database
- **PostgreSQL** - Robust relational database (any provider)
- **Drizzle ORM** - Type-safe database toolkit with migrations
- **Supabase** - (Optional) Full-stack platform for local development

### Authentication
- **NextAuth.js v5** - Complete authentication solution
- **Drizzle Adapter** - Integrated with Drizzle ORM for type-safe auth

### Data Management
- **TanStack Query (React Query)** - Server state management
- **TanStack Table** - Powerful data tables
- **Zod** - TypeScript-first schema validation

### Development & Deployment
- **ESLint** - Code linting
- **Vercel** - Deployment platform
- **PWA** - Progressive Web App capabilities

## 🌟 Features

### ✅ Authentication & Authorization
- Multiple auth providers (GitHub, Google, Email)
- Protected routes and middleware
- Role-based access control
- Session management

### ✅ Database & API
- Drizzle ORM integration with full TypeScript support
- PostgreSQL with any provider (Supabase, Neon, Vercel, etc.)
- Type-safe database operations and migrations
- RESTful API routes

### ✅ UI Components
- Pre-built Shadcn components
- Dark/Light mode toggle with system preference detection
- Semantic color system with Tailwind CSS
- Responsive design with mobile-first hamburger navigation
- Accessibility compliant
- Modular navigation system with desktop and mobile optimizations

### ✅ Data Management
- Type-safe API calls with TanStack Query
- Fully typed API client with zero hardcoded paths
- Optimistic updates
- Caching strategies
- Error handling

### ✅ Progressive Web App
- Service worker
- Offline capabilities
- App-like experience
- Push notifications ready

### ✅ Developer Experience
- TypeScript throughout
- Environment validation

## 🚀 Quick Start

```bash
# Create a new app using this template
npx create-next-app@latest my-new-app --example "https://github.com/guymeiri/guy-nextjs-template"

# Navigate to your project
cd my-new-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and NextAuth configuration

# Run database migrations
npm run db:migrate

# Run the development server
npm run dev
```

## 📋 Setup Checklist

After creating a new project from this template:

- [ ] Update `package.json` with your project details
- [ ] Configure environment variables in `.env.local`
- [ ] Set up your PostgreSQL database (see Database Setup guide)
- [ ] Configure NextAuth providers and secrets (see OAuth setup guides below)
- [ ] Run database migrations: `npm run db:migrate`
- [ ] Update site metadata in `app/layout.tsx`
- [ ] Customize the landing page and branding
- [ ] Set up Vercel deployment
- [ ] Configure domain and SSL

## 🔐 Setup Guides

Step-by-step guides for configuring all template features:

- **[Database Setup](./setupGuides/database-setup.md)** - PostgreSQL database configuration with Drizzle ORM
- **[Google OAuth Setup](./setupGuides/googleAuthInstruciton.md)** - Google Cloud Console configuration
- **[GitHub OAuth Setup](./setupGuides/githubAuthInstructions.md)** - GitHub OAuth App setup
- **[PWA Setup](./setupGuides/pwa-setup-guide.md)** - Progressive Web App customization

## 📚 Documentation

Implementation details for developers:

- **[API Client Guide](./docs/api-client-guide.md)** - Type-safe API client usage
- **[Database Architecture](./docs/database-architecture.md)** - Database schema and patterns
- **[Navigation Architecture](./docs/navigation-architecture.md)** - Mobile-responsive navigation system
- **[PWA Implementation](./docs/pwa-implementation.md)** - Progressive Web App technical details

## 🔗 Type-Safe API Client

This template includes a fully type-safe API client that eliminates hardcoded API paths and provides excellent TypeScript intellisense.

### Key Features

- **🔒 Type Safety**: All API calls are fully typed with TypeScript
- **🚫 No Hardcoded Paths**: API paths are defined once and reused
- **💡 IntelliSense**: Full autocomplete for all endpoints and response types
- **🔄 Refactor-Safe**: Changing an endpoint updates all usages automatically
- **⚡ Runtime + Compile Time**: Works at both runtime and compile time

### Quick Example

```typescript
// Define once in api-client.types.ts
export const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as { totalUsers: number }
    }
  }
} as const

// Use everywhere with full type safety
const { data } = useDashboardStats() // data.totalUsers is properly typed!
```

📖 **[Complete API Client Guide](./docs/api-client-guide.md)** - Detailed documentation on how to add new APIs and use the type-safe client.

## 🔧 Environment Variables

```bash
# Database
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🔒 Environment Variables Security

**⚠️ CRITICAL SECURITY RULES:**

### Generating NEXTAUTH_SECRET

For production, you **MUST** generate a strong secret:

```bash
# Generate a secure secret (32 bytes, base64 encoded)
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set it as your `NEXTAUTH_SECRET` in production.

### Server vs Client Environment Variables

- **`NEXT_PUBLIC_*`** variables are exposed to the browser (client-side)
- **All other variables** are server-side only and never sent to the browser

### ✅ Safe for Client (NEXT_PUBLIC_*)
```bash
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 🚫 NEVER expose these to client
```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server only!
GITHUB_CLIENT_SECRET=your_secret                  # Server only!
GOOGLE_CLIENT_SECRET=your_secret                  # Server only!
NEXTAUTH_SECRET=your_secret                       # Server only!
```

### Best Practices

1. **Never access server-side env vars in client components**
   ```tsx
   // ❌ WRONG - Don't do this in client components
   const secret = process.env.GOOGLE_CLIENT_SECRET
   
   // ✅ CORRECT - Use NextAuth's getProviders() instead
   const providers = await getProviders()
   ```

2. **Use proper patterns for checking configuration**
   ```tsx
   // ❌ WRONG - Exposes server logic to client
   if (env.GOOGLE_CLIENT_SECRET) { ... }
   
   // ✅ CORRECT - Check server-side configuration
   const providers = await getProviders()
   if (providers.google) { ... }
   ```

3. **Environment validation happens server-side only**
4. **Secrets should never appear in browser DevTools or client bundle**

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Shadcn components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database client
│   ├── utils.ts         # General utilities
│   └── validations.ts   # Zod schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── supabase/           # Database migrations and types
```

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run type-check   # Run TypeScript compiler
npm run clean        # Clean build artifacts
npm run preview      # Build and preview production
npm run verify-oauth # Verify OAuth configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this template for personal and commercial projects.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [NextAuth.js Documentation](https://authjs.dev)

---

Made with ❤️ for rapid Next.js development
