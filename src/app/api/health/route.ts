import { createSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.auth.getSession()

    if (error) {
      return Response.json({ status: 'error', message: error.message }, { status: 500 })
    }

    return Response.json({ status: 'ok', supabase: 'connected' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ status: 'error', message }, { status: 500 })
  }
}
