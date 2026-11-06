import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { AuthContextValue } from '../context/auth-context'
import { AuthContext } from '../context/auth-context'
import type { UserProfile, UserRole } from '../../user/types/user.types'
import { previewAthlete, previewCoach } from '../data/dashboard-preview'

interface PreviewWorkspaceRouteProps {
  role: Extract<UserRole, 'ATHLETE' | 'COACH'>
}

function PreviewWorkspaceRoute({ role }: PreviewWorkspaceRouteProps) {
  const initialUser = role === 'COACH' ? previewCoach : previewAthlete
  const [user, setUser] = useState<UserProfile>(initialUser)

  const previewAuth: AuthContextValue = {
    accessToken: 'preview-token',
    user,
    isAuthenticated: true,
    isInitializing: false,
    signIn: async () => undefined,
    signOut: async () => undefined,
    refreshSession: async () => true,
    updateUser: setUser,
    isPreview: true,
  }

  return (
    <AuthContext.Provider value={previewAuth}>
      <div className="fixed bottom-4 right-4 z-[100] rounded-full border border-[#dce8c8] bg-[#f2f8e8] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1px] text-[#526a2e] shadow-sm">
        Preview data · Not connected to API
      </div>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default PreviewWorkspaceRoute
