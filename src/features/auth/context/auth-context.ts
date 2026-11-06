import { createContext, useContext } from 'react'
import type { TokenPair } from '../types/auth.types'
import type { UserProfile } from '../../user/types/user.types'

export interface AuthContextValue {
  accessToken: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  isInitializing: boolean
  signIn: (tokens: TokenPair) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
