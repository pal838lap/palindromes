import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { UserProfile } from '@/lib/api/api.types'

export function useUserProfiles() {
  return useQuery<UserProfile[], Error>({
    queryKey: ['userProfiles'],
    queryFn: () => apiClient.userProfiles.list(),
    staleTime: 60_000,
  })
}
