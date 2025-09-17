"use client"
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LicensePlateProps {
  value: string
  className?: string
  country?: 'IL'
  size?: 'sm' | 'md' | 'lg'
  /** Compact mode removes extra horizontal padding & min-width for tight layouts */
  compact?: boolean
  /** Full width mode expands plate to fill parent container width */
  fullWidth?: boolean
  /** Tight mode aggressively reduces side padding (overrides compact) */
  tight?: boolean
  /** Align text when fullWidth: default center, or start */
  align?: 'center' | 'start'
  /** Override text size classes (applied after default) */
  textClassName?: string
  /**
   * If true, forces showing the raw value (no hyphen formatting) even if length matches.
   */
  disableFormat?: boolean
}

/**
 * Format a numeric license plate id according to Israeli patterns:
 * 7 digits: XX-YYY-XX
 * 8 digits: XXX-YY-XXX
 * Any other length or non purely numeric strings are returned unchanged.
 */
export function formatLicensePlateId(raw: string): string {
  if (!/^\d+$/.test(raw)) return raw
  if (raw.length === 7) {
    return `${raw.slice(0,2)}-${raw.slice(2,5)}-${raw.slice(5)}`
  }
  if (raw.length === 8) {
    return `${raw.slice(0,3)}-${raw.slice(3,5)}-${raw.slice(5)}`
  }
  return raw
}

// Simple Israeli-style plate: blue left bar (from svg) + yellow body + bold digits
export function LicensePlate({ value, className, country = 'IL', size = 'md', compact = false, fullWidth = false, tight = false, align = 'center', textClassName, disableFormat }: LicensePlateProps) {
  const height = size === 'sm' ? 28 : size === 'lg' ? 52 : 40
  // Tight padding is consistently 8px (px-2) on both sides regardless of size.
  const paddingX = tight
    ? 'px-2'
    : compact
      ? (size === 'sm' ? 'px-2' : size === 'lg' ? 'px-4' : 'px-3')
      : (size === 'sm' ? 'px-3' : size === 'lg' ? 'px-6' : 'px-4')
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  const display = disableFormat ? value : formatLicensePlateId(value)
  return (
    <div
      className={cn(
        'inline-flex items-stretch rounded-md overflow-hidden border border-black/50 shadow-sm select-none bg-gradient-to-b from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600',
        className
      )}
      style={{ height }}
      aria-label={value}
    >
      {country === 'IL' && (
        <div className="relative h-full aspect-[33/56] bg-[#0000f9] flex items-center justify-center">
          {/* Use provided svg via next/image for consistency; fallback simple text */}
          <Image src="/il.svg" alt="IL" fill className="object-cover" />
        </div>
      )}
      <div
        className={cn(
          'flex items-center font-bold tracking-wider text-black',
          (compact || tight) ? 'min-w-0' : 'min-w-[152px]',
          fullWidth && 'w-full',
          fullWidth ? (align === 'start' ? 'justify-start' : 'justify-center') : 'justify-center',
          paddingX,
          textSize,
          textClassName,
        )}
        style={{ fontFamily: 'ui-monospace, monospace' }}
      >
        {display}
      </div>
    </div>
  )
}
