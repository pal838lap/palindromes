import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { Palindrome } from '@/lib/api/api.types'

export function useAssignPalindromeUser(palindromeId: string | undefined) {
  const qc = useQueryClient()
  return useMutation<Palindrome, Error, { userProfileId: string | null }>(
    {
      mutationFn: ({ userProfileId }) => apiClient.palindromes.assignUser(palindromeId as string, userProfileId),
      onSuccess: (data) => {
        // Update specific palindrome cache
        qc.setQueryData(['palindrome', palindromeId], data)
      }
    }
  )
}
