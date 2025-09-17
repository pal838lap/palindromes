"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Home, Layout, Shield } from "lucide-react"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    public: true,
  },
  {
    title: "Showcase",
    href: "/showcase",
    icon: Layout,
    public: true,
  },
  // Admin link injected separately when session.user.isAdmin is true
]

export function DesktopNav() {
  const { data: session } = useSession()

  return (
    <div className="hidden md:flex items-center gap-4">
      {/* Navigation Links */}
      <nav className="flex items-center gap-2">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" size="sm">
              {item.title}
            </Button>
          </Link>
        ))}
        {session?.user?.isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-amber-600 dark:text-amber-400">
              <Shield className="h-4 w-4 mr-1" /> Admin
            </Button>
          </Link>
        )}
      </nav>

      {/* Authentication & Theme */}
      <div className="flex items-center gap-2">
        {session?.user ? (
          <UserNav />
        ) : (
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  )
}
