import type { WorkoutDraft, WorkoutExercise } from '../types/workout.types'

const DRAFT_STORAGE_KEY = 'vigo.coach.workoutDraft'

export function createEmptyWorkoutDraft(): WorkoutDraft {
  return {
    title: '',
    description: '',
    exercises: [],
    updated_at: null,
  }
}

export function loadWorkoutDraft(): WorkoutDraft {
  try {
    const storedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!storedDraft) return createEmptyWorkoutDraft()

    const parsed = JSON.parse(storedDraft) as Partial<WorkoutDraft>
    if (!Array.isArray(parsed.exercises)) return createEmptyWorkoutDraft()

    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      description:
        typeof parsed.description === 'string' ? parsed.description : '',
      exercises: parsed.exercises as WorkoutExercise[],
      updated_at:
        typeof parsed.updated_at === 'string' ? parsed.updated_at : null,
    }
  } catch {
    return createEmptyWorkoutDraft()
  }
}

export function saveWorkoutDraft(draft: WorkoutDraft): WorkoutDraft {
  const savedDraft: WorkoutDraft = {
    ...draft,
    updated_at: new Date().toISOString(),
  }

  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(savedDraft))
  return savedDraft
}
