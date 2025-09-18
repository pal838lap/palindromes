"use client"
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PalindromeSort } from '@/lib/palindromes/filter-sort'

export interface PalindromesFiltersState {
  prefix: string
  user: string
  brand: string
  color: string
  found: 'all' | 'found' | 'unfound'
  sort: PalindromeSort
}

interface PalindromesFiltersProps {
  state: PalindromesFiltersState
  onChange: (partial: Partial<PalindromesFiltersState>) => void
  brandOptions: string[]
  total: number
  showing: number
  onReset: () => void
}

export function PalindromesFilters({ state, onChange, brandOptions, total, showing, onReset }: PalindromesFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
         <Select
          label="Sort"
          value={state.sort}
          onChange={val => onChange({ sort: (val as PalindromeSort) || 'foundAtDesc' })}
          placeholder="Sort"
        >
          <SelectOption value="foundAtDesc">Found Date (newest)</SelectOption>
          <SelectOption value="foundAtAsc">Found Date (oldest)</SelectOption>
          <SelectOption value="createdDesc">Created (newest)</SelectOption>
          <SelectOption value="createdAsc">Created (oldest)</SelectOption>
          <SelectOption value="idAsc">ID (A→Z)</SelectOption>
          <SelectOption value="idDesc">ID (Z→A)</SelectOption>
          <SelectOption value="brandAsc">Brand (A→Z)</SelectOption>
          <SelectOption value="brandDesc">Brand (Z→A)</SelectOption>
          <SelectOption value="userAsc">User (A→Z)</SelectOption>
          <SelectOption value="userDesc">User (Z→A)</SelectOption>
        </Select>
        <Select
          label="Brand"
          value={state.brand || null}
          onChange={val => onChange({ brand: val || '' })}
          placeholder="All brands"
          searchable
        >
          <SelectOption value="">All</SelectOption>
          {brandOptions.map(b => <SelectOption key={b} value={b}>{b}</SelectOption>)}
        </Select>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">User Name</label>
          <Input value={state.user} onChange={e => onChange({ user: e.target.value })} placeholder="Search user" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Color</label>
          <Input value={state.color} onChange={e => onChange({ color: e.target.value })} placeholder="Color" />
        </div>


      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={onReset}>Reset Filters</Button>
        <div className="text-xs text-muted-foreground self-center">Showing {showing} of {total}</div>
      </div>
    </div>
  )
}
