'use client'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api/api-client'

// Query keys for caching
export const queryKeys = {
  stats: {
    dashboard: ['stats', 'dashboard'] as const,
  },
}

// Stats hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats.dashboard,
    queryFn: () => apiClient.stats.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}
