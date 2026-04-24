import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// PATCH /api/cart/:id — update quantity
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { quantity?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { quantity } = body
  if (quantity == null || quantity < 1) {
    return Response.json({ error: 'quantity must be at least 1' }, { status: 400 })
  }

  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, quantity, product:products(id, name, price)')
    .single()

  if (error) return Response.json({ error: 'Cart item not found' }, { status: 404 })
  return Response.json(data)
}

// DELETE /api/cart/:id — remove item from cart
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: 'Cart item not found' }, { status: 404 })
  return new Response(null, { status: 204 })
}
