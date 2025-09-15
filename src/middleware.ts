import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporarily disable auth middleware to test if Edge Runtime is the issue
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

// Configure which routes use this middleware  
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
