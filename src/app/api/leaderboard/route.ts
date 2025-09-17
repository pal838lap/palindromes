import { NextResponse } from 'next/server'
import { dbOperations } from '@/lib/db'

// GET /api/leaderboard - returns user profiles with counts of palindromes found
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 100) : undefined
  try {
    const rows = await dbOperations.getLeaderboard(limit)
    // Add rank (1-based) on the server for convenience
    const ranked = rows.map((row, idx) => ({ rank: idx + 1, ...row }))
    return NextResponse.json(ranked)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
