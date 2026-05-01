'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ArrowRight } from 'lucide-react'

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80',
    label: 'SPECIALTY COFFEE',
    title: 'PREMIUM\nCOFFEE',
    subtitle: 'Crafted with intention. Rewarded with every sip.',
    cta: 'ORDER NOW',
    ctaHref: '/shop',
    showJoin: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80',
    label: 'LOYALTY REWARDS',
    title: 'EVERY SIP\nEARNS',
    subtitle: '1 poin for every Rp 10 you spend — automatically.',
    cta: 'JOIN FREE',
    ctaHref: '/register',
    showJoin: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1920&q=80',
    label: 'OUR CRAFT',
    title: 'CRAFTED\nWITH SOUL',
    subtitle: 'Single origin beans. Expert baristas. Zero shortcuts.',
    cta: 'EXPLORE MENU',
    ctaHref: '/shop',
    showJoin: false,
  },
]

const TICKER_ITEMS = [
  'ESPRESSO', '·', 'CAPPUCCINO', '·', 'COLD BREW', '·', 'MATCHA LATTE', '·',
  'CARAMEL MACCHIATO', '·', 'CHEESECAKE', '·', 'TIRAMISU', '·',
  '1 POIN PER Rp10', '·', 'LOYALTY REWARDS', '·', 'SPECIALTY COFFEE', '·',
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'ORDER',
    desc: 'Buy your favorite coffee and pastries from our menu — in-store or online.',
  },
  {
    step: '02',
    title: 'EARN',
    desc: 'Collect 1 poin for every Rp 10 spent. Points accumulate automatically.',
  },
  {
    step: '03',
    title: 'REDEEM',
    desc: 'Exchange your points for free drinks, pastry upgrades, and exclusive rewards.',
  },
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [heroIndex, setHeroIndex] = useState(0)

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ── HERO ── */}
      <section className="-mt-20 h-screen relative overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.img
              src={HERO_SLIDES[heroIndex].image}
              alt={HERO_SLIDES[heroIndex].label}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: 'easeOut' }}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${heroIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.55 }}
            >
              <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-3">
                {HERO_SLIDES[heroIndex].label}
              </p>
              <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tight mb-4 whitespace-pre-line">
                {HERO_SLIDES[heroIndex].title}
              </h1>
              <p className="text-white/60 text-sm max-w-md mb-8 leading-relaxed">
                {HERO_SLIDES[heroIndex].subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={HERO_SLIDES[heroIndex].ctaHref}
                  className="bg-[#0099FF] text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-[#0088EE] transition-colors flex items-center gap-2"
                >
                  {HERO_SLIDES[heroIndex].cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {!isAuthenticated && HERO_SLIDES[heroIndex].showJoin && (
                  <Link
                    href="/register"
                    className="border border-white/40 text-white px-8 py-3.5 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Join Free
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-8 md:right-16 flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="relative h-px w-10 bg-white/25 overflow-hidden"
              >
                {i === heroIndex && (
                  <motion.div
                    key={`prog-${heroIndex}`}
                    className="absolute inset-0 bg-white origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="absolute bottom-10 left-8 md:left-16 text-white/35 text-[10px] tracking-widest tabular-nums">
            {String(heroIndex + 1).padStart(2, '0')} / {String(HERO_SLIDES.length).padStart(2, '0')}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <div className="w-px h-10 bg-white/30" />
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div className="bg-[#0099FF] py-3 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="text-white text-[11px] uppercase tracking-[0.2em] mx-6 shrink-0"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURED MENU ── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Our Menu</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">House Favorites</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest border-b border-black pb-0.5 hover:border-[#0099FF] hover:text-[#0099FF] transition-colors"
            >
              Full Menu <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product, idx) => {
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="group"
                >
                  <Link href="/shop" className="block">
                    <div className="relative overflow-hidden bg-[#EFEEED] aspect-square mb-3">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300" />

                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">{product.category}</p>
                    <p className="text-sm font-semibold leading-tight mb-1">{product.name}</p>
                    <p className="text-sm text-black/60">Rp {product.price.toLocaleString('id-ID')}</p>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 md:hidden"
          >
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest border border-black py-3 hover:bg-black hover:text-white transition-colors"
            >
              Full Menu <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-8 md:px-16 bg-[#EFEEED]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-black/40 text-[10px] uppercase tracking-widest mb-2">Loyalty Program</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">How Points Work</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="bg-[#EFEEED] p-10"
              >
                <p className="text-6xl font-black text-black/8 mb-6 leading-none">{item.step}</p>
                <h3 className="text-xl font-black uppercase tracking-widest mb-4">{item.title}</h3>
                <p className="text-sm text-black/55 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-black py-20 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { value: '50K+', label: 'Cups Served' },
            { value: '8K+', label: 'Members' },
            { value: '2M+', label: 'Points Earned' },
            { value: '100%', label: 'Specialty Grade' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-white text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-white/35 text-[10px] uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden bg-[#0099FF] py-32 px-8 md:px-16">
          <motion.div
            className="max-w-[1400px] mx-auto relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-4">Join the Club</p>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white leading-none tracking-tight mb-10 max-w-3xl">
              Start Earning Points Today
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Join Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[18vw] font-black text-white/10 uppercase leading-none pointer-events-none select-none">
            POIN
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-black text-white py-16 px-8 md:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest mb-5">Whitesinyo</h3>
              <p className="text-white/35 text-xs leading-relaxed max-w-xs">
                Specialty coffee experience with a minimalist soul. Every cup crafted with intention.
              </p>
            </div>
            {[
              {
                heading: 'Menu',
                links: [
                  { label: 'All Menu', href: '/shop' },
                  { label: 'Espresso', href: '/shop' },
                  { label: 'Specialty', href: '/shop' },
                  { label: 'Pastry', href: '/shop' },
                ],
              },
              {
                heading: 'Account',
                links: [
                  { label: 'Login', href: '/login' },
                  { label: 'Register', href: '/register' },
                  { label: 'My Points', href: '/points-history' },
                  { label: 'Profile', href: '/account' },
                ],
              },
              {
                heading: 'Info',
                links: [
                  { label: 'About', href: '/' },
                  { label: 'Terms', href: '/' },
                  { label: 'Privacy', href: '/' },
                  { label: 'Contact', href: '/' },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="text-[10px] uppercase tracking-widest text-white/35 mb-5">{col.heading}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-xs text-white/55 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-white/10">
            <p className="text-white/25 text-[10px] uppercase tracking-widest">
              © {new Date().getFullYear()} Whitesinyo Coffee. All rights reserved.
            </p>
            <p className="text-white/25 text-[10px] uppercase tracking-widest mt-4 md:mt-0">
              Jakarta · IDR
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
