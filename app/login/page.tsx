'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
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
          alt="Blacksinyo Coffee"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: 'easeOut' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="relative z-10">
          <Link href="/" className="text-white text-sm font-black uppercase tracking-widest">
            Blacksinyo
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
              Blacksinyo
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

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="bg-black/4 px-4 py-3 text-xs text-black/40">
              Demo: <code className="font-mono">budi@example.com</code> / <code className="font-mono">password123</code>
            </div>

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

          <div className="mt-8 space-y-3 text-center">
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
