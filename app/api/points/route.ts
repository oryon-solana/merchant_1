import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// GET /api/points — balance and transaction history
export async function GET(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const supabase = createSupabaseAdminClient()

  const [pointsResult, historyResult] = await Promise.all([
    supabase
      .from('user_points')
      .select('total_points, updated_at')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('point_transactions')
      .select('id, points, type, note, created_at, order_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return Response.json({
    total_points: pointsResult.data?.total_points ?? 0,
    last_updated: pointsResult.data?.updated_at ?? null,
    history: historyResult.data ?? [],
  })
}
