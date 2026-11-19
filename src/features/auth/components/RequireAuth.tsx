import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import type { UserRole } from '../../user/types/user.types'
import Spinner from '../../../shared/components/feedback/Spinner'

interface RequireAuthProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}
function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, isInitializing, user } = useAuth()
  const location = useLocation()
  if (isInitializing) {
    return <main className="flex min-h-screen items-center justify-center bg-canvas"><Spinner size="lg" className="text-[#718d43]" /></main>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  if (user?.status === 'SUSPENDED') return <Navigate to="/account-suspended" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
export default RequireAuth
