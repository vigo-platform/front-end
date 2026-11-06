import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import {
  clearExecutionDraft,
  getAssignedWorkout,
  getWorkoutExecutionResult,
  loadExecutionDraft,
  saveExecutionDraft,
  submitWorkoutResult,
} from '../services/athlete-workout.service'
import WorkoutExerciseCard, {
  type WorkoutSetInput,
} from '../components/WorkoutExerciseCard'
import type { ExerciseSetResult } from '../types/athlete-workout.types'

function WorkoutExecutionPage() {
  const { workoutId = '' } = useParams()
  const navigate = useNavigate()
  const { isPreview } = useAuth()
  const workoutsPath = isPreview ? '/_preview/athlete/workouts' : '/workouts'
  const workout = useMemo(() => getAssignedWorkout(workoutId), [workoutId])
  const existingResult = useMemo(
    () => getWorkoutExecutionResult(workoutId),
    [workoutId],
  )
  const [inputs, setInputs] = useState<Record<string, WorkoutSetInput>>(() => {
    if (!workout) return {}
    const savedDraft = loadExecutionDraft(workoutId)
    const emptyInputs = Object.fromEntries(
      workout.exercises.flatMap((exercise) =>
        Array.from({ length: exercise.sets }, (_, index) => [
          `${exercise.exercise_id}-${index + 1}`,
          { actual_reps: '', weight_kg: '' },
        ]),
      ),
    )
    return { ...emptyInputs, ...savedDraft }
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!workout) {
    return (
      <AppShell title="Workout not found">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8">
          <h2 className="text-xl font-semibold">Workout not found</h2>
          <p className="mt-2 text-sm text-muted">
            This workout is not available in the current demo data.
          </p>
          <Link to={workoutsPath} className="mt-5 inline-flex text-sm font-semibold">
            ← Back to workouts
          </Link>
        </div>
      </AppShell>
    )
  }

  const currentWorkout = workout

  if (existingResult) {
    return (
      <AppShell title="Workout completed">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#dce8c9] bg-white p-8">
          <span className="text-sm font-semibold text-[#607b38]">Submitted</span>
          <h2 className="mt-3 text-2xl font-semibold">Workout already completed</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Your results were saved on{' '}
            {new Date(existingResult.completed_at).toLocaleString()}.
          </p>
          <Link
            to={workoutsPath}
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Back to my workouts
          </Link>
        </div>
      </AppShell>
    )
  }

  function updateInput(key: string, field: keyof WorkoutSetInput, value: string) {
    const updated = {
      ...inputs,
      [key]: { ...inputs[key], [field]: value },
    }
    setInputs(updated)
    saveExecutionDraft(workoutId, updated)
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const results: ExerciseSetResult[] = []

    for (const exercise of currentWorkout.exercises) {
      for (let setNumber = 1; setNumber <= exercise.sets; setNumber += 1) {
        const key = `${exercise.exercise_id}-${setNumber}`
        const input = inputs[key]
        const reps = Number(input?.actual_reps)
        const weightText = input?.weight_kg.trim() ?? ''
        const weight = weightText === '' ? null : Number(weightText)

        if (
          !input ||
          input.actual_reps.trim() === '' ||
          !Number.isInteger(reps) ||
          reps < 0 ||
          reps > 100
        ) {
          setError(`Enter valid completed repetitions (0–100) for ${exercise.name}, set ${setNumber}.`)
          return
        }

        if (
          weight !== null &&
          (!Number.isFinite(weight) || weight < 0 || weight > 1000)
        ) {
          setError(`Enter a valid weight (0–1000 kg) for ${exercise.name}, set ${setNumber}.`)
          return
        }

        results.push({
          exercise_id: exercise.exercise_id,
          set_number: setNumber,
          actual_reps: reps,
          weight_kg: weight,
        })
      }
    }

    setIsSubmitting(true)
    try {
      submitWorkoutResult({
        workout_id: currentWorkout.id,
        completed_at: new Date().toISOString(),
        sets: results,
      })
      clearExecutionDraft(currentWorkout.id)
      navigate(workoutsPath, { replace: true })
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not submit your workout. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell title="Workout execution">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <section>
          <Link to={workoutsPath} className="text-sm font-medium text-muted hover:text-ink">
            ← My workouts
          </Link>
          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Workout session
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              {workout.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {workout.description}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted">Exercises</p>
            <p className="mt-1 text-xl font-semibold">{workout.exercises.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted">Duration</p>
            <p className="mt-1 text-xl font-semibold">
              {workout.estimated_duration_minutes} min
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted">Coach</p>
            <p className="mt-1 truncate text-sm font-semibold">{workout.coach_name}</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          {workout.exercises.map((exercise, exerciseIndex) => (
            <WorkoutExerciseCard
              key={exercise.exercise_id}
              exercise={exercise}
              exerciseIndex={exerciseIndex}
              inputs={inputs}
              onInputChange={updateInput}
            />
          ))}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-[#ead1cd] bg-[#fff8f6] px-4 py-3 text-sm text-[#9b5147]"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/workouts"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-full bg-ink px-7 text-sm font-semibold text-white transition hover:bg-[#30352a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting…' : 'Submit workout'}
            </button>
          </div>
        </form>

        <p className="rounded-xl border border-[#e5e8dc] bg-[#f0f5e8] p-4 text-xs leading-5 text-[#5d6651]">
          This is a frontend demo flow. Your results are stored in this browser
          only; backend submission is not available in the current API contracts.
        </p>
      </div>
    </AppShell>
  )
}

export default WorkoutExecutionPage
