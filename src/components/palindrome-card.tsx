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
  User
} from 'lucide-react'
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
}

export function PalindromeCard({ 
  palindrome, 
  className,
  showActions = false,
  onEdit,
  onDelete,
  onViewDetails
}: PalindromeCardProps) {
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
        {/* Picture */}
        {palindrome.picture ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={palindrome.picture}
              alt={`Palindrome ${palindrome.id}`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement
                if (fallback) {
                  fallback.style.display = 'flex'
                }
              }}
            />
            <div className="image-fallback absolute inset-0 items-center justify-center bg-muted" style={{ display: 'none' }}>
              <div className="text-center text-muted-foreground">
                <Camera className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <Camera className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          {/* Found By */}
          {palindrome.userProfile && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Found by:</span>
              <span className="font-medium">{palindrome.userProfile.name}</span>
            </div>
          )}

          {/* Category */}
          {palindrome.category && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{palindrome.category.name}</Badge>
            </div>
          )}

          {/* Vehicle Details */}
          <div className="space-y-2">
            {/* Brand and Year */}
            {(palindrome.brand || palindrome.year) && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">
                  {palindrome.brand?.name}
                  {palindrome.brand?.name && palindrome.year && ' '}
                  {palindrome.year}
                </span>
              </div>
            )}

            {/* Model */}
            {palindrome.model && (
              <div className="flex items-center gap-2 ml-6">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">{palindrome.model}</span>
              </div>
            )}

            {/* Color */}
            {palindrome.color && (
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Color:</span>
                <span className="font-medium">{palindrome.color}</span>
              </div>
            )}
          </div>

          {/* Found Date */}
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