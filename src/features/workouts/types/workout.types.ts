export type ExerciseCategory = 'STRENGTH' | 'CARDIO' | 'MOBILITY' | 'CORE'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  muscle_group: string
  equipment: string
  description: string
}

export interface WorkoutExercise {
  exercise_id: string
  sets: number
  reps: number
  rest_seconds: number
}

export interface WorkoutDraft {
  title: string
  description: string
  exercises: WorkoutExercise[]
  updated_at: string | null
}
