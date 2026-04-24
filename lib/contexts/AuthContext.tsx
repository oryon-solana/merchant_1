'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'
import { apiFetch, storeTokens, clearTokens } from '../api-client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, phone: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setIsLoading(false)
      return
    }
    apiFetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUser({ id: data.id, name: data.name ?? '', email: data.email, phone: '' })
        } else {
          clearTokens()
        }
      })
      .catch(() => clearTokens())
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Login failed')

    storeTokens(data.access_token, data.refresh_token)
    setUser({ id: data.user.id, name: data.user.name ?? '', email: data.user.email, phone: '' })
  }

  const register = async (name: string, email: string, _phone: string, password: string) => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Registration failed')

    // auto-login after register
    await login(email, password)
  }

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    clearTokens()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider')
  return context
}
