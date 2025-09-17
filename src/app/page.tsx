import { SiteHeader } from "@/components/layout/site-header";
import { Suspense } from 'react'
import { PalindromesGallery } from '@/components/palindromes-gallery'

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader pageTitle="Palindromes Gallery" />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">All Palindromes</h1>
          <p className="text-muted-foreground text-sm">Browse every recorded palindrome license plate.</p>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
          <PalindromesGallery />
        </Suspense>
      </main>
    </div>
  );
}
