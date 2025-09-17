'use client'
import { usePalindromes } from '@/hooks/use-palindromes'
import { PalindromeCard } from '@/components/palindrome-card'

export function PalindromesGallery() {
  const { data, isLoading, isError, error } = usePalindromes()

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading palindromes...</p>
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>
  if (!data || data.length === 0) return <p className="text-sm text-muted-foreground">No palindromes yet.</p>

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map(p => (
        <PalindromeCard
          key={p.id}
          palindrome={{
            id: p.id,
            picture: p.picture ?? null,
            userProfileId: p.userProfileId ?? null,
            brandId: p.brandId ?? null,
            year: p.year ?? null,
            categoryId: p.categoryId ?? null,
            model: p.model ?? null,
            color: p.color ?? null,
            foundAt: p.foundAt ? new Date(p.foundAt) : null,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            userProfile: p.userProfileName ? { id: p.userProfileId || 'temp', name: p.userProfileName, avatar: null, createdAt: new Date(), updatedAt: new Date() } : null,
            brand: p.brandName ? { id: p.brandId || 'temp-brand', name: p.brandName, createdAt: new Date() } : null,
            category: p.categoryId ? { id: p.categoryId, name: p.categoryId, description: null, createdAt: new Date() } : null,
          }}
          showActions={false}
        />
      ))}
    </div>
  )
}
