import { compare } from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return Response.json({ error: 'email and password are required' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: user } = await supabase
    .from('custom_users')
    .select('id, email, name, password_hash')
    .eq('email', email)
    .single()

  if (!user) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = await compare(password, user.password_hash)
  if (!valid) {
    return Response.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const [access_token, refresh_token] = await Promise.all([
    signAccessToken({ sub: user.id, email: user.email, name: user.name ?? '' }),
    signRefreshToken(user.id),
  ])

  return Response.json({
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: 3600,
    user: { id: user.id, email: user.email, name: user.name },
  })
}
