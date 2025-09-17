import { MobileNav } from "@/components/layout/mobile-nav";
import { DesktopNav } from "@/components/layout/desktop-nav";
import Link from "next/link";
import Image from "next/image";

interface SiteHeaderProps {
  pageTitle?: string;
}

export function SiteHeader({ 
  pageTitle
}: SiteHeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 transition-colors group">
          <div className="relative p-2 rounded-full transition-colors ">
            <Image
              src="/icons/383new.png"
              alt="Palindromes"
              width={50}
              height={40}
              className="h-8 w-auto"
            />
          </div>
          {pageTitle && (
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
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
