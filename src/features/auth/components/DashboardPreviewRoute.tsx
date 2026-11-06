import type { ReactNode } from 'react'
import { AuthContext } from '../context/auth-context'
import type { AuthContextValue } from '../context/auth-context'
import type { UserRole } from '../../user/types/user.types'
import { previewAthlete, previewCoach } from '../data/dashboard-preview'
import AthleteDashboardPage from '../../athlete-workouts/pages/AthleteDashboardPage'
import CoachDashboardPage from '../../workouts/pages/CoachDashboardPage'

interface DashboardPreviewRouteProps {
  role: Extract<UserRole, 'ATHLETE' | 'COACH'>
}

function DashboardPreviewRoute({ role }: DashboardPreviewRouteProps) {
  const user = role === 'COACH' ? previewCoach : previewAthlete
  const previewAuth: AuthContextValue = {
    accessToken: 'preview-token',
    user,
    isAuthenticated: true,
    isInitializing: false,
    signIn: async () => undefined,
    signOut: async () => undefined,
    refreshSession: async () => true,
  }
  const dashboard: ReactNode =
    role === 'COACH'
      ? <CoachDashboardPage isPreview />
      : <AthleteDashboardPage isPreview />

  return (
    <AuthContext.Provider value={previewAuth}>
      <div className="fixed bottom-4 right-4 z-[100] rounded-full border border-[#dce8c8] bg-[#f2f8e8] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1px] text-[#526a2e] shadow-sm">
        Preview data · Not connected to API
      </div>
      {dashboard}
    </AuthContext.Provider>
  )
}

export default DashboardPreviewRoute
