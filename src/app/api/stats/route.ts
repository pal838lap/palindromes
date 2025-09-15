import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dbOperations } from '@/lib/db'

export async function GET() {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get dashboard statistics using Drizzle
    const stats = await dbOperations.getStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
