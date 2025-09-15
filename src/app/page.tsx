import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <SiteHeader pageTitle="Home" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to Your Template
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive, production-ready Next.js template with TypeScript, 
              Shadcn/ui, dark mode, and modern development tools.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎨 Modern UI</CardTitle>
                <CardDescription>
                  Built with Shadcn/ui and Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Beautiful, accessible components with dark mode support out of the box.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Authentication</CardTitle>
                <CardDescription>
                  NextAuth.js v5 with multiple providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure authentication with GitHub, Google, and more providers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Production Ready</CardTitle>
                <CardDescription>
                  Optimized for deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Environment validation, performance optimization, and deployment guides.
                </p>
              </CardContent>
            </Card>
          </div>



          {/* Status Info */}
          <div className="text-center text-sm text-muted-foreground space-y-1">

            {session?.user ? (
              <p className="text-green-600">✅ You are signed in as {session.user.name || session.user.email}</p>
            ) : (
              <p className="text-blue-600">👆 Try signing in to test authentication</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
