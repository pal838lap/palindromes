"use client"
import { useState, useMemo } from 'react'
import { useUserProfiles } from '@/hooks/use-user-profiles'
import { useAssignPalindromeUser } from '@/hooks/use-assign-palindrome-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  palindromeId: string
  currentUserProfileId?: string | null
}

export function PalindromeAssignUser({ palindromeId, currentUserProfileId }: Props) {
  const { data: profiles, isLoading } = useUserProfiles()
  const mutation = useAssignPalindromeUser(palindromeId)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(currentUserProfileId ?? null)

  const filtered = useMemo(() => {
    if (!profiles) return []
    const s = search.toLowerCase()
    return profiles.filter(p => p.name.toLowerCase().includes(s))
  }, [profiles, search])

  const onAssign = () => {
    if (!palindromeId) return
    mutation.mutate({ userProfileId: selected })
  }

  return (
    <div className="space-y-3 border rounded-md p-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Assign User</h4>
        {mutation.isPending && <span className="text-xs">Saving...</span>}
        {mutation.isSuccess && <span className="text-xs text-green-600">Saved</span>}
        {mutation.isError && <span className="text-xs text-red-600">Error</span>}
      </div>
      <Input
        placeholder="Search user profiles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-40 overflow-auto border rounded">
        {isLoading && <p className="p-2 text-xs">Loading...</p>}
        {!isLoading && filtered.length === 0 && <p className="p-2 text-xs">No users</p>}
        {!isLoading && filtered.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id === selected ? null : p.id)}
            className={`w-full text-left px-2 py-1 text-sm hover:bg-accent ${p.id === selected ? 'bg-accent' : ''}`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setSelected(null)} disabled={mutation.isPending}>Clear</Button>
        <Button type="button" onClick={onAssign} disabled={mutation.isPending || selected === currentUserProfileId}>Save</Button>
      </div>
    </div>
  )
}
