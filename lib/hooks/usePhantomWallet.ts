'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api-client'

interface PhantomProvider {
  isPhantom: boolean
  publicKey: { toString(): string } | null
  isConnected: boolean
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
}

declare global {
  interface Window {
    phantom?: { solana?: PhantomProvider }
    solana?: PhantomProvider
  }
}

function getProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null
  return window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null) ?? null
}

export function usePhantomWallet(savedAddress?: string | null, onSaved?: () => void) {
  const [walletAddress, setWalletAddress] = useState<string | null>(savedAddress ?? null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isPhantomInstalled = typeof window !== 'undefined' && !!getProvider()

  useEffect(() => {
    setWalletAddress(savedAddress ?? null)
  }, [savedAddress])

  const saveToServer = useCallback(async (address: string | null) => {
    await apiFetch('/api/account/wallet', {
      method: 'PUT',
      body: JSON.stringify({ wallet_address: address }),
    })
    onSaved?.()
  }, [onSaved])

  const connect = useCallback(async () => {
    const provider = getProvider()
    if (!provider) {
      setError('Phantom wallet not found. Install it at phantom.app')
      return
    }
    setError(null)
    setIsConnecting(true)
    try {
      const { publicKey } = await provider.connect()
      const address = publicKey.toString()
      setWalletAddress(address)
      await saveToServer(address)
    } catch {
      setError('Connection cancelled')
    } finally {
      setIsConnecting(false)
    }
  }, [saveToServer])

  const disconnect = useCallback(async () => {
    const provider = getProvider()
    if (provider) await provider.disconnect()
    setWalletAddress(null)
    await saveToServer(null)
  }, [saveToServer])

  return { walletAddress, isConnecting, isPhantomInstalled, error, connect, disconnect }
}
