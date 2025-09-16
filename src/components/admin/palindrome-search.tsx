"use client"
import { useState, useEffect } from 'react'
import { usePalindrome } from '@/hooks/use-palindrome'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PalindromeAssignUser } from '@/components/admin/palindrome-assign-user'
import { useUploadPalindromeImage, useRemovePalindromeImage } from '@/hooks/use-palindrome-image'
import { useUserProfiles } from '@/hooks/use-user-profiles'
import { useAssignPalindromeUser } from '@/hooks/use-assign-palindrome-user'
import { useCreateUserProfile } from '@/hooks/use-create-user-profile'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function PalindromeSearch() {
  const [value, setValue] = useState('')
  const { data, isLoading, isError, error } = usePalindrome(value.trim() || undefined)
  const uploadMutation = useUploadPalindromeImage(data?.id)
  const removeMutation = useRemovePalindromeImage(data?.id)
  const { data: profiles, isLoading: loadingProfiles } = useUserProfiles()
  const assignMutation = useAssignPalindromeUser(data?.id || '')
  const createProfileMutation = useCreateUserProfile()
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [userMode, setUserMode] = useState<'existing' | 'new'>('existing')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newUserName, setNewUserName] = useState('')
  const [newUserAvatar, setNewUserAvatar] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingRemoveImage, setPendingRemoveImage] = useState(false)

  const hasImage = Boolean(localPreview || data?.picture || pendingFile)

  // Sync selected user when a new palindrome loads
  useEffect(() => {
    if (data?.userProfileId) {
      setSelectedUser(data.userProfileId)
    } else {
      setSelectedUser(null)
    }
  }, [data?.id, data?.userProfileId])

  function clearEdits() {
    setLocalPreview(null)
    setUserMode('existing')
    setSelectedUser(data?.userProfileId ?? null)
    setNewUserName('')
    setNewUserAvatar('')
    setPendingFile(null)
    setPendingRemoveImage(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPendingRemoveImage(false)
      setPendingFile(file)
      setLocalPreview(URL.createObjectURL(file))
    }
  }

  function markRemoveImage() {
    setPendingRemoveImage(true)
    setPendingFile(null)
    setLocalPreview(null)
  }

  async function handleSave() {
    if (!data?.id) return
    // 1. Handle image changes (remove or upload)
    if (pendingRemoveImage && data.picture) {
      await removeMutation.mutateAsync()
    } else if (pendingFile) {
      await uploadMutation.mutateAsync(pendingFile)
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
            <div className="text-sm space-y-1 border rounded-md p-3">
              <div><span className="font-medium">Palindrome:</span> {data.id}</div>
              <div><span className="font-medium">Found by:</span> {data.userProfileName || '—'}</div>
              {data.brandName && <div><span className="font-medium">Brand:</span> {data.brandName}</div>}
            </div>
            <div className="space-y-2">
              <div className="font-medium text-sm">Image</div>
              <div className="flex items-center gap-3">
                <div className="relative w-40 h-24 rounded border flex items-center justify-center overflow-hidden bg-muted">
                  {pendingRemoveImage ? (
                    <div className="text-xs text-muted-foreground">(Will remove)</div>
                  ) : localPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={localPreview} alt="preview" className="object-cover w-full h-full" />
                  ) : data.picture ? (
                    <Image src={data.picture} alt={data.id} fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="text-xs text-muted-foreground">No image</div>
                  )}
                  <div className="absolute top-1 right-1 flex gap-1">
                    <label className="cursor-pointer bg-white/70 hover:bg-white text-xs px-2 py-0.5 rounded shadow">
                      +
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    </label>
                    {(data?.picture || localPreview) && !pendingRemoveImage && (
                      <button onClick={markRemoveImage} className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded shadow">x</button>
                    )}
                    {pendingRemoveImage && (
                      <button onClick={() => setPendingRemoveImage(false)} className="bg-amber-500/80 hover:bg-amber-600 text-white text-xs px-2 py-0.5 rounded shadow">Undo</button>
                    )}
                  </div>
                </div>
                <div className="text-xs space-y-1 min-w-[170px]">
                  {pendingFile && <p>Pending image change</p>}
                  {pendingRemoveImage && <p>Image will be removed</p>}
                  {!data.picture && !pendingFile && !pendingRemoveImage && <p>No image set</p>}
                  {uploadMutation.isError && <p className="text-red-500">Upload failed</p>}
                  {removeMutation.isError && <p className="text-red-500">Remove failed</p>}
                </div>
              </div>
            </div>
            <PalindromeAssignUser
              mode={userMode}
              onModeChange={setUserMode}
              selectedUserProfileId={selectedUser ?? data.userProfileId ?? null}
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
                disabled={!hasImage || (userMode === 'new' ? !newUserName.trim() : false) || assignMutation.isPending || createProfileMutation.isPending || uploadMutation.isPending || removeMutation.isPending}
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
