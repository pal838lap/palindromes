"use client"
import { useState } from 'react'
import { usePalindrome } from '@/hooks/use-palindrome'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PalindromeAssignUser } from '@/components/admin/palindrome-assign-user'

export function PalindromeSearch() {
  const [value, setValue] = useState('')
  const { data, isLoading, isError, error } = usePalindrome(value.trim() || undefined)

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Lookup Palindrome</CardTitle>
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
          <div className="space-y-4">
            <div className="text-sm space-y-1 border rounded-md p-3">
              <div><span className="font-medium">ID:</span> {data.id}</div>
              {data.model && <div><span className="font-medium">Model:</span> {data.model}</div>}
              {data.color && <div><span className="font-medium">Color:</span> {data.color}</div>}
              {data.foundAt && <div><span className="font-medium">Found:</span> {new Date(data.foundAt).toLocaleString()}</div>}
              {data.picture && (
                <div>
                  <a href={data.picture} target="_blank" rel="noreferrer" className="text-primary underline">View picture</a>
                </div>
              )}
            </div>
            <PalindromeAssignUser palindromeId={data.id} currentUserProfileId={data.userProfileId} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
