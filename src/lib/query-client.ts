import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that cache will be fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that cache will be kept in memory
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error: unknown) => {
        // Don't retry on 404 or 403 errors
        const errorWithStatus = error as { status?: number }
        if (errorWithStatus?.status === 404 || errorWithStatus?.status === 403) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount, error: unknown) => {
        // Don't retry client errors (4xx)
        const errorWithStatus = error as { status?: number }
        if (errorWithStatus?.status && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
          return false
        }
        // Retry up to 2 times for server errors
        return failureCount < 2
      },
    },
  },
})
