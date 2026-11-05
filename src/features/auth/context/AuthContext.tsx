import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError } from '../../../lib/api/client'
import { authService } from '../services/auth.service'
import type { TokenPair } from '../types/auth.types'
import { userService } from '../../user/services/user.service'
import type { UserProfile } from '../../user/types/user.types'

interface AuthContextValue {
  accessToken: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  isInitializing: boolean
  signIn: (tokens: TokenPair) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<boolean>
}
const AuthContext = createContext<AuthContextValue | null>(null)
const ACCESS_KEY = 'vigo.accessToken'
const REFRESH_KEY = 'vigo.refreshToken'

function saveTokens(tokens: TokenPair) {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
}
function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) return false
    try {
      const response = await authService.refreshToken({ refreshToken })
      saveTokens(response.data)
      setAccessToken(response.data.accessToken)
      return true
    } catch {
      clearTokens()
      setAccessToken(null)
      setUser(null)
      return false
    }
  }, [])

  const loadProfile = useCallback(async (token: string) => {
    try {
      const profile = await userService.getMe(token)
      setUser(profile)
      return true
    } catch (error) {
      if (error instanceof ApiError && error.code === 'PROFILE_NOT_READY') {
        await new Promise((resolve) => window.setTimeout(resolve, 2000))
        try {
          const profile = await userService.getMe(token)
          setUser(profile)
          return true
        } catch {
          return false
        }
      }
      throw error
    }
  }, [])

  const signIn = useCallback(async (tokens: TokenPair) => {
    saveTokens(tokens)
    setAccessToken(tokens.accessToken)
    const loaded = await loadProfile(tokens.accessToken)
    if (!loaded) {
      clearTokens()
      setAccessToken(null)
      setUser(null)
      throw new Error('Your account profile is not ready yet. Please try again shortly.')
    }
  }, [loadProfile])

  const signOut = useCallback(async () => {
    const token = accessToken ?? localStorage.getItem(ACCESS_KEY)
    try {
      if (token) await authService.logout(token)
    } catch {
      // Local session is cleared even if the server cannot be reached.
    } finally {
      clearTokens()
      setAccessToken(null)
      setUser(null)
    }
  }, [accessToken]

  useEffect(() => {
    let active = true
    async function restore() {
      const storedAccess = localStorage.getItem(ACCESS_KEY)
      const storedRefresh = localStorage.getItem(REFRESH_KEY)
      if (!storedAccess || !storedRefresh) {
        if (active) setIsInitializing(false)
        return
      }
      try {
        let token = storedAccess
        try {
          await loadProfile(token)
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401) throw error
          const refreshed = await refreshSession()
          if (!refreshed) throw error
          token = localStorage.getItem(ACCESS_KEY) ?? ''
          await loadProfile(token)
        }
        if (active) setAccessToken(token)
      } catch {
        clearTokens()
        if (active) {
          setAccessToken(null)
          setUser(null)
        }
      } finally {
        if (active) setIsInitializing(false)
      }
    }
    void restore()
    return () => { active = false }
  }, [loadProfile, refreshSession])

  const value = useMemo(() => ({
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    isInitializing,
    signIn,
    signOut,
    refreshSession,
  }), [accessToken, user, isInitializing, signIn, signOut, refreshSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
