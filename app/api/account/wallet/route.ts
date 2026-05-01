import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

export async function PUT(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { wallet_address?: string | null }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Upsert so it works even if user_points row doesn't exist yet
  const { error } = await supabase
    .from('user_points')
    .upsert(
      { user_id: user.id, wallet_address: body.wallet_address ?? null },
      { onConflict: 'user_id' }
    )

  if (error) {
    return Response.json({ error: 'Failed to update wallet' }, { status: 500 })
  }

  return Response.json({ wallet_address: body.wallet_address ?? null })
}
