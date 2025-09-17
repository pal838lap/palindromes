import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PalindromeSearch } from '@/components/admin/palindrome-search'
import { PalindromeCreateForm } from '@/components/admin/palindrome-create-form'
import { SiteHeader } from '@/components/layout/site-header'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <>
      <SiteHeader pageTitle="Admin" />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <PalindromeSearch />
        <PalindromeCreateForm />
      </main>
    </>
  )
}
