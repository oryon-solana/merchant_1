'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { storeTokens } from '@/lib/api-client'
import { Suspense } from 'react'

function CallbackHandler() {
  const params = useSearchParams()

  useEffect(() => {
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      storeTokens(access_token, refresh_token)
      window.location.href = '/shop'
    } else {
      window.location.href = '/login?error=google_failed'
    }
  }, [params])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-black/40 uppercase tracking-widest">Signing you in...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  )
}
