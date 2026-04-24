'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AccountPage() {
  const { user } = useAuth()
  const { points, getTotalPoints } = usePoints()

  if (!user) return null

  const totalPoints = getTotalPoints()
  const recentTransactions = points?.transactions.slice(0, 5) || []

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-black/8 py-10 px-8 md:px-16">
        <div className="max-w-350 mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Blacksinyo Coffee</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">My Account</h1>
        </div>
      </section>

      <section className="py-12 px-8 md:px-16">
        <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="border border-black/8 p-8 sticky top-28">
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Profile</p>

              <div className="w-14 h-14 bg-black flex items-center justify-center text-white text-xl font-black mb-6">
                {user.name?.[0]?.toUpperCase()}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/35 mb-1">Name</p>
                  <p className="font-semibold text-sm">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/35 mb-1">Email</p>
                  <p className="font-semibold text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-black/35 mb-1">Phone</p>
                  <p className="font-semibold text-sm">{user.phone}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Points + Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Points cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black text-white p-8">
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Total Points</p>
                <p className="text-5xl font-black tabular-nums">{totalPoints.toLocaleString('id-ID')}</p>
                <p className="text-white/40 text-[11px] uppercase tracking-wider mt-2">poin available</p>
              </div>

              <div className="border border-black/8 p-8">
                <p className="text-[10px] uppercase tracking-widest text-black/40 mb-3">Transactions</p>
                <p className="text-5xl font-black tabular-nums">{points?.transactions.length || 0}</p>
                <p className="text-black/40 text-[11px] uppercase tracking-wider mt-2">total orders</p>
              </div>
            </div>

            {/* Recent transactions */}
            <div className="border border-black/8">
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
                <p className="text-[10px] uppercase tracking-widest text-black/40">Recent Orders</p>
                <Link
                  href="/points-history"
                  className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentTransactions.length > 0 ? (
                <div className="divide-y divide-black/8">
                  {recentTransactions.map((trans) => (
                    <div key={trans.id} className="flex items-start justify-between px-6 py-5">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-semibold mb-1">
                          {trans.items.map((i) => i.productName).join(', ')}
                        </p>
                        <p className="text-[11px] text-black/35 uppercase tracking-wider">
                          {new Date(trans.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' · '}
                          {trans.items.length} item{trans.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold mb-1">Rp {trans.amount.toLocaleString('id-ID')}</p>
                        <p className="text-[11px] font-semibold text-[#0099FF]">+{trans.pointsEarned.toLocaleString('id-ID')} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <p className="text-[11px] uppercase tracking-widest text-black/30 mb-4">No orders yet</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
                  >
                    Browse Menu <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
