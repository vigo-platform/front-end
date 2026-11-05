import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import RequireAuth from '../features/auth/components/RequireAuth'
import { useAuth } from '../features/auth/context/AuthContext'

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading...</div>
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function AccountSuspendedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-ink">Account suspended</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Your account is currently suspended. Please contact support for assistance.</p>
      </section>
    </main>
  )
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/account-suspended" element={<AccountSuspendedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default AppRouter
