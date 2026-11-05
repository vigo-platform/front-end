export type WorkoutStatus = 'ASSIGNED' | 'COMPLETED'

export interface PrescribedExercise {
  exercise_id: string
  name: string
  muscle_group: string
  equipment: string
  sets: number
  reps: number
  rest_seconds: number
}

export interface AssignedWorkout {
  id: string
  title: string
  description: string
  coach_name: string
  assigned_at: string
  estimated_duration_minutes: number
  exercises: PrescribedExercise[]
}

export interface ExerciseSetResult {
  exercise_id: string
  set_number: number
  actual_reps: number
  weight_kg: number | null
}

export interface WorkoutExecutionResult {
  workout_id: string
  completed_at: string
  sets: ExerciseSetResult[]
}
