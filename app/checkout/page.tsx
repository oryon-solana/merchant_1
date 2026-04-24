'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/contexts/CartContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { Input } from '@/components/ui/input'
import { Lock, ArrowLeft, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const { addTransaction } = usePoints()
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('e-wallet')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.address && formData.city && formData.postalCode) {
      setStep('payment')
    }
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const newOrderId = `BS-${Date.now()}`
      setOrderId(newOrderId)
      addTransaction({
        id: newOrderId,
        userId: user!.id,
        merchantId: 'blacksinyo',
        merchantName: 'Blacksinyo Coffee',
        amount: getCartTotal(),
        pointsEarned: getCartPointsEstimate(),
        timestamp: new Date(),
        items: cartItems.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      })
      clearCart()
      setStep('success')
      setIsProcessing(false)
    }, 2000)
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
              onClick={() => step === 'payment' ? setStep('form') : router.back()}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-black/40 hover:text-black mb-5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {step === 'payment' ? 'Back to Details' : 'Back'}
            </button>
          )}
          <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Blacksinyo Coffee</p>
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
                    <span className="font-black text-[#0099FF]">+{getCartPointsEstimate().toLocaleString('id-ID')} pts</span>
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

              {/* Left: form */}
              <div className="lg:col-span-2">
                {step === 'form' ? (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-[10px] uppercase tracking-widest text-black/40 mb-6">Delivery Details</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">Full Name</label>
                        <Input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                          placeholder="Your full name"
                          className="border-black/15 focus:border-black bg-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">Email</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="email@example.com"
                            className="border-black/15 focus:border-black bg-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">Phone</label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            placeholder="08xxxxxxxxxx"
                            className="border-black/15 focus:border-black bg-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">Address</label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                          placeholder="Street, number, unit..."
                          rows={3}
                          className="w-full px-3 py-2.5 border border-black/15 focus:border-black focus:outline-none text-sm bg-transparent resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">City</label>
                          <Input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            placeholder="City"
                            className="border-black/15 focus:border-black bg-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-widest text-black/50 mb-2">Postal Code</label>
                          <Input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            required
                            placeholder="00000"
                            className="border-black/15 focus:border-black bg-transparent"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors flex items-center justify-center gap-2"
                      >
                        Continue to Payment <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </motion.div>

                ) : (
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
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-[#0099FF] text-white py-3.5 text-[11px] uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                      {!isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </motion.div>
                )}
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
