'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { AlertCircle, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await register(name, email, phone, password)
      router.push('/shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex -mt-20">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative flex-col justify-between p-16 pt-28 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80"
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
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Join the Club</p>
          <h2 className="text-4xl font-black uppercase text-white leading-tight mb-3">
            START EARNING<br />TODAY
          </h2>
          <p className="text-white/40 text-sm">Free to join. Points on every order.</p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-white">
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

          <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Create account</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-10">Join Free</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-black/50">Full Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="border-black/20 focus:border-black bg-transparent"
              />
            </div>

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
              <label className="text-[11px] uppercase tracking-widest text-black/50">Phone</label>
              <Input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-black/50">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating account...' : (
                <>Create Account <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-3 text-center">
            <p className="text-xs text-black/40">
              Already have an account?{' '}
              <Link href="/login" className="text-black font-semibold hover:text-[#0099FF] transition-colors">
                Sign in
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
