import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { LeaderboardRow } from '@/lib/api/api.types'

export function useLeaderboard() {
  return useQuery<LeaderboardRow[], Error>({
    queryKey: ['leaderboard', 'list'],
    queryFn: () => apiClient.leaderboard.list(),
    staleTime: 60_000,
  })
}
