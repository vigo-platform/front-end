import type { UserRole } from '../../features/user/types/user.types'

export interface NavigationItem {
  label: string
  href: string
}

const athleteNavigationItems: NavigationItem[] = [
  { label: 'navigation.dashboard', href: '/athlete' },
  { label: 'navigation.myWorkouts', href: '/athlete/workouts' },
  { label: 'navigation.files', href: '/athlete/files' },
  { label: 'navigation.discoverCoaches', href: '/coaches' },
  { label: 'navigation.browsePlans', href: '/plans' },
  { label: 'navigation.myProfile', href: '/profile' },
]

const adminNavigationItems: NavigationItem[] = [
  { label: 'navigation.overview', href: '/admin' },
  { label: 'navigation.myProfile', href: '/profile' },
]

const previewAdminNavigationItems: NavigationItem[] = [
  { label: 'navigation.overview', href: '/_preview/admin' },
  { label: 'navigation.myProfile', href: '/_preview/admin/profile' },
]

const coachNavigationItems: NavigationItem[] = [
  { label: 'navigation.overview', href: '/coach' },
  { label: 'navigation.exerciseLibrary', href: '/coach/exercises' },
  { label: 'navigation.myWorkouts', href: '/coach/workouts' },
  { label: 'navigation.workoutBuilder', href: '/coach/workouts/new' },
  { label: 'navigation.files', href: '/coach/files' },
  { label: 'navigation.myProfile', href: '/profile' },
]

const previewAthleteNavigationItems: NavigationItem[] = [
  { label: 'navigation.dashboard', href: '/_preview/athlete' },
  { label: 'navigation.myWorkouts', href: '/_preview/athlete/workouts' },
  { label: 'navigation.findCoach', href: '/_preview/athlete/coaches' },
  { label: 'navigation.browsePlans', href: '/plans' },
  { label: 'navigation.myProfile', href: '/_preview/athlete/profile' },
]

const previewCoachNavigationItems: NavigationItem[] = [
  { label: 'navigation.overview', href: '/_preview/coach' },
  { label: 'navigation.exerciseLibrary', href: '/_preview/coach/exercises' },
  { label: 'navigation.myWorkouts', href: '/_preview/coach/workouts' },
  { label: 'navigation.workoutBuilder', href: '/_preview/coach/workouts/new' },
  { label: 'navigation.myProfile', href: '/_preview/coach/profile' },
]

export function getNavigationItems(role: UserRole | null | undefined, isPreview = false) {
  if (role === 'ADMIN') return isPreview ? previewAdminNavigationItems : adminNavigationItems
  if (role === 'COACH') return isPreview ? previewCoachNavigationItems : coachNavigationItems
  if (role === 'ATHLETE') return isPreview ? previewAthleteNavigationItems : athleteNavigationItems
  return []
}
