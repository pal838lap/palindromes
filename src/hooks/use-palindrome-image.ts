import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'

export function useUploadPalindromeImage(palindromeId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      if (!palindromeId) throw new Error('Missing palindrome id')
      return apiClient.palindromes.updatePicture(palindromeId, file)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['palindrome', res.id] })
    }
  })
}

export function useRemovePalindromeImage(palindromeId: string | undefined) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (!palindromeId) throw new Error('Missing palindrome id')
      return apiClient.palindromes.removePicture(palindromeId)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['palindrome', res.id] })
    }
  })
}
