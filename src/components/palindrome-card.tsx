"use client"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Camera, 
  Car, 
  Palette, 
  Tag, 
  User,
  Package,
  X,
  Undo2
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PalindromeWithDetails } from '@/lib/db/schema'
import Image from 'next/image'

interface PalindromeCardProps {
  palindrome: PalindromeWithDetails
  className?: string
  showActions?: boolean
  onEdit?: (palindrome: PalindromeWithDetails) => void
  onDelete?: (palindrome: PalindromeWithDetails) => void
  onViewDetails?: (palindrome: PalindromeWithDetails) => void
  mode?: 'view' | 'edit'
  // Notify parent of image edit pending state (file to upload or removal)
  onImageChange?: (change: { pendingFile: File | null; pendingRemove: boolean }) => void
}

export function PalindromeCard({ 
  palindrome, 
  className,
  showActions = false,
  onEdit,
  onDelete,
  onViewDetails,
  mode = 'view',
  onImageChange,
}: PalindromeCardProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingRemove, setPendingRemove] = useState(false)

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingRemove(false)
    setPendingFile(file)
    setLocalPreview(URL.createObjectURL(file))
    onImageChange?.({ pendingFile: file, pendingRemove: false })
  }
  function markRemove() {
    setPendingRemove(true)
    setPendingFile(null)
    if (localPreview) URL.revokeObjectURL(localPreview)
    setLocalPreview(null)
    onImageChange?.({ pendingFile: null, pendingRemove: true })
  }
  function undoRemove() { 
    setPendingRemove(false) 
    onImageChange?.({ pendingFile, pendingRemove: false })
  }
  const formatDate = (date: Date | null) => {
    if (!date) return null
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getStatusBadge = () => {
    if (palindrome.userProfile) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          Found
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
        Not Found
      </Badge>
    )
  }

  return (
    <Card className={cn("w-full max-w-md transition-all hover:shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-wide">
              {palindrome.id}
            </CardTitle>
            <CardDescription>
              Palindrome License Plate
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Picture (view or edit) */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border flex items-center justify-center bg-muted">
          {pendingRemove ? (
            <div className="text-xs text-muted-foreground">(Will remove)</div>
          ) : localPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview} alt="preview" className="object-cover w-full h-full" />
          ) : palindrome.picture ? (
            <Image
              src={palindrome.picture}
              alt={`Palindrome ${palindrome.id}`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <Camera className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No image</p>
            </div>
          )}
          {mode === 'edit' && (
            <div className="absolute top-2 right-2 flex gap-2">
              <label className="cursor-pointer bg-white/80 dark:bg-black/60 hover:bg-white text-xs px-2 py-1 rounded shadow">
                +
                <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              </label>
              {(palindrome.picture || localPreview) && !pendingRemove && (
                <button
                  onClick={markRemove}
                  className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded shadow flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              )}
              {pendingRemove && (
                <button
                  onClick={undoRemove}
                  className="bg-amber-500/80 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded shadow flex items-center gap-1"
                >
                  <Undo2 className="h-3 w-3" />
                  Undo
                </button>
              )}
            </div>
          )}
        </div>
        {/* Inline save/cancel removed; parent handles persistence */}
        <div className="space-y-4">
          {/* Ownership */}
          {palindrome.userProfile && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium">{palindrome.userProfile.name}</span>
            </div>
          )}
          {/* Category */}
          {palindrome.category?.name && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{palindrome.category.name}</Badge>
            </div>
          )}
          {/* Vehicle Details */}
          <div className="space-y-2">
            {palindrome.brand?.name && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{palindrome.brand.name}</span>
              </div>
            )}
            {palindrome.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium">{palindrome.year}</span>
              </div>
            )}
            {palindrome.model && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">{palindrome.model}</span>
              </div>
            )}
            {palindrome.color && (
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Color:</span>
                <span className="font-medium">{palindrome.color}</span>
              </div>
            )}
          </div>
          {palindrome.foundAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Found:</span>
              <span className="font-medium">{formatDate(palindrome.foundAt)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Actions Footer */}
      {showActions && (
        <CardFooter className="gap-2">
          {onViewDetails && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(palindrome)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(palindrome)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(palindrome)}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// Compact version for lists
export function PalindromeCardCompact({ 
  palindrome, 
  className,
  onClick
}: {
  palindrome: PalindromeWithDetails
  className?: string
  onClick?: (palindrome: PalindromeWithDetails) => void
}) {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md", 
        className
      )}
      onClick={() => onClick?.(palindrome)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold tracking-wide">
            {palindrome.id}
          </div>
          {palindrome.userProfile && (
            <Badge variant="outline" className="text-xs">
              {palindrome.userProfile.name}
            </Badge>
          )}
          {palindrome.category && (
            <Badge variant="secondary" className="text-xs">
              {palindrome.category.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {palindrome.brand?.name && (
            <span>{palindrome.brand.name}</span>
          )}
          {palindrome.year && (
            <span>{palindrome.year}</span>
          )}
        </div>
      </div>
    </Card>
  )
}