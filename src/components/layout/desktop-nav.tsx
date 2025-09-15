"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Home, LayoutDashboard } from "lucide-react"

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    public: true,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    protected: true,
  },
]

export function DesktopNav() {
  const { data: session } = useSession()

  return (
    <div className="hidden md:flex items-center gap-4">
      {/* Navigation Links */}
      <nav className="flex items-center gap-2">
        {navigationItems.map((item) => {
          // Show public items to everyone, protected items only to authenticated users
          if (item.protected && !session?.user) return null
          
          return (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm">
                {item.title}
              </Button>
            </Link>
          )
        })}
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
