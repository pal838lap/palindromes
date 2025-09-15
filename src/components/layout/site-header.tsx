import { MobileNav } from "@/components/layout/mobile-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import Link from "next/link";

interface SiteHeaderProps {
  pageTitle?: string;
}

export function SiteHeader({ 
  pageTitle
}: SiteHeaderProps) {
  const appName = "Guy's Template";
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-baseline gap-2 hover:opacity-80 transition-opacity group">
          <span className="text-2xl font-bold">{appName}</span>
          {pageTitle && (
            <span className="text-sm text-muted-foreground font-medium">
              /{pageTitle}
            </span>
          )}
        </Link>
        
        <div className="flex items-center gap-2">
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
