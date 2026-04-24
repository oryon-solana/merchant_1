import { createSupabaseClient } from '@/lib/supabase'

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

  const supabase = createSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json(
    {
      message: 'Registration successful. Check your email to confirm your account.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
      },
    },
    { status: 201 }
  )
}
