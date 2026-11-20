import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import RequireAuth from '../features/auth/components/RequireAuth'
import { useAuth } from '../features/auth/context/auth-context'
import { useTranslation } from 'react-i18next'
import Spinner from '../shared/components/feedback/Spinner'
import ProfilePreviewRoute from '../features/auth/components/ProfilePreviewRoute'
import PreviewWorkspaceRoute from '../features/auth/components/PreviewWorkspaceRoute'
import RouteLoadingFallback from '../shared/components/feedback/RouteLoadingFallback'

// Keep route screens in separate chunks and download each screen only when needed.
const CoachDashboardPage = lazy(() => import('../features/workouts/pages/CoachDashboardPage'))
const ExerciseLibraryPage = lazy(() => import('../features/workouts/pages/ExerciseLibraryPage'))
const WorkoutBuilderPage = lazy(() => import('../features/workouts/pages/WorkoutBuilderPage'))
const CoachWorkoutsPage = lazy(() => import('../features/workouts/pages/CoachWorkoutsPage'))
const AthleteDashboardPage = lazy(() => import('../features/athlete-workouts/pages/AthleteDashboardPage'))
const AthleteWorkoutsPage = lazy(() => import('../features/athlete-workouts/pages/AthleteWorkoutsPage'))
const WorkoutExecutionPage = lazy(() => import('../features/athlete-workouts/pages/WorkoutExecutionPage'))
const CoachDirectoryPage = lazy(() => import('../features/coaches/pages/CoachDirectoryPage'))
const CoachProfilePage = lazy(() => import('../features/coaches/pages/CoachProfilePage'))
const PlanMarketplacePage = lazy(() => import('../features/plans/pages/PlanMarketplacePage'))
const CoachApplicationPage = lazy(() => import('../features/coaches/pages/CoachApplicationPage'))
const PublicLandingPage = lazy(() => import('../features/landing/pages/PublicLandingPage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'))
const ProfilePage = lazy(() => import('../features/user/pages/ProfilePage'))
const FileManagementPage = lazy(() => import('../features/storage/pages/FileManagementPage'))
const AdminDashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'))

function PublicOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <main className="flex min-h-screen items-center justify-center bg-page"><Spinner size="lg" className="text-brand-hover" /></main>
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function RootRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <main className="flex min-h-screen items-center justify-center bg-page"><Spinner size="lg" className="text-brand-hover" /></main>
  return isAuthenticated ? <DashboardRedirect /> : <PublicLandingPage />
}

function AccountSuspendedPage() {
  const { t } = useTranslation()
  return (
    <main className="flex min-h-screen items-center justify-center bg-page p-6">
      <section className="w-full max-w-md rounded-2xl border border-border-default bg-surface p-8 text-center">
        <h1 className="text-xl font-semibold text-fg">{t('errors.suspended')}</h1>
        <p className="mt-3 text-sm leading-6 text-fg-secondary">{t('errors.suspendedDescription')}</p>
      </section>
    </main>
  )
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
  return user?.role === 'COACH'
    ? <Navigate to="/coach" replace />
    : <Navigate to="/athlete" replace />
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<RootRoute />} />
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
            <Route path="/_preview/admin" element={<PreviewWorkspaceRoute role="ADMIN" />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="profile" element={<ProfilePage isPreview />} />
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
        <Route path="/athlete/workouts" element={<RequireAuth allowedRoles={['ATHLETE']}><AthleteWorkoutsPage /></RequireAuth>} />
        <Route path="/athlete/workouts/:workoutId" element={<RequireAuth allowedRoles={['ATHLETE']}><WorkoutExecutionPage /></RequireAuth>} />
        <Route path="/athlete/files" element={<RequireAuth allowedRoles={["ATHLETE"]}><FileManagementPage /></RequireAuth>} />
        <Route path="/workouts" element={<Navigate to="/athlete/workouts" replace />} />
        <Route path="/workouts/:workoutId" element={<RequireAuth allowedRoles={['ATHLETE']}><WorkoutExecutionPage /></RequireAuth>} />
        <Route path="/plans" element={<PlanMarketplacePage />} />
        <Route path="/coaches" element={<CoachDirectoryPage />} />
        <Route path="/coaches/:coachId" element={<CoachProfilePage />} />
        <Route path="/coaches/apply" element={<CoachApplicationPage />} />
        <Route path="/admin" element={<RequireAuth allowedRoles={['ADMIN']}><AdminDashboardPage /></RequireAuth>} />
        <Route path="/coach" element={<RequireAuth allowedRoles={['COACH']}><CoachDashboardPage /></RequireAuth>} />
        <Route path="/coach/exercises" element={<RequireAuth allowedRoles={['COACH']}><ExerciseLibraryPage /></RequireAuth>} />
        <Route path="/coach/workouts" element={<RequireAuth allowedRoles={['COACH']}><CoachWorkoutsPage /></RequireAuth>} />
        <Route path="/coach/workouts/new" element={<RequireAuth allowedRoles={['COACH']}><WorkoutBuilderPage /></RequireAuth>} />
        <Route path="/coach/files" element={<RequireAuth allowedRoles={["COACH"]}><FileManagementPage /></RequireAuth>} />
        <Route path="/account-suspended" element={<AccountSuspendedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
