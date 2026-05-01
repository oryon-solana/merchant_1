import { getBearerToken } from '@/lib/supabase'
import { verifyToken } from '@/lib/jwt'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const token = getBearerToken(request)

  if (!token) {
    return Response.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  let payload: Awaited<ReturnType<typeof verifyToken>>
  try {
    payload = await verifyToken(token)
  } catch {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  if (payload.type !== 'access') {
    return Response.json({ error: 'Invalid token type' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: user } = await supabase
    .from('custom_users')
    .select('id, email, name, created_at')
    .eq('id', payload.sub)
    .single()

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  })
}
