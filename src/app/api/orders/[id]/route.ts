import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// GET /api/orders/:id — order detail with items
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { id } = await params
  const supabase = createSupabaseAdminClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total_amount, points_earned, status, created_at, order_items(id, product_name, product_price, quantity, subtotal)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return Response.json({ error: 'Order not found' }, { status: 404 })
  return Response.json(order)
}
