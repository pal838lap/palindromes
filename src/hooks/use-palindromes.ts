import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { Palindrome } from '@/lib/api/api.types'

export function usePalindromes() {
  return useQuery<Palindrome[], Error>({
    queryKey: ['palindromes', 'list'],
    queryFn: () => apiClient.palindromes.list(),
    staleTime: 60_000,
  })
}
