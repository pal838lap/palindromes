import { NextResponse } from 'next/server'
import { db, palindromes } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  // Support both direct object and promised params (type inference workaround)
  const resolved = 'then' in context.params ? await context.params : context.params
  const id = resolved.id
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  try {
    const [row] = await db.select().from(palindromes).where(eq(palindromes.id, id)).limit(1)
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const resolved = 'then' in context.params ? await context.params : context.params
  const id = resolved.id
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  let body: { userProfileId?: string | null }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const userProfileId = body.userProfileId ?? null
  try {
    // Update record
    const [updated] = await db
      .update(palindromes)
      .set({ userProfileId, updatedAt: new Date() })
      .where(eq(palindromes.id, id))
      .returning()
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
