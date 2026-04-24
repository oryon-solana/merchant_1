'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Transaction, PointsBalance } from '../types'
import { apiFetch } from '../api-client'
import { useAuth } from './AuthContext'

interface PointsContextType {
  points: PointsBalance | null
  isLoading: boolean
  refreshPoints: () => Promise<void>
  getTransactions: () => Transaction[]
  getTotalPoints: () => number
}

const PointsContext = createContext<PointsContextType | undefined>(undefined)

export function PointsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [points, setPoints] = useState<PointsBalance | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshPoints = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await apiFetch('/api/points')
      if (!res.ok) return
      const data: {
        total_points: number
        history: { id: string; points: number; type: string; note: string; created_at: string; order_id: string }[]
      } = await res.json()

      const transactions: Transaction[] = data.history.map((tx) => ({
        id: tx.id,
        userId: user.id,
        merchantId: 'blacksinyo',
        merchantName: 'Blacksinyo Coffee',
        amount: 0,
        pointsEarned: tx.points,
        timestamp: new Date(tx.created_at),
        items: [],
      }))

      setPoints({
        totalPoints: data.total_points,
        availablePoints: data.total_points,
        redeemedPoints: 0,
        transactions,
      })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      refreshPoints()
    } else {
      setPoints(null)
    }
  }, [user, refreshPoints])

  return (
    <PointsContext.Provider
      value={{
        points,
        isLoading,
        refreshPoints,
        getTransactions: () => points?.transactions ?? [],
        getTotalPoints: () => points?.totalPoints ?? 0,
      }}
    >
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (context === undefined) throw new Error('usePoints must be used within PointsProvider')
  return context
}
