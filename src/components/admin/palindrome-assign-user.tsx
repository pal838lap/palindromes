"use client"
import { useState } from 'react'
import { useUserProfiles } from '@/hooks/use-user-profiles'
import { useAssignPalindromeUser } from '@/hooks/use-assign-palindrome-user'
import { Button } from '@/components/ui/button'
import { Select, SelectOption } from '@/components/ui/select'

interface Props {
  palindromeId: string
  currentUserProfileId?: string | null
}

export function PalindromeAssignUser({ palindromeId, currentUserProfileId }: Props) {
  const { data: profiles, isLoading } = useUserProfiles()
  const mutation = useAssignPalindromeUser(palindromeId)
  const [selected, setSelected] = useState<string | null>(currentUserProfileId ?? null)

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
      <Select
        label="User Profile"
        value={selected}
        onChange={(val) => {
          // Map empty string from '(Unassigned)' option to null
          if (val === '') setSelected(null)
          else setSelected(val)
        }}
        disabled={isLoading || mutation.isPending}
        placeholder="(Unassigned)"
        searchable
        searchPlaceholder="Filter users..."
      >
        <SelectOption value="">(Unassigned)</SelectOption>
        {profiles?.map(p => (
          <SelectOption key={p.id} value={p.id}>{p.name}</SelectOption>
        ))}
      </Select>
      {isLoading && <p className="text-xs mt-1">Loading profiles...</p>}
      {!isLoading && profiles && profiles.length === 0 && <p className="text-xs mt-1">No profiles available</p>}
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setSelected(null)} disabled={mutation.isPending}>Clear</Button>
        <Button type="button" onClick={onAssign} disabled={mutation.isPending || selected === currentUserProfileId}>Save</Button>
      </div>
    </div>
  )
}
