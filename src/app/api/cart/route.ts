import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// GET /api/cart — view cart with product details
export async function GET(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, quantity, created_at, product:products(id, name, price, stock, image_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  type ProductShape = { price: number }
  const total = (data ?? []).reduce(
    (sum, item) => sum + (item.product as unknown as ProductShape).price * item.quantity,
    0
  )

  return Response.json({ items: data, total })
}

// POST /api/cart — add item (or increase quantity if already in cart)
export async function POST(request: Request) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { product_id?: string; quantity?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { product_id, quantity = 1 } = body
  if (!product_id) return Response.json({ error: 'product_id is required' }, { status: 400 })
  if (quantity < 1) return Response.json({ error: 'quantity must be at least 1' }, { status: 400 })

  const supabase = createSupabaseAdminClient()

  // verify product exists and has enough stock
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, stock')
    .eq('id', product_id)
    .single()

  if (productError || !product) return Response.json({ error: 'Product not found' }, { status: 404 })
  if (product.stock < quantity) return Response.json({ error: 'Not enough stock' }, { status: 400 })

  // upsert: if item already in cart, add to its quantity
  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: user.id, product_id, quantity },
      { onConflict: 'user_id,product_id', ignoreDuplicates: false }
    )
    .select('id, quantity, product:products(id, name, price)')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
