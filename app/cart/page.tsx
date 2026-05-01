'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Trash2, ShoppingBag, ArrowLeft, Lock, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartPointsEstimate } = useCart()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <Lock className="w-10 h-10 text-black/20 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Access Required</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Sign In First</h1>
          <p className="text-sm text-black/50 mb-8">You need an account to view your cart and place orders.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
          <ShoppingBag className="w-10 h-10 text-black/20 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Empty</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Your Cart</h1>
          <p className="text-sm text-black/50 mb-8">Nothing here yet. Explore the menu and add your favorites.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
          >
            View Menu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-black/8 py-8 px-8 md:px-16">
        <div className="max-w-350 mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-black/40 hover:text-black mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Whitesinyo Coffee</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">Your Order</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-8 md:px-16">
        <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-black/8">
            {cartItems.map((item) => {
              const pts = Math.floor(item.product.price * item.quantity * item.merchant.pointsMultiplier)
              return (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="flex gap-5 py-6"
                >
                  {/* Image */}
                  <div className="shrink-0 w-24 h-24 bg-[#EFEEED] overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-black/35 mb-1">{item.product.category}</p>
                    <h3 className="font-semibold text-sm mb-2">{item.product.name}</h3>
                    <p className="text-sm font-bold mb-1">Rp {item.product.price.toLocaleString('id-ID')}</p>
                    <p className="text-[11px] text-[#0099FF] uppercase tracking-wider">+{pts} pts</p>
                  </div>

                  {/* Qty + Remove */}
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-black/25 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center border border-black/15">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-black/50 hover:bg-black/5 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-black/50 hover:bg-black/5 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-bold">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-28 h-fit"
          >
            <div className="border border-black/8 p-8">
              <h2 className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Order Summary</h2>

              <div className="space-y-3 pb-6 border-b border-black/8 mb-6">
                <div className="flex justify-between text-sm text-black/50">
                  <span>Subtotal</span>
                  <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm text-black/50">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-bold uppercase tracking-wider text-sm">Total</span>
                <span className="font-black text-xl">Rp {getCartTotal().toLocaleString('id-ID')}</span>
              </div>

              <div className="bg-[#EFEEED] px-4 py-3 mb-6">
                <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Points to Earn</p>
                <p className="text-lg font-black text-[#0099FF]">{getCartPointsEstimate().toLocaleString('id-ID')} pts</p>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/shop"
                className="w-full flex items-center justify-center mt-3 py-3 text-[11px] uppercase tracking-widest text-black/40 hover:text-black transition-colors border border-black/10 hover:border-black"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
