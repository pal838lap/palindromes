import { NextResponse } from 'next/server'
import { db, userProfiles } from '@/lib/db'

// Basic shape for creating profile
type CreateUserProfileBody = { name?: string; avatar?: string | null }

export async function GET() {
  try {
    const rows = await db.select().from(userProfiles).orderBy(userProfiles.name)
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  let body: CreateUserProfileBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const name = (body.name || '').trim()
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 422 })
  }
  const avatar = body.avatar?.trim() || null
  try {
    const [inserted] = await db.insert(userProfiles).values({ name, avatar }).returning()
    return NextResponse.json(inserted, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
