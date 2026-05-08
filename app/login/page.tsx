'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex -mt-20">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative flex-col justify-between p-16 pt-28 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80"
          alt="Whitesinyo Coffee"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="relative z-10">
          <Link href="/" className="text-white text-sm font-black uppercase tracking-widest">
            Whitesinyo
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Loyalty Program</p>
          <h2 className="text-4xl font-black uppercase text-white leading-tight mb-3">
            EVERY SIP<br />EARNS POINTS
          </h2>
          <p className="text-white/40 text-sm">1 poin for every Rp 10 spent.</p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="text-black text-sm font-black uppercase tracking-widest">
              Whitesinyo
            </Link>
          </div>

          <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Welcome back</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-10">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-black/50">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-black/20 focus:border-black bg-transparent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-black/50">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-black/20 focus:border-black bg-transparent"
              />
            </div>

            {justRegistered && !error && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-2 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Akun berhasil dibuat. Silakan login.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : (
                <>Sign In <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-black/10" />
              <span className="text-[10px] uppercase tracking-widest text-black/30">or</span>
              <div className="flex-1 h-px bg-black/10" />
            </div>
            <a
              href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 border border-black/20 py-3 text-[11px] uppercase tracking-widest hover:border-black transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </a>
          </div>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-xs text-black/40">
              No account?{' '}
              <Link href="/register" className="text-black font-semibold hover:text-[#0099FF] transition-colors">
                Register free
              </Link>
            </p>
            <Link href="/" className="block text-[11px] text-black/25 hover:text-black/50 uppercase tracking-widest transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
