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

const coachNavigationItems: NavigationItem[] = [
  { label: 'Overview', href: '/coach' },
  { label: 'Exercise Library', href: '/coach/exercises' },
  { label: 'My Workouts', href: '/coach/workouts' },
  { label: 'Workout Builder', href: '/coach/workouts/new' },
  { label: 'My Profile', href: '/profile' },
]

export function getNavigationItems(role: UserRole | null | undefined) {
  if (role === 'COACH') return coachNavigationItems
  if (role === 'ATHLETE') return athleteNavigationItems
  return []
}
