"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { ApiError } from '@/lib/api/api-client.types'
import type { Palindrome } from '@/lib/api/api.types'

// Simple create palindrome mutation hook.
// Accepts minimal required fields; additional optional metadata allowed.
export function useCreatePalindrome() {
  const qc = useQueryClient()
  return useMutation<Palindrome, ApiError, {
    id: string
    model?: string | null
    color?: string | null
    picture?: string | null
    brandId?: string | null
    categoryId?: string | null
    year?: number | null
    foundAt?: string | null
  }>({
    mutationFn: (body) => apiClient.palindromes.create(body),
    onSuccess: (created) => {
      // Invalidate list + individual cache key patterns if used
      qc.invalidateQueries({ queryKey: ['palindromes'] })
      qc.invalidateQueries({ queryKey: ['palindrome', created.id] })
    }
  })
}
