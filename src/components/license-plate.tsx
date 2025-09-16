"use client"
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LicensePlateProps {
  value: string
  className?: string
  country?: 'IL'
  size?: 'sm' | 'md' | 'lg'
}

// Simple Israeli-style plate: blue left bar (from svg) + yellow body + bold digits
export function LicensePlate({ value, className, country = 'IL', size = 'md' }: LicensePlateProps) {
  const height = size === 'sm' ? 28 : size === 'lg' ? 52 : 40
  const paddingX = size === 'sm' ? 'px-3' : size === 'lg' ? 'px-6' : 'px-4'
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
  return (
    <div
      className={cn(
        'inline-flex items-stretch rounded-md overflow-hidden border border-black/50 shadow-sm select-none bg-gradient-to-b from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600',
        className
      )}
      style={{ height }}
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
          paddingX,
          textSize,
        )}
        style={{ fontFamily: 'ui-monospace, monospace' }}
      >
        {value}
      </div>
    </div>
  )
}
