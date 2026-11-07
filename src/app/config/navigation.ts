import type { UserRole } from '../../features/user/types/user.types'

export interface NavigationItem {
  label: string
  href: string
}

const athleteNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/athlete' },
  { label: 'My Workouts', href: '/athlete#workouts' },
  { label: 'Discover Coaches', href: '/coaches' },
  { label: 'My Profile', href: '/profile' },
]

const adminNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/admin' },
]

const previewAdminNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/_preview/admin' },
]

const coachNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/coach' },
  { label: 'Exercise Library', href: '/coach/exercises' },
  { label: 'My Workouts', href: '/coach/workouts' },
  { label: 'Workout Builder', href: '/coach/workouts/new' },
  { label: 'My Profile', href: '/profile' },
]

const previewAthleteNavigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/_preview/athlete' },
  { label: 'My Workouts', href: '/_preview/athlete/workouts' },
  { label: 'Find a Coach', href: '/_preview/athlete/coaches' },
  { label: 'My Profile', href: '/_preview/athlete/profile' },
]

const previewCoachNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/_preview/coach' },
  { label: 'Exercise Library', href: '/_preview/coach/exercises' },
  { label: 'My Workouts', href: '/_preview/coach/workouts' },
  { label: 'Workout Builder', href: '/_preview/coach/workouts/new' },
  { label: 'My Profile', href: '/_preview/coach/profile' },
]

export function getNavigationItems(role: UserRole | null | undefined, isPreview = false) {
  if (role === 'ADMIN') return isPreview ? previewAdminNavigationItems : adminNavigationItems
  if (role === 'COACH') return isPreview ? previewCoachNavigationItems : coachNavigationItems
  if (role === 'ATHLETE') return isPreview ? previewAthleteNavigationItems : athleteNavigationItems
  return []
}
