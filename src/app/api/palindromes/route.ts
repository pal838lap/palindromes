import { NextResponse } from 'next/server'
import { db, palindromes, userProfiles, brands, categories } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'

// Basic shape for create request (kept simple, duplication acceptable per requirements)
type CreatePalindromeBody = {
  id: string // palindrome text primary key
  model?: string | null
  color?: string | null
  picture?: string | null
  brandId?: string | null
  categoryId?: string | null
  year?: number | null
  foundAt?: string | null // ISO date
}

// GET /api/palindromes - list all palindromes (later can add pagination & filters)
export async function GET() {
  try {
    const rows = await db
      .select({
        id: palindromes.id,
        userProfileId: palindromes.userProfileId,
        picture: palindromes.picture,
        brandId: palindromes.brandId,
        brandName: brands.name,
        year: palindromes.year,
        categoryId: palindromes.categoryId,
        categoryName: categories.name,
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
      .leftJoin(categories, eq(categories.id, palindromes.categoryId))
      .orderBy(desc(palindromes.foundAt), desc(palindromes.createdAt))

    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/palindromes - create a new palindrome if it does not already exist
export async function POST(req: Request) {
  let body: CreatePalindromeBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Very lightweight validation (explicit simplicity over abstraction)
  const rawId = (body.id || '').trim()
  if (!rawId) {
    return NextResponse.json({ error: 'Missing id (palindrome text)' }, { status: 400 })
  }
  // Normalize palindrome to uppercase (arbitrary choice; adjust if needed)
  const id = rawId.toUpperCase()

  // Basic palindrome check (optional but helpful)
  const reversed = id.split('').reverse().join('')
  if (id !== reversed) {
    return NextResponse.json({ error: 'Value is not a palindrome' }, { status: 400 })
  }

  try {
    // See if already exists
    const existing = await db.query.palindromes.findFirst({ where: (p, { eq }) => eq(p.id, id) })
    if (existing) {
      return NextResponse.json(existing, { status: 200 }) // return existing silently
    }

    const now = new Date()
    const [created] = await db.insert(palindromes).values({
      id,
      model: body.model ?? null,
      color: body.color ?? null,
      picture: body.picture ?? null,
      brandId: body.brandId ?? null,
      categoryId: body.categoryId ?? null,
      year: body.year ?? null,
      foundAt: body.foundAt ? new Date(body.foundAt) : null,
      createdAt: now,
      updatedAt: now,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
