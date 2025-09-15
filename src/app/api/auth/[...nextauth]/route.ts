import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers

// Force Node.js runtime instead of Edge Runtime
export const runtime = 'nodejs'
