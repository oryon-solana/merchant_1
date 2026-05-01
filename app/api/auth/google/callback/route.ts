import { createSupabaseAdminClient } from '@/lib/supabase'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  if (error || !code) {
    return Response.redirect(`${appUrl}/login?error=google_cancelled`)
  }

  // Exchange code for Google access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    return Response.redirect(`${appUrl}/login?error=google_failed`)
  }

  const { access_token: googleAccessToken } = await tokenRes.json()

  // Fetch Google user profile
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${googleAccessToken}` },
  })

  if (!profileRes.ok) {
    return Response.redirect(`${appUrl}/login?error=google_failed`)
  }

  const googleUser: { id: string; email: string; name: string } = await profileRes.json()

  const supabase = createSupabaseAdminClient()

  // Find existing user by google_id
  let { data: user } = await supabase
    .from('custom_users')
    .select('id, email, name')
    .eq('google_id', googleUser.id)
    .single()

  if (!user) {
    // Try matching by email (link Google to existing account)
    const { data: byEmail } = await supabase
      .from('custom_users')
      .select('id, email, name')
      .eq('email', googleUser.email)
      .single()

    if (byEmail) {
      await supabase.from('custom_users').update({ google_id: googleUser.id }).eq('id', byEmail.id)
      user = byEmail
    } else {
      // Create new user
      const { data: created } = await supabase
        .from('custom_users')
        .insert({ email: googleUser.email, name: googleUser.name, google_id: googleUser.id })
        .select('id, email, name')
        .single()
      user = created
    }
  }

  if (!user) {
    return Response.redirect(`${appUrl}/login?error=google_failed`)
  }

  const [access_token, refresh_token] = await Promise.all([
    signAccessToken({ sub: user.id, email: user.email, name: user.name ?? '' }),
    signRefreshToken(user.id),
  ])

  const params = new URLSearchParams({ access_token, refresh_token })
  return Response.redirect(`${appUrl}/auth/callback?${params}`)
}
