'use client'
import { usePalindromes } from '@/hooks/use-palindromes'
import { PalindromeCard } from '@/components/palindrome-card'
import { useMemo, useState } from 'react'
import { PalindromesFilters, PalindromesFiltersState } from '@/components/palindromes/palindromes-filters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { filterAndSortPalindromes } from '@/lib/palindromes/filter-sort'

export function PalindromesGallery() {
  const { data, isLoading, isError, error } = usePalindromes()

  // Unified filter state
  const [filters, setFilters] = useState<PalindromesFiltersState>({
    prefix: '',
    user: '',
    brand: '',
    color: '',
    found: 'found',
    sort: 'idAsc'
  })
  const debounced = {
    prefix: useDebouncedValue(filters.prefix, 250),
    user: useDebouncedValue(filters.user, 250),
    color: useDebouncedValue(filters.color, 250)
  }

  const uniqueBrands = useMemo(() => {
    if (!data) return [] as string[]
    const set = new Set<string>()
    data.forEach(p => { if (p.brandName) set.add(p.brandName) })
    return Array.from(set).sort((a,b) => a.localeCompare(b))
  }, [data])
  // (Future) Could use uniqueUsers & uniqueColors for dropdowns if desired

  const filtered = useMemo(() => {
    if (!data) return []
    return filterAndSortPalindromes(data, {
      prefix: debounced.prefix,
      user: debounced.user,
      brand: filters.brand,
      color: debounced.color,
      found: filters.found,
      sort: filters.sort
    })
  }, [data, debounced.prefix, debounced.user, filters.brand, debounced.color, filters.found, filters.sort])

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading palindromes...</p>
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>
  if (!data || data.length === 0) return <p className="text-sm text-muted-foreground">No palindromes yet.</p>

  function resetFilters() {
    setFilters({ prefix: '', user: '', brand: '', color: '', found: 'found', sort: 'idAsc' })
  }

  return (
    <div className="space-y-6">
      <PalindromesFilters
        state={filters}
        onChange={(partial) => setFilters(prev => ({ ...prev, ...partial }))}
        brandOptions={uniqueBrands}
        total={data.length}
        showing={filtered.length}
        onReset={resetFilters}
      />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(p => (
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
    </div>
  )
}
