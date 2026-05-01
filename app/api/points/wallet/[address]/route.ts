import { createSupabaseAdminClient } from '@/lib/supabase'

// GET /api/points/wallet/:address — get points by wallet address
export async function GET(_req: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const supabase = createSupabaseAdminClient()

  const { data, error } = await supabase
    .from('user_points')
    .select('user_id, total_points, updated_at, wallet_address')
    .eq('wallet_address', address)
    .single()

  if (error || !data) {
    return Response.json({ error: 'Wallet not found' }, { status: 404 })
  }

  return Response.json({
    wallet_address: data.wallet_address,
    user_id: data.user_id,
    total_points: data.total_points,
    last_updated: data.updated_at,
  })
}

// PATCH /api/points/wallet/:address — set points by wallet address
// body: { points: number }
export async function PATCH(request: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  let body: { points?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.points === undefined) {
    return Response.json({ error: 'points is required' }, { status: 400 })
  }

  if (body.points < 0) {
    return Response.json({ error: 'points must be >= 0' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from('user_points')
    .select('user_id, total_points')
    .eq('wallet_address', address)
    .single()

  if (fetchError || !existing) {
    return Response.json({ error: 'Wallet not found' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('user_points')
    .update({ total_points: body.points, updated_at: new Date().toISOString() })
    .eq('wallet_address', address)

  if (updateError) {
    return Response.json({ error: 'Failed to update points' }, { status: 500 })
  }

  return Response.json({
    wallet_address: address,
    previous_points: existing.total_points,
    total_points: body.points,
    change: body.points - existing.total_points,
  })
}
