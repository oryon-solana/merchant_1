import { createSupabaseClient } from '@/lib/supabase'

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

  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.refreshSession({ refresh_token })

  if (error || !data.session) {
    return Response.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
  }

  const { session, user } = data

  return Response.json({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    token_type: 'Bearer',
    expires_in: session.expires_in,
    user: {
      id: user?.id,
      email: user?.email,
      name: user?.user_metadata?.name,
    },
  })
}
