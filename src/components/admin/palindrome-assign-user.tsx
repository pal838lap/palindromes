"use client"
import { useState } from 'react'
import { useUserProfiles } from '@/hooks/use-user-profiles'
import { useAssignPalindromeUser } from '@/hooks/use-assign-palindrome-user'
import { useCreateUserProfile } from '@/hooks/use-create-user-profile'
import { Button } from '@/components/ui/button'
import { Select, SelectOption } from '@/components/ui/select'

interface Props {
  palindromeId: string
  currentUserProfileId?: string | null
}

export function PalindromeAssignUser({ palindromeId, currentUserProfileId }: Props) {
  const { data: profiles, isLoading } = useUserProfiles()
  const mutation = useAssignPalindromeUser(palindromeId)
  const createMutation = useCreateUserProfile()
  const [selected, setSelected] = useState<string | null>(currentUserProfileId ?? null)
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState('')

  const onAssign = () => {
    if (!palindromeId) return
    mutation.mutate({ userProfileId: selected })
  }

  const onCreate = async () => {
    if (!newName.trim()) return
    createMutation.mutate({ name: newName.trim(), avatar: newAvatar.trim() || undefined }, {
      onSuccess: (created) => {
        // Auto-select and immediately assign to palindrome
        setSelected(created.id)
        mutation.mutate({ userProfileId: created.id })
        setMode('existing')
        setNewName('')
        setNewAvatar('')
      }
    })
  }

  return (
    <div className="space-y-3 border rounded-md p-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Assign User</h4>
        {mutation.isPending && <span className="text-xs">Saving...</span>}
        {mutation.isSuccess && <span className="text-xs text-green-600">Saved</span>}
        {mutation.isError && <span className="text-xs text-red-600">Error</span>}
      </div>
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setMode('existing')} className={`px-2 py-1 rounded border ${mode==='existing' ? 'bg-accent' : 'bg-background'}`}>Add from existing</button>
        <button type="button" onClick={() => setMode('new')} className={`px-2 py-1 rounded border ${mode==='new' ? 'bg-accent' : 'bg-background'}`}>Add new user</button>
      </div>
      {mode === 'existing' && (
        <Select
          label="User Profile"
          value={selected}
          onChange={(val) => {
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
      )}
      {mode === 'new' && (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-xs font-medium">Name</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="New user's name"
              className="w-full rounded border px-2 py-1 text-sm"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Avatar URL (optional)</label>
            <input
              value={newAvatar}
              onChange={e => setNewAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full rounded border px-2 py-1 text-sm"
              disabled={createMutation.isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={onCreate} disabled={createMutation.isPending || !newName.trim()}>Create & Select</Button>
            <Button type="button" variant="secondary" onClick={() => { setMode('existing'); }} disabled={createMutation.isPending}>Cancel</Button>
          </div>
          {createMutation.isError && <p className="text-xs text-red-600">Error creating user</p>}
        </div>
      )}
      {isLoading && <p className="text-xs mt-1">Loading profiles...</p>}
      {!isLoading && profiles && profiles.length === 0 && <p className="text-xs mt-1">No profiles available</p>}
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={() => setSelected(null)} disabled={mutation.isPending}>Clear</Button>
        <Button type="button" onClick={onAssign} disabled={mutation.isPending || selected === currentUserProfileId}>Save</Button>
      </div>
    </div>
  )
}
