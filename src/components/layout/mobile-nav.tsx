"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Menu, Home, LayoutDashboard, LogIn, LogOut, User } from "lucide-react"

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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()

  const closeMenu = () => setOpen(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
    closeMenu()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Access all pages and settings from here.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Navigation Links */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              // Show public items to everyone, protected items only to authenticated users
              if (item.protected && !session?.user) return null
              
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* Authentication Section */}
          <div className="border-t pt-4 space-y-2">
            {session?.user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="truncate">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                
                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Theme Toggle Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
