import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
            <CardDescription>
              There was an error signing you in
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link 
              href="/auth/signin"
              className="text-primary hover:underline"
            >
              Try signing in again
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
