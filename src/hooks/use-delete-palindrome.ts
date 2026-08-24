import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'

export function useDeletePalindrome(palindromeId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!palindromeId) throw new Error('Missing palindrome id')
      return apiClient.palindromes.delete(palindromeId)
    },
    onSuccess: ({ id }) => {
      queryClient.removeQueries({ queryKey: ['palindrome', id] })
      queryClient.invalidateQueries({ queryKey: ['palindromes'] })
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
    },
  })
}