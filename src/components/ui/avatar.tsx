import * as React from "react"
import Image from 'next/image'
import { cn } from "@/lib/utils"

// Minimal avatar implementation (no external dependency) to satisfy any imports.
const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted text-sm items-center justify-center",
        className
      )}
      {...props}
    />
  )
)
Avatar.displayName = 'Avatar'

const AvatarImage: React.FC<React.ComponentProps<typeof Image>> = ({ className, alt = '', ...props }) => (
  <Image alt={alt} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
)

const AvatarFallback: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...props }) => (
  <span className={cn("flex h-full w-full items-center justify-center", className)} {...props}>{children}</span>
)

export { Avatar, AvatarImage, AvatarFallback }
