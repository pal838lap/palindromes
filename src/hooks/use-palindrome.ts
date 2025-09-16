import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { Palindrome } from '@/lib/api/api.types'

export function usePalindrome(id: string | undefined) {
  return useQuery<Palindrome, Error>({
    queryKey: ['palindrome', id],
    queryFn: () => apiClient.palindromes.getById(id as string),
    enabled: !!id && id.length > 0,
    staleTime: 60_000,
  })
}
