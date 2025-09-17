import { MobileNav } from "@/components/layout/mobile-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import Link from "next/link";

interface SiteHeaderProps {
  pageTitle?: string;
}

export function SiteHeader({ 
  pageTitle
}: SiteHeaderProps) {
  const appName = "Palindromes";
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-baseline gap-2 transition-colors group">
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
            {appName}
          </span>
          {pageTitle && (
            <span className="text-sm text-muted-foreground font-medium  text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
              {pageTitle}
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
