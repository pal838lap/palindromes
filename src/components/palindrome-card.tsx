"use client"
import { 
  Card, 
  CardContent, 
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
import { useState, useRef, useCallback, memo } from 'react'
import { cn } from '@/lib/utils'
import type { PalindromeWithDetails } from '@/lib/db/schema'
import { LicensePlate } from '@/components/license-plate'
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

function PalindromeCardBase({ 
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const triggerFileDialog = useCallback(() => {
    if (mode !== 'edit') return
    fileInputRef.current?.click()
  }, [mode])

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
            <CardTitle className="text-2xl font-bold tracking-wide flex flex-col gap-2">
              <span className="sr-only">Plate</span>
              <LicensePlate value={palindrome.id} size="md" />
            </CardTitle>
     
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Picture (view or edit) */}
        <div
          className={cn(
            "relative aspect-video w-full overflow-hidden rounded-lg border flex items-center justify-center bg-muted",
            mode === 'edit' && 'cursor-pointer'
          )}
          onClick={(e) => {
            // Prevent clicks on remove/undo buttons from opening dialog
            if ((e.target as HTMLElement).closest('[data-no-upload]')) return
            triggerFileDialog()
          }}
          role={mode === 'edit' ? 'button' : undefined}
          aria-label={mode === 'edit' ? 'Upload or replace image' : undefined}
          tabIndex={mode === 'edit' ? 0 : -1}
          onKeyDown={(e) => {
            if (mode === 'edit' && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              triggerFileDialog();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
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
            <>
              {(palindrome.picture || localPreview) && !pendingRemove && (
                <div className="absolute top-2 right-2 flex gap-2" data-no-upload>
                  <button
                    onClick={(e) => { e.stopPropagation(); markRemove() }}
                    className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-2 py-1 rounded shadow flex items-center gap-1"
                    data-no-upload
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              )}
              {pendingRemove && (
                <div className="absolute top-2 right-2" data-no-upload>
                  <button
                    onClick={(e) => { e.stopPropagation(); undoRemove() }}
                    className="bg-amber-500/80 hover:bg-amber-600 text-white text-xs px-2 py-1 rounded shadow flex items-center gap-1"
                    data-no-upload
                  >
                    <Undo2 className="h-3 w-3" />
                    Undo
                  </button>
                </div>
              )}
              <div className="absolute bottom-1 right-2 text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-white font-medium pointer-events-none select-none">
                Click to {palindrome.picture || localPreview ? 'replace' : 'upload'}
              </div>
            </>
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

export const PalindromeCard = memo(PalindromeCardBase)

// Compact version for lists
function PalindromeCardCompactBase({ 
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

export const PalindromeCardCompact = memo(PalindromeCardCompactBase)