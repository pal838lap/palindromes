import { SiteHeader } from "@/components/layout/site-header";
import { Suspense } from 'react'
import { PalindromesGallery } from '@/components/palindromes-gallery'

export default async function Home() {
  return (
  <div className="min-h-screen text-foreground">
      <SiteHeader pageTitle="Gallery" />
      <main className="container mx-auto px-2 py-4 space-y-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
          <PalindromesGallery />
        </Suspense>
      </main>
    </div>
  );
}
