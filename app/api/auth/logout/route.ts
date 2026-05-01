import { getBearerToken } from '@/lib/supabase'
import { verifyToken } from '@/lib/jwt'

export async function POST(request: Request) {
  const token = getBearerToken(request)

  if (!token) {
    return Response.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
  }

  try {
    await verifyToken(token)
  } catch {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  // Tokens are stateless JWTs — the client clears them on their side
  return Response.json({ message: 'Logged out successfully' })
}
