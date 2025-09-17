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
        'group  relative flex flex-col overflow-hidden rounded-md border border-amber-500/70 dark:border-amber-400/60 bg-gray-950 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 dark:focus-visible:ring-amber-400/40',
        className
      )}
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      onClick={() => onClick?.(palindrome)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(palindrome) } }}
    >
      {/* Centered intrinsic-width plate header */}
      <div className="pt-2 flex justify-center">
        <LicensePlate
          value={palindrome.id}
          size="sm"
          compact
          tight
          textClassName="text-[12px] xs:text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px]"
        />
      </div>
      <div className="relative mt-1 aspect-[4/3] w-full bg-muted mt-2">
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
