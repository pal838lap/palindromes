"use client"

import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function UserNav() {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span className="hidden lg:inline">
          {session.user.name || session.user.email}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden lg:ml-2 lg:inline">Sign out</span>
      </Button>
    </div>
  )
}
