import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Only visible to admin users.</p>
      <div className="rounded-md border p-4 bg-background">
        <p className="text-sm">Welcome, {session.user.name || 'Admin'}.</p>
      </div>
    </main>
  )
}
