'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MailCheck } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex -mt-20">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative flex-col justify-between p-16 pt-28 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80"
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
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4">Almost there</p>
          <h2 className="text-4xl font-black uppercase text-white leading-tight mb-3">
            ONE MORE<br />STEP
          </h2>
          <p className="text-white/40 text-sm">Verify your email to activate your account.</p>
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
              Whitesinyo
            </Link>
          </div>

          <div className="flex items-center justify-center w-14 h-14 bg-black mb-8">
            <MailCheck className="w-7 h-7 text-white" />
          </div>

          <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Account created</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Check Your Email</h1>

          <p className="text-black/50 text-sm leading-relaxed mb-2">
            Kami telah mengirimkan link verifikasi ke
          </p>
          {email && (
            <p className="text-black font-semibold text-sm mb-6 break-all">{email}</p>
          )}
          <p className="text-black/40 text-xs leading-relaxed mb-10">
            Klik link di email tersebut untuk mengaktifkan akun kamu. Cek folder spam jika tidak menemukan emailnya.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors flex items-center justify-center"
            >
              Ke Halaman Login
            </Link>

            <Link
              href="/"
              className="block text-center text-[11px] text-black/25 hover:text-black/50 uppercase tracking-widest transition-colors pt-1"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
