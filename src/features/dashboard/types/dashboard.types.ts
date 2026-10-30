import type {
  CoachProfile,
  Plan,
  Relation,
  UserProfile,
} from './api.types'

// Frontend view model.
// This is not an API response schema.

export interface WorkoutPreview {
  id: string
  title: string
  category: string
  duration_minutes: number
  exercise_count: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  scheduled_label: string
}

export interface DashboardStats {
  completed_workouts: number
  training_hours: number
  current_streak_days: number
}

export interface AthleteDashboardData {
  user: UserProfile
  coach: CoachProfile
  relation: Relation
  plan: Plan
  stats: DashboardStats
  next_workout: WorkoutPreview
  assigned_workouts: WorkoutPreview[]
}
