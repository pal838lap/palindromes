// Lazy import of supabase-js only when needed to keep edge bundle smaller if not used
// Suppress type resolution issues until dependency types are installed at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabase: any | null = null

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'palindromes'

export function getSupabaseAdminClient() {
  if (!_supabase) {
    throw new Error('Supabase admin not initialized. Call initSupabaseAdmin() first.')
  }
  return _supabase
}

export async function initSupabaseAdmin() {
  if (_supabase) return _supabase
  const { createClient } = await import('@supabase/supabase-js')
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Supabase admin client missing URL or service role key')
  }
  _supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return _supabase
}

const ALLOWED_MIME = ['image/jpeg','image/png','image/webp','image/avif']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

export function buildPalindromeImagePath(palindromeId: string, fileName: string) {
  const safeId = palindromeId.replace(/[^A-Za-z0-9_-]/g, '_')
  const ts = Date.now()
  const extMatch = fileName.match(/\.([A-Za-z0-9]+)$/)
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'
  return `${safeId}/${ts}-${Math.random().toString(36).slice(2,10)}.${ext}`
}

export function validateImageUpload(name: string, size: number, type: string) {
  if (size > MAX_SIZE_BYTES) {
    return `File too large. Max size is ${Math.round(MAX_SIZE_BYTES/1024/1024)}MB`
  }
  if (!ALLOWED_MIME.includes(type)) {
    return 'Unsupported file type'
  }
  if (!/\.(jpe?g|png|webp|avif)$/i.test(name)) {
    return 'File extension must be jpg, jpeg, png, webp, or avif'
  }
  return null
}

export async function uploadPalindromeImage(palindromeId: string, file: File | Blob, originalName: string) {
  await initSupabaseAdmin()
  const supabase = getSupabaseAdminClient()
  const path = buildPalindromeImagePath(palindromeId, originalName)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, publicUrl: data.publicUrl }
}

export function getPublicUrl(path: string) {
  const supabase = getSupabaseAdminClient()
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export { BUCKET as PALINDROME_IMAGES_BUCKET }
