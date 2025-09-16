import { NextResponse } from 'next/server'
import { db, palindromes, userProfiles, brands } from '@/lib/db'
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
    const [row] = await db
      .select({
        id: palindromes.id,
        userProfileId: palindromes.userProfileId,
        picture: palindromes.picture,
  brandId: palindromes.brandId,
  brandName: brands.name,
        year: palindromes.year,
        categoryId: palindromes.categoryId,
        model: palindromes.model,
        color: palindromes.color,
        foundAt: palindromes.foundAt,
        createdAt: palindromes.createdAt,
        updatedAt: palindromes.updatedAt,
        userProfileName: userProfiles.name,
      })
      .from(palindromes)
  .leftJoin(userProfiles, eq(userProfiles.id, palindromes.userProfileId))
  .leftJoin(brands, eq(brands.id, palindromes.brandId))
      .where(eq(palindromes.id, id))
      .limit(1)
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
  // Treat empty string or undefined as null (unassign)
  const rawUserProfileId = body.userProfileId
  const userProfileId = (rawUserProfileId === '' || rawUserProfileId == null) ? null : rawUserProfileId
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
