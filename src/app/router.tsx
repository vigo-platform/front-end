import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import CoachDashboardPage from '../features/workouts/pages/CoachDashboardPage'
import ExerciseLibraryPage from '../features/workouts/pages/ExerciseLibraryPage'
import WorkoutBuilderPage from '../features/workouts/pages/WorkoutBuilderPage'
import CoachWorkoutsPage from '../features/workouts/pages/CoachWorkoutsPage'
import AthleteDashboardPage from '../features/athlete-workouts/pages/AthleteDashboardPage'
import AthleteWorkoutsPage from '../features/athlete-workouts/pages/AthleteWorkoutsPage'
import WorkoutExecutionPage from '../features/athlete-workouts/pages/WorkoutExecutionPage'
import CoachDirectoryPage from '../features/coaches/pages/CoachDirectoryPage'
import CoachProfilePage from '../features/coaches/pages/CoachProfilePage'
import PublicLandingPage from '../features/landing/pages/PublicLandingPage'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import RequireAuth from '../features/auth/components/RequireAuth'
import { useAuth } from '../features/auth/context/auth-context'
import ProfilePreviewRoute from '../features/auth/components/ProfilePreviewRoute'
import PreviewWorkspaceRoute from '../features/auth/components/PreviewWorkspaceRoute'
import ProfilePage from '../features/user/pages/ProfilePage'

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

function DashboardRedirect() {
  const { user } = useAuth()
  return user?.role === 'COACH'
    ? <Navigate to="/coach" replace />
    : <Navigate to="/athlete" replace />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicLandingPage />} />
      {import.meta.env.DEV && (
        <>
          <Route path="/_preview/athlete" element={<PreviewWorkspaceRoute role="ATHLETE" />}>
            <Route index element={<AthleteDashboardPage isPreview />} />
            <Route path="profile" element={<ProfilePage isPreview />} />
            <Route path="workouts" element={<AthleteWorkoutsPage />} />
            <Route path="workouts/:workoutId" element={<WorkoutExecutionPage />} />
            <Route path="coaches" element={<CoachDirectoryPage />} />
            <Route path="coaches/:coachId" element={<CoachProfilePage />} />
          </Route>
          <Route path="/_preview/coach" element={<PreviewWorkspaceRoute role="COACH" />}>
            <Route index element={<CoachDashboardPage isPreview />} />
            <Route path="profile" element={<ProfilePage isPreview />} />
            <Route path="exercises" element={<ExerciseLibraryPage />} />
            <Route path="workouts" element={<CoachWorkoutsPage />} />
            <Route path="workouts/new" element={<WorkoutBuilderPage />} />
          </Route>
          <Route path="/_preview/profile/athlete" element={<ProfilePreviewRoute role="ATHLETE" />} />
          <Route path="/_preview/profile/coach" element={<ProfilePreviewRoute role="COACH" />} />
        </>
      )}
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardRedirect /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/athlete" element={<RequireAuth allowedRoles={['ATHLETE']}><AthleteDashboardPage /></RequireAuth>} />
      <Route path="/workouts" element={<Navigate to="/athlete#workouts" replace />} />
      <Route path="/workouts/:workoutId" element={<RequireAuth allowedRoles={['ATHLETE']}><WorkoutExecutionPage /></RequireAuth>} />
      <Route path="/coaches" element={<CoachDirectoryPage />} />
      <Route path="/coaches/:coachId" element={<CoachProfilePage />} />
      <Route path="/coach" element={<RequireAuth allowedRoles={['COACH']}><CoachDashboardPage /></RequireAuth>} />
      <Route path="/coach/exercises" element={<RequireAuth allowedRoles={['COACH']}><ExerciseLibraryPage /></RequireAuth>} />
      <Route path="/coach/workouts" element={<RequireAuth allowedRoles={['COACH']}><CoachWorkoutsPage /></RequireAuth>} />
      <Route path="/coach/workouts/new" element={<RequireAuth allowedRoles={['COACH']}><WorkoutBuilderPage /></RequireAuth>} />
      <Route path="/account-suspended" element={<AccountSuspendedPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default AppRouter
