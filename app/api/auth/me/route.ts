import { createSupabaseAdminClient, getBearerToken } from '@/lib/supabase'

export async function GET(request: Request) {
  const token = getBearerToken(request)

  if (!token) {
    return Response.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const admin = createSupabaseAdminClient()
  const { data: { user }, error } = await admin.auth.getUser(token)

  if (error || !user) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  return Response.json({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name,
    created_at: user.created_at,
    email_confirmed: !!user.email_confirmed_at,
  })
}
