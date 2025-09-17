"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreatePalindrome } from '@/hooks/use-create-palindrome'
import { formatLicensePlateId } from '@/components/license-plate'

export function PalindromeCreateForm() {
  const [raw, setRaw] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [picture, setPicture] = useState('')
  const [year, setYear] = useState('')
  const [foundAt, setFoundAt] = useState('')
  const mutation = useCreatePalindrome()

  const cleaned = raw.replace(/[^0-9A-Za-z]/g,'')
  const isPalindrome = cleaned.length > 0 && cleaned.toUpperCase() === cleaned.toUpperCase().split('').reverse().join('')
  const formatted = /^\d+$/.test(cleaned) ? formatLicensePlateId(cleaned) : cleaned
  const errorObj = mutation.error as { error?: string; status?: number } | null
  const duplicate = Boolean(mutation.isError && (errorObj?.status === 409 || errorObj?.error === 'Palindrome already exists'))
  const canSubmit = isPalindrome && !mutation.isPending && !duplicate

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    mutation.mutate({
      id: cleaned,
      model: model.trim() || null,
      color: color.trim() || null,
      picture: picture.trim() || null,
      year: year ? Number(year) : null,
      foundAt: foundAt || null,
    }, {
      onSuccess: () => {
        setRaw('')
        setModel('')
        setColor('')
        setPicture('')
        setYear('')
        setFoundAt('')
      }
    })
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Add New Palindrome</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Input
              placeholder="Palindrome (e.g. 12321)"
              value={formatted}
              onChange={(e) => setRaw(e.target.value)}
              aria-invalid={cleaned.length > 0 && !isPalindrome}
            />
            {cleaned.length > 0 && !isPalindrome && (
              <p className="text-xs text-red-500">Not a palindrome</p>
            )}
          </div>
          <Input placeholder="Model (optional)" value={model} onChange={e=>setModel(e.target.value)} />
          <Input placeholder="Color (optional)" value={color} onChange={e=>setColor(e.target.value)} />
          <Input placeholder="Picture URL (optional)" value={picture} onChange={e=>setPicture(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} />
            <Input type="date" placeholder="Found at" value={foundAt} onChange={e=>setFoundAt(e.target.value)} />
          </div>
          {mutation.isError && !duplicate && (
            <p className="text-xs text-red-500">{(mutation.error as { error?: string })?.error || 'Error creating palindrome'}</p>
          )}
          {duplicate && (
            <p className="text-xs text-red-500">Palindrome already exists</p>
          )}
          {mutation.isSuccess && (
            <p className="text-xs text-green-600">Created!</p>
          )}
        </CardContent>
        <CardFooter className='mt-5'>
          <Button type="submit" disabled={!canSubmit} className="ml-auto">
            {mutation.isPending ? 'Adding...' : 'Add Palindrome'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
