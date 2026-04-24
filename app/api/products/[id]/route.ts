import { createSupabaseAdminClient } from '@/lib/supabase'
import { getAuthUser, unauthorized } from '@/lib/auth'

// GET /api/products/:id
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return Response.json({ error: 'Product not found' }, { status: 404 })
  return Response.json(data)
}

// PATCH /api/products/:id
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  let body: { name?: string; description?: string; price?: number; stock?: number; image_url?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.price != null && body.price < 0) {
    return Response.json({ error: 'price must be 0 or greater' }, { status: 400 })
  }
  if (body.stock != null && body.stock < 0) {
    return Response.json({ error: 'stock must be 0 or greater' }, { status: 400 })
  }

  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return Response.json({ error: 'Product not found' }, { status: 404 })
  return Response.json(data)
}

// DELETE /api/products/:id
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request)
  if (!user) return unauthorized()

  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: 'Product not found' }, { status: 404 })
  return new Response(null, { status: 204 })
}
