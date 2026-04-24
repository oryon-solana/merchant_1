'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCart } from '@/lib/contexts/CartContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { apiFetch } from '@/lib/api-client'
import { Merchant } from '@/lib/types'

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchant: Merchant
}

export default function CheckoutDialog({ open, onOpenChange, merchant }: CheckoutDialogProps) {
  const { user } = useAuth()
  const { cartItems, getCartTotal, getCartPointsEstimate, clearCart } = useCart()
  const { refreshPoints } = usePoints()
  const [step, setStep] = useState<'payment' | 'receipt'>('payment')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'cash'>('card')
  const [pointsEarnedResult, setPointsEarnedResult] = useState(0)
  const [error, setError] = useState('')

  const total = getCartTotal()
  const pointsEstimate = getCartPointsEstimate()

  const handleProcessPayment = async () => {
    if (!user) return
    setIsProcessing(true)
    setError('')

    try {
      const res = await apiFetch('/api/orders', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Payment failed. Please try again.')
        return
      }

      setPointsEarnedResult(data.points_summary.earned)
      clearCart()
      await refreshPoints()
      setStep('receipt')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseDialog = () => {
    if (step === 'receipt') {
      setStep('payment')
      setPaymentMethod('card')
      setPointsEarnedResult(0)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'payment' ? 'Konfirmasi Pembayaran' : 'Pembayaran Berhasil'}
          </DialogTitle>
          <DialogDescription>
            {step === 'payment'
              ? 'Pilih metode pembayaran dan selesaikan transaksi'
              : 'Terima kasih atas pembelian Anda'}
          </DialogDescription>
        </DialogHeader>

        {step === 'payment' ? (
          <div className="space-y-4">
            <Card className="bg-slate-50 p-4">
              <p className="text-sm text-slate-600 mb-2">Ringkasan Pesanan</p>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp{total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </Card>

            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-sm text-slate-600">Poin yang akan didapat</p>
              <p className="text-2xl font-bold text-green-600">⭐ {pointsEstimate}</p>
              <p className="text-xs text-slate-500 mt-1">(1 poin per Rp 8.000)</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Metode Pembayaran</p>
              {(['card', 'transfer', 'cash'] as const).map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value as typeof method)}
                  />
                  <span className="text-sm font-medium text-slate-900">
                    {method === 'card' ? '💳 Kartu Kredit' : method === 'transfer' ? '🏦 Transfer Bank' : '💵 Tunai'}
                  </span>
                </label>
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-sm text-slate-600 mb-4">Transaksi Anda telah diproses dengan sukses</p>
            </div>

            <Card className="bg-slate-50 p-4 text-left">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Merchant</span>
                  <span className="font-semibold">{merchant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Belanja</span>
                  <span className="font-semibold">Rp{total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Metode Pembayaran</span>
                  <span className="font-semibold">
                    {paymentMethod === 'card' ? 'Kartu Kredit' : paymentMethod === 'transfer' ? 'Transfer Bank' : 'Tunai'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between bg-green-50 -m-4 p-4 rounded">
                  <span className="font-bold text-slate-900">Poin Terkumpul</span>
                  <span className="font-bold text-green-600 text-lg">+{pointsEarnedResult}</span>
                </div>
              </div>
            </Card>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCloseDialog}>
              Selesai
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
