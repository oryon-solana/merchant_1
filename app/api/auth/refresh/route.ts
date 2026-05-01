import { verifyToken, signAccessToken } from '@/lib/jwt'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: { refresh_token?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { refresh_token } = body

  if (!refresh_token) {
    return Response.json({ error: 'refresh_token is required' }, { status: 400 })
  }

  let payload: Awaited<ReturnType<typeof verifyToken>>
  try {
    payload = await verifyToken(refresh_token)
  } catch {
    return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
  }

  if (payload.type !== 'refresh') {
    return Response.json({ error: 'Invalid token type' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()
  const { data: user } = await supabase
    .from('custom_users')
    .select('id, email, name')
    .eq('id', payload.sub)
    .single()

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const access_token = await signAccessToken({ sub: user.id, email: user.email, name: user.name ?? '' })

  return Response.json({
    access_token,
    token_type: 'Bearer',
    expires_in: 3600,
    user: { id: user.id, email: user.email, name: user.name },
  })
}
