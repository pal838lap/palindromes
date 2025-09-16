"use client"
import { useState, useRef } from 'react'
import { apiClient } from '@/lib/api/api-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PalindromeImageTestUploader() {
  const [palindromeId, setPalindromeId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>('')
  const [uploadedUrl, setUploadedUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setStatus('Ready to upload')
    }
  }

  async function handleUpload() {
    if (!palindromeId.trim()) {
      setStatus('Enter a palindrome id first')
      return
    }
    if (!file) {
      setStatus('Choose a file first')
      return
    }
    setIsUploading(true)
    setStatus('Uploading...')
    try {
      const res = await apiClient.palindromes.updatePicture(palindromeId.trim(), file)
      setUploadedUrl(res.picture)
      setStatus('Uploaded successfully')
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (e: unknown) {
      interface WithError { error?: string }
      let message = 'Upload failed'
      if (typeof e === 'object' && e) {
        const maybe = e as WithError
        if (maybe.error) message = maybe.error
      }
      if (e instanceof Error) message = e.message || message
      setStatus(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3 border rounded-md p-4">
      <h2 className="font-semibold">Test Palindrome Image Upload</h2>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Palindrome ID</label>
        <Input value={palindromeId} placeholder="e.g. 12321" onChange={(e) => setPalindromeId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Image File</label>
        <Input ref={inputRef} type="file" accept="image/*" onChange={onSelect} />
        {file && (
          <p className="text-xs text-muted-foreground">Selected: {file.name} ({Math.round(file.size/1024)} KB)</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={handleUpload} disabled={isUploading}>Upload</Button>
        {uploadedUrl && <a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-sm underline text-primary">View Last Upload</a>}
      </div>
      {status && <p className="text-sm">{status}</p>}
    </div>
  )
}
