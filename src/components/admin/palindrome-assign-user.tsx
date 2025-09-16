"use client"
import { Select, SelectOption } from '@/components/ui/select'
import { UserProfile } from '@/lib/api/api.types'

interface Props {
  mode: 'existing' | 'new'
  onModeChange: (mode: 'existing' | 'new') => void
  selectedUserProfileId: string | null
  onSelectUser: (id: string | null) => void
  newName: string
  onNewNameChange: (val: string) => void
  newAvatar: string
  onNewAvatarChange: (val: string) => void
  profiles: UserProfile[] | undefined
  loadingProfiles: boolean
  disabled?: boolean
}

export function PalindromeAssignUser({
  mode,
  onModeChange,
  selectedUserProfileId,
  onSelectUser,
  newName,
  onNewNameChange,
  newAvatar,
  onNewAvatarChange,
  profiles,
  loadingProfiles,
  disabled,
}: Props) {

  return (
    <div className="space-y-3 border rounded-md p-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">User</h4>
      </div>
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => onModeChange('existing')} className={`px-2 py-1 rounded border ${mode==='existing' ? 'bg-accent' : 'bg-background'}`}>Add from existing</button>
        <button type="button" onClick={() => onModeChange('new')} className={`px-2 py-1 rounded border ${mode==='new' ? 'bg-accent' : 'bg-background'}`}>Add new user</button>
      </div>
      {mode === 'existing' && (
        <Select
          label="User Profile"
          value={selectedUserProfileId}
          onChange={(val) => {
            if (val === '') onSelectUser(null)
            else onSelectUser(val)
          }}
          disabled={loadingProfiles || disabled}
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
              onChange={e => onNewNameChange(e.target.value)}
              placeholder="New user's name"
              className="w-full rounded border px-2 py-1 text-sm"
              disabled={disabled}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Avatar URL (optional)</label>
            <input
              value={newAvatar}
              onChange={e => onNewAvatarChange(e.target.value)}
              placeholder="https://..."
              className="w-full rounded border px-2 py-1 text-sm"
              disabled={disabled}
            />
          </div>
        </div>
      )}
      {loadingProfiles && <p className="text-xs mt-1">Loading profiles...</p>}
      {!loadingProfiles && profiles && profiles.length === 0 && <p className="text-xs mt-1">No profiles available</p>}
    </div>
  )
}
