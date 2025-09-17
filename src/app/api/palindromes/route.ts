import { NextResponse } from 'next/server'
import { db, palindromes, userProfiles, brands, categories } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'

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
