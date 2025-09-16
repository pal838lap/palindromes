import { NextResponse } from 'next/server'
import { db, userProfiles } from '@/lib/db'

export async function GET() {
  try {
    const rows = await db.select().from(userProfiles).orderBy(userProfiles.name)
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
