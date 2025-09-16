import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/api-client'
import type { UserProfile } from '@/lib/api/api.types'

export function useCreateUserProfile() {
  const qc = useQueryClient()
  return useMutation<UserProfile, Error, { name: string; avatar?: string | null }>({
    mutationFn: ({ name, avatar }) => apiClient.userProfiles.create(name, avatar),
    onSuccess: (created) => {
      // Update list cache if present
      qc.setQueryData<UserProfile[] | undefined>(['user-profiles'], (prev) => {
        if (!prev) return [created]
        // Avoid duplicates by id
        if (prev.find(p => p.id === created.id)) return prev
        return [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      })
    }
  })
}
