import { assignedWorkoutsMock } from '../data/assigned-workouts.mock'
import type {
  AssignedWorkout,
  WorkoutExecutionResult,
  WorkoutStatus,
} from '../types/athlete-workout.types'

const RESULTS_STORAGE_KEY = 'vigo.athlete.workoutResults'
const EXECUTION_DRAFT_PREFIX = 'vigo.athlete.executionDraft.'
export type WorkoutExecutionDraft = Record<
  string,
  { actual_reps: string; weight_kg: string }
>

export function loadExecutionDraft(workoutId: string): WorkoutExecutionDraft {
  try {
    const stored = localStorage.getItem(`${EXECUTION_DRAFT_PREFIX}${workoutId}`)
    if (!stored) return {}
    const parsed = JSON.parse(stored) as unknown
    return parsed && typeof parsed === 'object'
      ? (parsed as WorkoutExecutionDraft)
      : {}
  } catch {
    return {}
  }
}

export function saveExecutionDraft(
  workoutId: string,
  draft: WorkoutExecutionDraft,
) {
  localStorage.setItem(
    `${EXECUTION_DRAFT_PREFIX}${workoutId}`,
    JSON.stringify(draft),
  )
}

export function clearExecutionDraft(workoutId: string) {
  localStorage.removeItem(`${EXECUTION_DRAFT_PREFIX}${workoutId}`)
}

function readResults(): WorkoutExecutionResult[] {
  try {
    const stored = localStorage.getItem(RESULTS_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? (parsed as WorkoutExecutionResult[]) : []
  } catch {
    return []
  }
}

function writeResults(results: WorkoutExecutionResult[]) {
  localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results))
}

export interface AssignedWorkoutSummary extends AssignedWorkout {
  status: WorkoutStatus
  completed_at: string | null
}

export async function getAssignedWorkouts(): Promise<AssignedWorkoutSummary[]> {
  const results = readResults()

  return assignedWorkoutsMock.map((workout) => {
    const result = results.find((item) => item.workout_id === workout.id)
    return {
      ...workout,
      status: result ? 'COMPLETED' : 'ASSIGNED',
      completed_at: result?.completed_at ?? null,
    }
  })
}

export function getAssignedWorkout(workoutId: string): AssignedWorkout | null {
  return assignedWorkoutsMock.find((workout) => workout.id === workoutId) ?? null
}

export function getWorkoutExecutionResult(
  workoutId: string,
): WorkoutExecutionResult | null {
  return readResults().find((item) => item.workout_id === workoutId) ?? null
}

export function submitWorkoutResult(
  result: WorkoutExecutionResult,
): WorkoutExecutionResult {
  const results = readResults()
  if (results.some((item) => item.workout_id === result.workout_id)) {
    throw new Error('This workout has already been submitted.')
  }

  const nextResults = [...results, result]
  writeResults(nextResults)
  return result
}
