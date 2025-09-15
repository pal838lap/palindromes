# Type-Safe API Client Guide

A fully type-safe API client that eliminates hardcoded paths and provides excellent TypeScript intellisense.

## Architecture

- `src/lib/api/api.types.ts` - API response/request types + form validation schemas
- `src/lib/api/api-client.types.ts` - Endpoint configurations and client types
- `src/lib/api/api-client.ts` - API client implementation
- `src/hooks/use-*.ts` - Feature-specific React Query hooks

## Pattern

Define types and endpoints separately for complete type safety:

```typescript
// src/lib/api/api.types.ts
export type MyEntity = {
  id: string
  name: string
}

// src/lib/api/api-client.types.ts
export const API_ENDPOINTS = {
  entities: {
    get: {
      method: 'GET' as const,
      path: (id: string) => `/api/entities/${id}` as const,
      response: {} as MyEntity
    }
  }
} as const

// src/lib/api/api-client.ts
export class ApiClient {
  entities = {
    get: (id: string): Promise<typeof API_ENDPOINTS.entities.get.response> => 
      this.request(API_ENDPOINTS.entities.get.path(id))
  }
}
```

## Implementation Steps

1. **Define types** in `api/api.types.ts`
2. **Configure endpoints** in `api/api-client.types.ts`
3. **Add client methods** in `api/api-client.ts`
4. **Create React Query hooks** in `hooks/`
5. **Use in components**

**Benefits**: Full type safety, no hardcoded paths, refactor-safe, excellent IntelliSense.
