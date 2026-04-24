'use client'

import { motion } from 'framer-motion'
import { usePoints } from '@/lib/contexts/PointsContext'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function PointsHistoryPage() {
  const { points, getTotalPoints } = usePoints()

  const totalPoints = getTotalPoints()
  const transactions = points?.transactions || []
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalEarned = transactions.reduce((sum, t) => sum + t.pointsEarned, 0)

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-black/8 py-10 px-8 md:px-16">
        <div className="max-w-350 mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Blacksinyo Coffee</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">Points History</h1>
        </div>
      </section>

      <section className="py-12 px-8 md:px-16">
        <div className="max-w-350 mx-auto">

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            <div className="bg-black text-white p-8">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Available Points</p>
              <p className="text-4xl font-black tabular-nums">{totalPoints.toLocaleString('id-ID')}</p>
              <p className="text-white/40 text-[11px] uppercase tracking-wider mt-2">poin</p>
            </div>

            <div className="border border-black/8 p-8">
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-3">Total Spent</p>
              <p className="text-3xl font-black tabular-nums">Rp {(totalSpent / 1000).toFixed(0)}K</p>
              <p className="text-black/40 text-[11px] uppercase tracking-wider mt-2">all time</p>
            </div>

            <div className="border border-black/8 p-8">
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-3">Points Earned</p>
              <p className="text-4xl font-black tabular-nums text-[#0099FF]">{totalEarned.toLocaleString('id-ID')}</p>
              <p className="text-black/40 text-[11px] uppercase tracking-wider mt-2">all time</p>
            </div>
          </motion.div>

          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-black/8"
          >
            <div className="px-6 py-5 border-b border-black/8">
              <p className="text-[10px] uppercase tracking-widest text-black/40">
                {transactions.length} Order{transactions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {transactions.length > 0 ? (
              <div className="divide-y divide-black/8">
                {transactions.map((transaction, idx) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="px-6 py-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-black">BS</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Blacksinyo Coffee</p>
                            <p className="text-[11px] text-black/35 uppercase tracking-wider">
                              {new Date(transaction.timestamp).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="ml-11 space-y-1">
                          {transaction.items.map((item, i) => (
                            <p key={i} className="text-xs text-black/40">
                              {item.productName} ×{item.quantity} — Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="md:text-right ml-11 md:ml-0 space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-black/35">Total</p>
                        <p className="text-lg font-black">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                        <div className="inline-flex items-center gap-1.5 bg-[#0099FF]/10 text-[#0099FF] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                          +{transaction.pointsEarned.toLocaleString('id-ID')} pts
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-6">
                <p className="text-[11px] uppercase tracking-widest text-black/30 mb-5">No transactions yet</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
                >
                  Order Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
