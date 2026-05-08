'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { usePoints } from '@/lib/contexts/PointsContext'
import { AnimatePresence, motion } from 'framer-motion'

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth()
  const { isLoading: pointsLoading } = usePoints()

  const isLoading = authLoading || pointsLoading

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-8"
            >
              <span className="text-sm font-black uppercase tracking-widest text-black">Whitesinyo</span>

              {/* Animated bar */}
              <div className="w-32 h-px bg-black/10 overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-black"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity }}
                  style={{ width: '50%' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
      >
        {children}
      </motion.div>
    </>
  )
}
