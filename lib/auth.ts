import { getBearerToken } from '@/lib/supabase'
import { verifyToken } from '@/lib/jwt'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export async function getAuthUser(request: Request): Promise<AuthUser | null> {
  const token = getBearerToken(request)
  if (!token) return null
  try {
    const payload = await verifyToken(token)
    if (payload.type !== 'access') return null
    return { id: payload.sub, email: payload.email ?? '', name: payload.name ?? '' }
  } catch {
    return null
  }
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
