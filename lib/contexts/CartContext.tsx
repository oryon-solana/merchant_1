'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { CartItem, Product, Merchant } from '../types'
import { MOCK_MERCHANTS } from '../mock-data'
import { apiFetch } from '../api-client'
import { useAuth } from './AuthContext'

interface CartContextType {
  cartItems: CartItem[]
  isLoading: boolean
  addToCart: (product: Product, merchant: Merchant, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  updateQuantity: (productId: string, quantity: number) => void
  getCartTotal: () => number
  getCartPointsEstimate: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // maps productId → server cart item UUID (needed for PATCH/DELETE)
  const cartItemIds = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    if (!user) {
      setCartItems([])
      cartItemIds.current.clear()
      return
    }
    setIsLoading(true)
    apiFetch('/api/cart')
      .then(async (res) => {
        if (!res.ok) return
        const data: { items: { id: string; quantity: number; product: { id: string; name: string; price: number; stock: number; image_url: string } }[] } = await res.json()
        cartItemIds.current.clear()
        const items: CartItem[] = (data.items ?? []).map((item) => {
          cartItemIds.current.set(item.product.id, item.id)
          return {
            quantity: item.quantity,
            merchant: MOCK_MERCHANTS[0],
            product: {
              id: item.product.id,
              merchantId: 'blacksinyo',
              name: item.product.name,
              description: '',
              price: item.product.price,
              image: item.product.image_url,
              category: '',
            },
          }
        })
        setCartItems(items)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  const addToCart = (product: Product, merchant: Merchant, quantity: number) => {
    // optimistic update
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { product, merchant, quantity }]
    })

    apiFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: product.id, quantity }),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        cartItemIds.current.set(product.id, data.id)
      }
    }).catch(() => {})
  }

  const removeFromCart = (productId: string) => {
    const serverId = cartItemIds.current.get(productId)
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId))
    cartItemIds.current.delete(productId)
    if (serverId) {
      apiFetch(`/api/cart/${serverId}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCartItems((prev) =>
      prev.map((i) => i.product.id === productId ? { ...i, quantity } : i)
    )
    const serverId = cartItemIds.current.get(productId)
    if (serverId) {
      apiFetch(`/api/cart/${serverId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      }).catch(() => {})
    }
  }

  const clearCart = () => {
    setCartItems([])
    cartItemIds.current.clear()
  }

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  // 1 point per Rp 8,000
  const getCartPointsEstimate = () => Math.floor(getCartTotal() / 8000)

  return (
    <CartContext.Provider
      value={{ cartItems, isLoading, addToCart, removeFromCart, clearCart, updateQuantity, getCartTotal, getCartPointsEstimate }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error('useCart must be used within CartProvider')
  return context
}
