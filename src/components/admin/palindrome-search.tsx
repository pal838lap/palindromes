"use client"
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePalindrome } from '@/hooks/use-palindrome'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PalindromeAssignUser } from '@/components/admin/palindrome-assign-user'
import { useUserProfiles } from '@/hooks/use-user-profiles'
import { useAssignPalindromeUser } from '@/hooks/use-assign-palindrome-user'
import { useCreateUserProfile } from '@/hooks/use-create-user-profile'
import { Button } from '@/components/ui/button'
import { PalindromeCard } from '@/components/palindrome-card'
import { formatLicensePlateId } from '@/components/license-plate'
import { useUploadPalindromeImage, useRemovePalindromeImage } from '@/hooks/use-palindrome-image'
import type { PalindromeWithDetails, UserProfile, Brand } from '@/lib/db/schema'

export function PalindromeSearch() {
  // Raw (unformatted) input value used for actual querying
  const [value, setValue] = useState('')
  // Display value with hyphen formatting (controlled separately)
  const [displayValue, setDisplayValue] = useState('')
  const { data, isLoading, isError, error } = usePalindrome(value.trim() || undefined)
  const queryClient = useQueryClient()
  // Image upload/remove now handled directly inside PalindromeCard edit mode
  const { data: profiles, isLoading: loadingProfiles } = useUserProfiles()
  const assignMutation = useAssignPalindromeUser(data?.id || '')
  const createProfileMutation = useCreateUserProfile()
  // Local preview state removed; card manages image editing
  const [userMode, setUserMode] = useState<'existing' | 'new'>('existing')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newUserName, setNewUserName] = useState('')
  const [newUserAvatar, setNewUserAvatar] = useState('')

  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [pendingImageRemove, setPendingImageRemove] = useState(false)
  const uploadMutation = useUploadPalindromeImage(data?.id)
  const removeMutation = useRemovePalindromeImage(data?.id)
  // hasImage should reflect the FINAL state after applying pending changes.
  // If pendingImageRemove is true, the image will be removed, so treat as false.
  const hasImage = pendingImageRemove ? false : Boolean(pendingImageFile || data?.picture)
  // User requirement: in 'existing' mode need a selected or existing user; in 'new' mode need a non-empty new user name
  const hasUser = userMode === 'existing'
    ? Boolean(selectedUser || data?.userProfileId)
    : Boolean(newUserName.trim())

  // Sync selected user when a new palindrome loads
  useEffect(() => {
    if (data?.userProfileId) {
      setSelectedUser(data.userProfileId)
    } else {
      setSelectedUser(null)
    }
  }, [data?.id, data?.userProfileId])

  function clearEdits() {
    setUserMode('existing')
    setSelectedUser(data?.userProfileId ?? null)
    setNewUserName('')
    setNewUserAvatar('')
    setPendingImageFile(null)
    setPendingImageRemove(false)
  }

  async function handleSave() {
    if (!data?.id) return
    // 1. Persist image changes
    if (pendingImageRemove && data.picture) {
      await removeMutation.mutateAsync()
    } else if (pendingImageFile) {
      await uploadMutation.mutateAsync(pendingImageFile)
    }
    // 2. Handle user creation (if new mode)
    let finalUserId = selectedUser
    if (userMode === 'new' && newUserName.trim()) {
      const created = await createProfileMutation.mutateAsync({ name: newUserName.trim(), avatar: newUserAvatar.trim() || undefined })
      finalUserId = created.id
    }
    // 3. Assign user if changed
    if (finalUserId !== data.userProfileId) {
      await assignMutation.mutateAsync({ userProfileId: finalUserId })
    }
    // 4. Refetch palindrome to reflect latest changes (image/user)
    await queryClient.invalidateQueries({ queryKey: ['palindrome', data.id] })
    clearEdits()
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Palindrome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter palindrome id e.g. 12321"
            value={displayValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9A-Za-z]/g, '') // allow alphanum, strip separators
              setValue(raw)
              // Only format purely numeric strings; keep alphanumerics as-is (no hyphens)
              const formatted = /^\d+$/.test(raw) ? formatLicensePlateId(raw) : raw
              setDisplayValue(formatted)
            }}
            onBlur={() => {
              // Re-format on blur in case user pasted something partial
              if (/^\d+$/.test(value)) {
                setDisplayValue(formatLicensePlateId(value))
              }
            }}
            onFocus={() => {
              // Show raw when focusing to allow easy editing
              setDisplayValue(value)
            }}
          />
          <p className="text-xs text-muted-foreground">Search runs automatically when you type.</p>
        </div>

        {isLoading && value && <p className="text-sm">Loading...</p>}
        {isError && value && <p className="text-sm text-red-500">{error.message}</p>}
        {!isLoading && !isError && value && !data && (
          <p className="text-sm">No result.</p>
        )}
        {data && (
          <div className="space-y-6">
            {(() => {
              const userProfile: UserProfile | null = (data.userProfileName && data.userProfileId) ? {
                id: data.userProfileId,
                name: data.userProfileName,
                avatar: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              } : null
              const brand: Brand | null = data.brandName ? {
                id: 'temp-brand',
                name: data.brandName,
                createdAt: new Date(),
              } : null
              const adapted: PalindromeWithDetails = {
                id: data.id,
                picture: data.picture ?? null,
                userProfileId: data.userProfileId ?? null,
                brandId: brand?.id ?? null,
                year: data.year ?? null,
                categoryId: data.categoryId ?? null,
                model: data.model ?? null,
                color: data.color ?? null,
                foundAt: data.foundAt ? new Date(data.foundAt) : null,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                userProfile,
                brand,
                category: null,
              }
              return <PalindromeCard 
                palindrome={adapted} 
                mode='edit' 
                onImageChange={({ pendingFile, pendingRemove }) => {
                  setPendingImageFile(pendingFile)
                  setPendingImageRemove(pendingRemove)
                }}
              />
            })()}

            <PalindromeAssignUser
              mode={userMode}
              onModeChange={setUserMode}
              // Use controlled state directly so unassign (null) isn't replaced by original value
              selectedUserProfileId={selectedUser}
              onSelectUser={setSelectedUser}
              newName={newUserName}
              onNewNameChange={setNewUserName}
              newAvatar={newUserAvatar}
              onNewAvatarChange={setNewUserAvatar}
              profiles={profiles}
              loadingProfiles={loadingProfiles}
              disabled={assignMutation.isPending || createProfileMutation.isPending}
            />
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={clearEdits}
                disabled={assignMutation.isPending || createProfileMutation.isPending || uploadMutation.isPending || removeMutation.isPending}
              >
                Clear
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!hasImage || !hasUser || assignMutation.isPending || createProfileMutation.isPending || uploadMutation.isPending || removeMutation.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
