import { hash } from 'bcryptjs'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password, name } = body

  if (!email || !password) {
    return Response.json({ error: 'email and password are required' }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json({ error: 'password must be at least 8 characters' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: existing } = await supabase
    .from('custom_users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return Response.json({ error: 'Email already in use' }, { status: 400 })
  }

  const password_hash = await hash(password, 10)

  const { data, error } = await supabase
    .from('custom_users')
    .insert({ email, name: name ?? null, password_hash })
    .select('id, email, name')
    .single()

  if (error || !data) {
    return Response.json({ error: 'Registration failed' }, { status: 500 })
  }

  return Response.json(
    {
      message: 'Registration successful.',
      user: { id: data.id, email: data.email, name: data.name },
    },
    { status: 201 }
  )
}
