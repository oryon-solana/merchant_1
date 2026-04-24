import { createSupabaseAdminClient, getBearerToken } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export async function getAuthUser(request: Request): Promise<User | null> {
  const token = getBearerToken(request)
  if (!token) return null
  const { data: { user } } = await createSupabaseAdminClient().auth.getUser(token)
  return user
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
