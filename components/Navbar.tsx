'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { useCart } from '@/lib/contexts/CartContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ShoppingCart, Gift, LogOut, User, X, Menu } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Menu', href: '/shop' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const { getTotalPoints } = usePoints()
  const { cartItems } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  if (isAuthPage) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const textColor = transparent ? 'text-white' : 'text-black'
  const mutedColor = transparent ? 'text-white/60' : 'text-black/50'

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent ? 'bg-transparent' : 'bg-white border-b border-black/8'
        }`}
      >
        <div className="max-w-350 mx-auto px-8 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className={`text-sm font-black uppercase tracking-widest transition-colors ${textColor}`}
            >
              Blacksinyo
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`relative text-[11px] uppercase tracking-widest transition-colors group ${mutedColor}`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${
                      transparent ? 'bg-white' : 'bg-black'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-5">
              {isAuthenticated ? (
                <>
                  {/* Points */}
                  <div className={`hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-widest ${mutedColor}`}>
                    <Gift className="w-3.5 h-3.5" />
                    <span className="font-semibold tabular-nums">{getTotalPoints().toLocaleString('id-ID')}</span>
                  </div>

                  {/* Cart */}
                  <Link href="/cart" className="relative">
                    <ShoppingCart className={`w-5 h-5 transition-colors ${textColor}`} />
                    <AnimatePresence>
                      {cartItems.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1.5 -right-1.5 bg-[#0099FF] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center"
                        >
                          {cartItems.length}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <div
                        className={`w-7 h-7 border flex items-center justify-center text-[11px] font-bold transition-colors ${
                          transparent ? 'border-white/50 text-white' : 'border-black/30 text-black'
                        }`}
                      >
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 border-black/10">
                      <DropdownMenuItem className="text-xs text-black/40 cursor-default">{user?.name}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
                          <User className="w-3.5 h-3.5" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/points-history" className="flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
                          <Gift className="w-3.5 h-3.5" /> Points History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-500 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-5">
                  <Link
                    href="/login"
                    className={`text-[11px] uppercase tracking-widest transition-colors ${mutedColor}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className={`text-[11px] uppercase tracking-widest px-5 py-2.5 transition-colors ${
                      transparent
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'bg-black text-white hover:bg-black/80'
                    }`}
                  >
                    Join Free
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className={`md:hidden transition-colors ${textColor}`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-8 pb-12"
          >
            <nav className="flex flex-col gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-3xl font-black uppercase tracking-tight text-black hover:text-[#0099FF] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-black/40">
                    <Gift className="w-4 h-4" />
                    {getTotalPoints().toLocaleString('id-ID')} pts
                  </div>
                  <Link href="/account" className="text-[11px] uppercase tracking-widest text-black/50">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[11px] uppercase tracking-widest text-red-500 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-[11px] uppercase tracking-widest text-black/50">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-black text-white text-[11px] uppercase tracking-widest px-6 py-3 text-center hover:bg-[#0099FF] transition-colors"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
