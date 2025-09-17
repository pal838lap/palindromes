"use client"
import { memo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { PalindromeWithDetails } from '@/lib/db/schema'
import { LicensePlate } from '@/components/license-plate'
import { cn } from '@/lib/utils'

interface PalindromeGalleryCardProps {
  palindrome: PalindromeWithDetails
  className?: string
  onClick?: (palindrome: PalindromeWithDetails) => void
}

// Focused gallery display: big image area, overlay plate & status, minimal meta below
function PalindromeGalleryCardBase({ palindrome, className, onClick }: PalindromeGalleryCardProps) {
  const found = !!palindrome.userProfile
  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      onClick={() => onClick?.(palindrome)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(palindrome) } }}
    >
      {/* Full-width plate header */}
      <div className="px-2 pt-2">
        {/* Responsive plate: smaller base on mobile to avoid oversized text, scales up on larger screens */}
        <LicensePlate
          value={palindrome.id}
          size="sm"
          fullWidth
          compact
          className="w-full text-[15px] xs:text-[16px] sm:text-[17px] md:text-[19px] lg:text-[21px]"
        />
      </div>
      <div className="relative mt-1 aspect-[4/3] w-full bg-muted">
        {palindrome.picture ? (
          <Image
            src={palindrome.picture}
            alt={`Palindrome ${palindrome.id}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        {/* Badge bottom-right overlay */}
        <div className="pointer-events-none absolute bottom-1 right-1">
          {found ? (
            <Badge variant="default" className="h-5 px-2 bg-green-500/90 text-white dark:bg-green-600/90 text-[10px] leading-none font-semibold rounded-sm shadow-sm">Found</Badge>
          ) : (
            <Badge variant="secondary" className="h-5 px-2 bg-amber-500/90 text-white dark:bg-amber-600/90 text-[10px] leading-none font-semibold rounded-sm shadow-sm">Not Found</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3 text-sm">
        {palindrome.userProfile && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium truncate">
            <span className="text-foreground truncate max-w-full">{palindrome.userProfile.name}</span>
          </div>
        )}
        {palindrome.brand?.name && (
          <div className="text-[11px] text-muted-foreground truncate" title={`${palindrome.brand.name}${palindrome.model ? ` • ${palindrome.model}` : ''}`}>{palindrome.brand.name}{palindrome.model ? ` • ${palindrome.model}` : ''}</div>
        )}
        {palindrome.color && (
          <div className="text-[11px] text-muted-foreground capitalize truncate" title={palindrome.color}>{palindrome.color}</div>
        )}
      </div>
    </div>
  )
}

export const PalindromeGalleryCard = memo(PalindromeGalleryCardBase)
