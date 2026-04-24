import { createSupabaseAdminClient, getBearerToken } from '@/lib/supabase'

export async function POST(request: Request) {
  const token = getBearerToken(request)

  if (!token) {
    return Response.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  const admin = createSupabaseAdminClient()

  const { data: { user }, error: userError } = await admin.auth.getUser(token)

  if (userError || !user) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  const { error } = await admin.auth.admin.signOut(user.id, 'global')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ message: 'Logged out successfully' })
}
