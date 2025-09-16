import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, palindromes } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { initSupabaseAdmin, uploadPalindromeImage, validateImageUpload } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const resolved = 'then' in context.params ? await context.params : context.params
  const id = resolved.id
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure palindrome exists
  const existing = await db.select({ id: palindromes.id }).from(palindromes).where(eq(palindromes.id, id)).limit(1)
  if (!existing.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Missing file field' }, { status: 400 })
  }

  const validationError = validateImageUpload(file.name || 'upload', file.size, file.type)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  try {
    await initSupabaseAdmin()
    const { publicUrl } = await uploadPalindromeImage(id, file, file.name)
    const [updated] = await db
      .update(palindromes)
      .set({ picture: publicUrl, updatedAt: new Date() })
      .where(eq(palindromes.id, id))
      .returning()
    return NextResponse.json({ picture: publicUrl, id: updated.id })
  } catch (e) {
    console.error('Upload error', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
  const resolved = 'then' in context.params ? await context.params : context.params
  const id = resolved.id
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const session = await auth()
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const [updated] = await db
      .update(palindromes)
      .set({ picture: null, updatedAt: new Date() })
      .where(eq(palindromes.id, id))
      .returning()
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ id: updated.id, picture: null })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
