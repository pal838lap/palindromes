import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SiteHeader } from "@/components/layout/site-header"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/signin")
  }

  

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader pageTitle="Dashboard" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {session.user.name || "User"}!
            </h2>
            <p className="text-muted-foreground">
              This is your protected dashboard with live statistics.
            </p>
          </div>

          {/* Dashboard Statistics */}
          <div>
            <h3 className="text-xl font-semibold mb-4">📊 Dashboard Statistics</h3>
            <DashboardStats />
          </div>

          {/* Feature Cards */}
          <div>
            <h3 className="text-xl font-semibold mb-4">🚀 Template Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>✅ Authentication</CardTitle>
                <CardDescription>
                  NextAuth.js v5 with PostgreSQL + Drizzle ORM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You&apos;re successfully authenticated!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Protected Route</CardTitle>
                <CardDescription>
                  Middleware protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This page is protected by authentication middleware.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👤 User Session</CardTitle>
                <CardDescription>
                  Session management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {session.user.name || "N/A"}</p>
                  <p><strong>Email:</strong> {session.user.email || "N/A"}</p>
                  <p><strong>ID:</strong> {session.user.id || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}