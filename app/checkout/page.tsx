'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { apiFetch } from '@/lib/api-client'
import { Lock, ArrowLeft, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { refreshPoints } = usePoints()
  const [step, setStep] = useState<'payment' | 'success'>('payment')
  const [paymentMethod, setPaymentMethod] = useState('e-wallet')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [pointsEarned, setPointsEarned] = useState(0)
  const [checkoutError, setCheckoutError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <Lock className="w-10 h-10 text-black/20 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Access Required</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Sign In First</h1>
          <p className="text-sm text-black/50 mb-8">You need an account to complete your order.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-black/20 mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Nothing to checkout</p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Cart is Empty</h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
          >
            Browse Menu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    setCheckoutError('')
    try {
      const res = await apiFetch('/api/orders', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setCheckoutError(data.error ?? 'Payment failed. Please try again.')
        return
      }
      setOrderId(data.order.id)
      setPointsEarned(data.points_summary.earned)
      clearCart()
      await refreshPoints()
      setStep('success')
    } catch {
      setCheckoutError('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const PAYMENT_METHODS = [
    { id: 'e-wallet', label: 'E-Wallet', desc: 'GoPay, OVO, DANA' },
    { id: 'credit-card', label: 'Credit Card', desc: 'Visa, Mastercard' },
    { id: 'debit-card', label: 'Debit Card', desc: 'Bank debit' },
    { id: 'transfer', label: 'Bank Transfer', desc: 'Manual transfer' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-black/8 py-8 px-8 md:px-16">
        <div className="max-w-350 mx-auto">
          {step !== 'success' && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-black/40 hover:text-black mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Whitesinyo Coffee</p>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {step === 'success' ? 'Order Confirmed' : 'Checkout'}
          </h1>
        </div>
      </section>

      <section className="py-12 px-8 md:px-16">
        <div className="max-w-350 mx-auto">

          {step === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 bg-[#0099FF] flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-black/40 mb-2">Thank you</p>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Order Received</h2>
              <p className="text-sm text-black/50 mb-10">Your order is being prepared. We'll have it ready shortly.</p>

              <div className="border border-black/8 p-6 text-left mb-8">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/40 uppercase tracking-wider text-[10px]">Order ID</span>
                    <span className="font-bold font-mono">{orderId}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-black/8">
                    <span className="text-black/40 uppercase tracking-wider text-[10px]">Points Earned</span>
                    <span className="font-black text-[#0099FF]">+{pointsEarned.toLocaleString('id-ID')} pts</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/shop"
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors"
                >
                  Order Again
                </Link>
                <Link
                  href="/account"
                  className="flex-1 flex items-center justify-center py-3.5 text-[11px] uppercase tracking-widest border border-black/15 hover:border-black transition-colors"
                >
                  My Account
                </Link>
              </div>
            </motion.div>

          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

              {/* Left: payment method */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Payment Method</h2>
                  <div className="space-y-3 mb-8">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-black bg-black/3'
                            : 'border-black/12 hover:border-black/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wider">{method.label}</p>
                          <p className="text-xs text-black/40">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {checkoutError && (
                    <p className="text-red-600 text-sm mb-4">{checkoutError}</p>
                  )}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-[#0099FF] text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                    {!isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </motion.div>
              </div>

              {/* Right: summary */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="sticky top-28 h-fit"
              >
                <div className="border border-black/8 p-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-black/40 mb-5">Your Order</h3>
                  <div className="space-y-3 pb-5 border-b border-black/8 mb-5 max-h-72 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-black/60 truncate pr-3">{item.product.name} ×{item.quantity}</span>
                        <span className="font-semibold shrink-0">Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mb-5">
                    <span className="text-[11px] uppercase tracking-widest font-bold">Total</span>
                    <span className="font-black">Rp {getCartTotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-[#EFEEED] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Points to Earn</p>
                    <p className="font-black text-[#0099FF]">{getCartPointsEstimate().toLocaleString('id-ID')} pts</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
