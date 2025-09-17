'use client'
import { usePalindromes } from '@/hooks/use-palindromes'
// (Old standard card removed in gallery; using specialized gallery card)
import { PalindromeGalleryCard } from '@/components/palindromes/palindrome-gallery-card'
import { useMemo, useState, useDeferredValue, useEffect, useRef, useCallback } from 'react'
import { PalindromesFilters, PalindromesFiltersState } from '@/components/palindromes/palindromes-filters'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { type PalindromeSort } from '@/lib/palindromes/filter-sort'

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
  // Debounce text filters to reduce recomputation during fast typing
  const debounced = {
    prefix: useDebouncedValue(filters.prefix, 200),
    user: useDebouncedValue(filters.user, 200),
    color: useDebouncedValue(filters.color, 200)
  }

  // Defer the whole (debounced) filter object so React can keep input responsive under load
  const deferredSort: PalindromeSort = useDeferredValue(filters.sort)
  const deferredFound = useDeferredValue(filters.found)
  const deferredBrand = useDeferredValue(filters.brand)

  const uniqueBrands = useMemo(() => {
    if (!data) return [] as string[]
    const set = new Set<string>()
    data.forEach(p => { if (p.brandName) set.add(p.brandName) })
    return Array.from(set).sort((a,b) => a.localeCompare(b))
  }, [data])
  // (Future) Could use uniqueUsers & uniqueColors for dropdowns if desired

  // Precompute all base sorted arrays once per data load to avoid re-sorting every keystroke
  const sortedBases = useMemo(() => {
    if (!data) return null
    const byIdAsc = [...data].sort((a,b) => {
      if (a.id.length !== b.id.length) return a.id.length - b.id.length
      return a.id.localeCompare(b.id)
    })
    const byIdDesc = [...byIdAsc].slice().reverse()
    const byFoundAtDesc = [...data].sort((a,b) => {
      const da = a.foundAt ? new Date(a.foundAt).getTime() : 0
      const db = b.foundAt ? new Date(b.foundAt).getTime() : 0
      return db - da
    })
    const byFoundAtAsc = [...byFoundAtDesc].slice().reverse()
    const byCreatedDesc = [...data].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const byCreatedAsc = [...byCreatedDesc].slice().reverse()
    const byBrandAsc = [...data].sort((a,b) => (a.brandName||'').localeCompare(b.brandName||''))
    const byBrandDesc = [...byBrandAsc].slice().reverse()
    const byUserAsc = [...data].sort((a,b) => (a.userProfileName||'').localeCompare(b.userProfileName||''))
    const byUserDesc = [...byUserAsc].slice().reverse()
    return { byIdAsc, byIdDesc, byFoundAtDesc, byFoundAtAsc, byCreatedDesc, byCreatedAsc, byBrandAsc, byBrandDesc, byUserAsc, byUserDesc }
  }, [data])

  const filtered = useMemo(() => {
    if (!sortedBases) return []
    const prefix = debounced.prefix.trim()
    const user = debounced.user.trim().toLowerCase()
    const color = debounced.color.trim().toLowerCase()
    const brand = deferredBrand
    const found = deferredFound

    let base: typeof sortedBases.byIdAsc
    switch (deferredSort) {
      case 'foundAtDesc': base = sortedBases.byFoundAtDesc; break
      case 'foundAtAsc': base = sortedBases.byFoundAtAsc; break
      case 'createdDesc': base = sortedBases.byCreatedDesc; break
      case 'createdAsc': base = sortedBases.byCreatedAsc; break
      case 'idAsc': base = sortedBases.byIdAsc; break
      case 'idDesc': base = sortedBases.byIdDesc; break
      case 'brandAsc': base = sortedBases.byBrandAsc; break
      case 'brandDesc': base = sortedBases.byBrandDesc; break
      case 'userAsc': base = sortedBases.byUserAsc; break
      case 'userDesc': base = sortedBases.byUserDesc; break
    }

    // Single pass filter (already sorted)
    const out: typeof base = []
    for (let i=0;i<base.length;i++) {
      const p = base[i]
      if (prefix && !p.id.startsWith(prefix)) continue
      if (brand && (p.brandName || '') !== brand) continue
      if (found !== 'all') {
        const isFound = !!p.userProfileId
        if (found === 'found' && !isFound) continue
        if (found === 'unfound' && isFound) continue
      }
      if (color) {
        const c = (p.color || '').toLowerCase()
        if (!c.includes(color)) continue
      }
      if (user) {
        const n = (p.userProfileName || '').toLowerCase()
        if (!n.includes(user)) continue
      }
      out.push(p)
    }
    return out
  }, [sortedBases, debounced.prefix, debounced.user, debounced.color, deferredBrand, deferredFound, deferredSort])

  // Infinite scroll state (defined before any return to satisfy hooks rules)
  const BATCH_SIZE = 50
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Reset visible count when filters (effective ones) change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE)
  }, [debounced.prefix, debounced.user, debounced.color, deferredBrand, deferredFound, deferredSort])

  const loadMore = useCallback(() => {
    setVisibleCount(c => Math.min(c + BATCH_SIZE, filtered.length))
  }, [filtered.length])

  // Intersection Observer to trigger load more
  useEffect(() => {
    if (!sentinelRef.current) return
    if (visibleCount >= filtered.length) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          loadMore()
        }
      }
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [visibleCount, filtered.length, loadMore])

  const visible = filtered.slice(0, visibleCount)

  // Early return UI states AFTER hooks definitions
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading palindromes...</p>
  if (isError) return <p className="text-sm text-red-500">{error.message}</p>
  if (!data || data.length === 0) return <p className="text-sm text-muted-foreground">No palindromes yet.</p>

  function resetFilters() {
    setFilters({ prefix: '', user: '', brand: '', color: '', found: 'found', sort: 'idAsc' })
  }

  return (
    <div className="space-y-3">
      {/* Mobile filter/sort launcher */}
      <div className="flex items-center justify-between md:hidden">
        <div className="text-xs text-muted-foreground">Showing {filtered.length} of {data.length}</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 flex flex-col">
            <SheetHeader className="p-4 pb-2 border-b">
              <SheetTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal className="h-4 w-4" /> Filter & Sort
              </SheetTitle>
              <SheetDescription className="text-xs">Refine the palindrome list</SheetDescription>
            </SheetHeader>
            <div className="overflow-y-auto p-4 pb-24">
              <PalindromesFilters
                state={filters}
                onChange={(partial) => setFilters(prev => ({ ...prev, ...partial }))}
                brandOptions={uniqueBrands}
                total={data.length}
                showing={filtered.length}
                onReset={resetFilters}
              />
            </div>
            <SheetFooter className="border-t bg-background/80 backdrop-blur p-3 sticky bottom-0">
              <div className="flex w-full gap-2">
                <Button variant="secondary" className="flex-1" onClick={resetFilters}>Reset</Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop / wider screens inline filters */}
      <div className="hidden md:block">
        <PalindromesFilters
          state={filters}
          onChange={(partial) => setFilters(prev => ({ ...prev, ...partial }))}
          brandOptions={uniqueBrands}
          total={data.length}
          showing={filtered.length}
          onReset={resetFilters}
        />
      </div>
  <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map(p => (
          <PalindromeGalleryCard
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
          />
        ))}
      </div>
      {/* Status / Loader */}
      <div className="flex flex-col items-center justify-center gap-2 py-4">
        {visibleCount < filtered.length && (
          <>
            <div ref={sentinelRef} className="h-4" />
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} / {filtered.length} &mdash; scrolling loads more
            </p>
          </>
        )}
        {visibleCount >= filtered.length && filtered.length > BATCH_SIZE && (
          <p className="text-xs text-muted-foreground">All {filtered.length} loaded</p>
        )}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No matches for current filters.</p>
        )}
      </div>
    </div>
  )
}
