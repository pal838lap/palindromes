import type { Palindrome } from '@/lib/api/api.types'

export type PalindromeSort = 'foundAtDesc' | 'foundAtAsc' | 'createdDesc' | 'createdAsc' | 'idAsc' | 'idDesc' | 'brandAsc' | 'brandDesc' | 'userAsc' | 'userDesc'
export interface PalindromeFilters {
  prefix?: string
  user?: string
  brand?: string
  color?: string
  found?: 'all' | 'found' | 'unfound'
  sort: PalindromeSort
}

export function filterAndSortPalindromes(data: Palindrome[], f: PalindromeFilters) {
  const prefix = f.prefix?.trim() || ''
  const user = f.user?.trim().toLowerCase() || ''
  const color = f.color?.trim().toLowerCase() || ''
  const brand = f.brand || ''
  const foundMode = f.found || 'all'
  return data.filter(p => {
    if (prefix && !p.id.startsWith(prefix)) return false
    if (user) {
      const name = (p.userProfileName || '').toLowerCase()
      if (!name.includes(user)) return false
    }
    if (brand && (p.brandName || '') !== brand) return false
    if (color) {
      const c = (p.color || '').toLowerCase()
      if (!c.includes(color)) return false
    }
    if (foundMode !== 'all') {
      const isFound = !!p.userProfileId
      if (foundMode === 'found' && !isFound) return false
      if (foundMode === 'unfound' && isFound) return false
    }
    return true
  }).sort((a,b) => {
    const dAFound = a.foundAt ? new Date(a.foundAt).getTime() : 0
    const dBFound = b.foundAt ? new Date(b.foundAt).getTime() : 0
    const dACreated = new Date(a.createdAt).getTime()
    const dBCreated = new Date(b.createdAt).getTime()
    const brandA = a.brandName || ''
    const brandB = b.brandName || ''
    const userA = a.userProfileName || ''
    const userB = b.userProfileName || ''
    switch (f.sort) {
      case 'foundAtDesc': return dBFound - dAFound
      case 'foundAtAsc': return dAFound - dBFound
      case 'createdDesc': return dBCreated - dACreated
      case 'createdAsc': return dACreated - dBCreated
      case 'idAsc': {
        if (a.id.length !== b.id.length) return a.id.length - b.id.length
        return a.id.localeCompare(b.id)
      }
      case 'idDesc': {
        if (a.id.length !== b.id.length) return a.id.length - b.id.length
        return b.id.localeCompare(a.id)
      }
      case 'brandAsc': return brandA.localeCompare(brandB)
      case 'brandDesc': return brandB.localeCompare(brandA)
      case 'userAsc': return userA.localeCompare(userB)
      case 'userDesc': return userB.localeCompare(userA)
    }
  })
}
