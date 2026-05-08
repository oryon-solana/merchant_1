'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '@/lib/mock-data'
import { Search, ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useCart } from '@/lib/contexts/CartContext'

const MERCHANT = MOCK_MERCHANTS[0]
const EASE = [0.25, 0.1, 0.25, 1] as const

export default function ShopPage() {
  const { isAuthenticated } = useAuth()
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const categories = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = !selectedCategory || p.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-white">

      {/* ── HEADER (collapses on scroll) ── */}
      <div className="border-b border-black/8 px-8 md:px-16 sticky top-20 z-40 bg-white">
        <motion.div
          animate={{
            paddingTop: scrolled ? 10 : 40,
            paddingBottom: scrolled ? 10 : 40,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className="max-w-350 mx-auto"
        >

          {/* Title block — slides up and fades when scrolled */}
          <motion.div
            animate={{
              height: scrolled ? 0 : 'auto',
              opacity: scrolled ? 0 : 1,
              marginBottom: scrolled ? 0 : 24,
            }}
            transition={{ duration: 0.38, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-black/40 text-[10px] uppercase tracking-widest mb-1">Whitesinyo Coffee</p>
                <h1 className="text-2xl font-black uppercase tracking-tight">Our Menu</h1>
              </div>
              <span className="text-[11px] text-black/40 uppercase tracking-widest pb-0.5">
                {filteredProducts.length} items
              </span>
            </div>
          </motion.div>

          {/* Search row — item count fades in inline when collapsed */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                placeholder="Search drinks, pastries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-black/12 bg-transparent text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <AnimatePresence>
              {scrolled && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="shrink-0 text-[11px] text-black/35 uppercase tracking-widest"
                >
                  {filteredProducts.length} items
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-1.5 text-[11px] uppercase tracking-widest transition-colors ${
                selectedCategory === null
                  ? 'bg-black text-white'
                  : 'border border-black/15 text-black/50 hover:border-black hover:text-black'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-1.5 text-[11px] uppercase tracking-widest transition-colors ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'border border-black/15 text-black/50 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <section className="py-12 px-8 md:px-16">
        <div className="max-w-350 mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-black/30 text-[11px] uppercase tracking-widest mb-3">No results</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(null) }}
                className="text-[11px] uppercase tracking-widest border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${searchTerm}-${selectedCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredProducts.map((product, idx) => {
                const cartItem = cartItems.find((i) => i.product.id === product.id)
                const qty = cartItem?.quantity ?? 0
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="group"
                  >
                    <div className="relative overflow-hidden bg-[#EFEEED] aspect-square mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                      />
                      {product.sold && product.sold > 2000 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 uppercase tracking-wider">
                          Popular
                        </div>
                      )}
                      <AnimatePresence>
                        {qty > 0 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="absolute top-2.5 right-2.5 bg-[#0099FF] text-white text-[11px] font-black w-6 h-6 flex items-center justify-center"
                          >
                            {qty}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <p className="text-[10px] uppercase tracking-widest text-black/35 mb-1">{product.category}</p>
                    <h3 className="text-sm font-semibold leading-tight mb-1">{product.name}</h3>

                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating!) ? 'fill-amber-400 text-amber-400' : 'text-black/15'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <span className="text-sm font-bold">Rp {product.price.toLocaleString('id-ID')}</span>

                    <div className="mt-3">
                      {isAuthenticated ? (
                        <AnimatePresence mode="wait">
                          {qty === 0 ? (
                            <motion.button
                              key="add"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => addToCart(product, MERCHANT, 1)}
                              className="w-full bg-black text-white py-2.5 text-[11px] uppercase tracking-widest hover:bg-[#0099FF] transition-colors flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Order
                            </motion.button>
                          ) : (
                            <motion.div
                              key="counter"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center border border-black"
                            >
                              <button
                                onClick={() => qty === 1 ? removeFromCart(product.id) : updateQuantity(product.id, qty - 1)}
                                className="flex-1 flex items-center justify-center py-2.5 hover:bg-black hover:text-white transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-bold tabular-nums">{qty}</span>
                              <button
                                onClick={() => updateQuantity(product.id, qty + 1)}
                                className="flex-1 flex items-center justify-center py-2.5 hover:bg-black hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ) : (
                        <a
                          href="/login"
                          className="w-full block text-center border border-black/20 text-black/50 py-2.5 text-[11px] uppercase tracking-widest hover:border-black hover:text-black transition-colors"
                        >
                          Sign in to Order
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
