import { lazy, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../context/auth-context'
import type { AuthContextValue } from '../context/auth-context'
import type { UserRole, UserProfile } from '../../user/types/user.types'
import { previewAthlete, previewCoach, previewCoachProfile } from '../data/dashboard-preview'

const ProfilePage = lazy(() => import('../../user/pages/ProfilePage'))

interface ProfilePreviewRouteProps {
  role: Extract<UserRole, 'ATHLETE' | 'COACH'>
}

function ProfilePreviewRoute({ role }: ProfilePreviewRouteProps) {
  const { t } = useTranslation()
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
      <div className="fixed bottom-4 end-4 z-[100] rounded-full border border-success-border bg-success-surface px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1px] text-success-fg shadow-sm">
        {t('ui.Preview data · Not connected to API')}
      </div>
      <ProfilePage isPreview previewCoachProfile={role === 'COACH' ? previewCoachProfile : undefined} />
    </AuthContext.Provider>
  )
}

export default ProfilePreviewRoute
