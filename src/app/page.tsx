import { SiteHeader } from "@/components/layout/site-header";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <SiteHeader pageTitle="Home" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Content goes here */}
      </main>
    </div>
  );
}
