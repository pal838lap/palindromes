import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PalindromeSearch } from '@/components/admin/palindrome-search'
import { SiteHeader } from '@/components/layout/site-header'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <>
      <SiteHeader pageTitle="Admin" />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Only visible to admin users.</p>
        <div className="rounded-md border p-4 bg-background">
          <p className="text-sm">Welcome, {session.user.name || 'Admin'}.</p>
        </div>
        <PalindromeSearch />
      </main>
    </>
  )
}
