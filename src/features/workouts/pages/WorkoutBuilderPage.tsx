import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../components/layout/AppShell'
import { exerciseLibrary } from '../data/exercises'
import { loadWorkoutDraft, saveWorkoutDraft } from '../services/workout-draft.service'
import type { WorkoutDraft } from '../types/workout.types'

function WorkoutBuilderPage() {
  const [draft, setDraft] = useState<WorkoutDraft>(() => loadWorkoutDraft())
  const [saveMessage, setSaveMessage] = useState('')

  const selectedExercises = draft.exercises.map((item) => ({
    ...item,
    exercise: exerciseLibrary.find(
      (exercise) => exercise.id === item.exercise_id,
    ),
  }))

  function updateDraft(patch: Partial<WorkoutDraft>) {
    setDraft((current) => ({ ...current, ...patch }))
    setSaveMessage('')
  }

  function updateExercise(
    exerciseId: string,
    field: 'sets' | 'reps' | 'rest_seconds',
    value: number,
  ) {
    updateDraft({
      exercises: draft.exercises.map((item) =>
        item.exercise_id === exerciseId ? { ...item, [field]: value } : item,
      ),
    })
  }

  function removeExercise(exerciseId: string) {
    updateDraft({
      exercises: draft.exercises.filter(
        (item) => item.exercise_id !== exerciseId,
      ),
    })
  }

  function handleSave() {
    if (!draft.title.trim()) {
      setSaveMessage('Add a workout title before saving.')
      return
    }
    if (draft.exercises.length === 0) {
      setSaveMessage('Add at least one exercise before saving.')
      return
    }
    const hasInvalidParameters = draft.exercises.some(
      ({ sets, reps, rest_seconds }) =>
        !Number.isInteger(sets) ||
        sets < 1 ||
        sets > 20 ||
        !Number.isInteger(reps) ||
        reps < 1 ||
        reps > 100 ||
        !Number.isInteger(rest_seconds) ||
        rest_seconds < 0 ||
        rest_seconds > 600,
    )
    if (hasInvalidParameters) {
      setSaveMessage('Check exercise parameters: sets (1–20), reps (1–100), rest (0–600 seconds).')
      return
    }

    const savedDraft = saveWorkoutDraft(draft)
    setDraft(savedDraft)
    setSaveMessage('Draft saved in this browser.')
  }

  return (
    <AppShell title="Workout builder">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <Link to="/coach" className="text-sm font-medium text-muted hover:text-ink">
            ← Coach workspace
          </Link>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Workout builder
              </h2>
              <p className="mt-2 text-sm text-muted">
                Organize exercises and set the training parameters.
              </p>
            </div>
            <Link
              to="/coach/exercises"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white px-5 text-sm font-semibold transition hover:bg-[#f0f5e8]"
            >
              Browse exercise library
            </Link>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
              <h3 className="font-semibold">Workout details</h3>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium">Workout title</span>
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft({ title: event.target.value })}
                  maxLength={100}
                  placeholder="e.g. Upper body strength"
                  className="h-12 w-full rounded-xl border border-border px-4 text-sm outline-none focus:border-[#8da85d]"
                />
              </label>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft({ description: event.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Add a short note about this workout"
                  className="w-full resize-y rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-[#8da85d]"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Selected exercises</h3>
                  <p className="mt-1 text-xs text-muted">
                    {draft.exercises.length} exercise(s) in this draft
                  </p>
                </div>
                <Link
                  to="/coach/exercises"
                  className="text-sm font-semibold text-[#6d8c36] hover:underline"
                >
                  + Add exercises
                </Link>
              </div>

              {selectedExercises.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-border px-5 py-10 text-center">
                  <p className="font-medium">Your workout is empty</p>
                  <p className="mt-2 text-sm text-muted">
                    Choose exercises from the library to start building.
                  </p>
                  <Link
                    to="/coach/exercises"
                    className="mt-4 inline-flex rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white"
                  >
                    Browse exercises
                  </Link>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selectedExercises.map((item, index) => (
                    <article
                      key={item.exercise_id}
                      className="rounded-xl border border-[#e9eae4] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f0f5e8] text-xs font-bold text-[#607b38]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold">
                              {item.exercise?.name ?? 'Exercise unavailable'}
                            </h4>
                            <p className="mt-1 text-xs text-muted">
                              {item.exercise?.muscle_group ?? 'Unknown muscle group'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExercise(item.exercise_id)}
                          className="text-xs font-medium text-[#9b5147] hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {([
                          ['sets', 'Sets', 1, 20],
                          ['reps', 'Reps', 1, 100],
                          ['rest_seconds', 'Rest (sec)', 0, 600],
                        ] as const).map(([field, label, min, max]) => (
                          <label key={field} className="min-w-0">
                            <span className="mb-1.5 block text-xs text-muted">
                              {label}
                            </span>
                            <input
                              type="number"
                              min={min}
                              max={max}
                              value={item[field]}
                              onChange={(event) =>
                                updateExercise(
                                  item.exercise_id,
                                  field,
                                  Number(event.target.value),
                                )
                              }
                              className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-[#8da85d]"
                            />
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-semibold">Workout summary</h3>
              <div className="mt-5 flex items-center justify-between border-b border-[#eeeeea] pb-3 text-sm">
                <span className="text-muted">Exercises</span>
                <span className="font-semibold">{draft.exercises.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted">Total sets</span>
                <span className="font-semibold">
                  {draft.exercises.reduce((total, item) => total + item.sets, 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="mt-4 h-11 w-full rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-[#30352a]"
              >
                Save draft
              </button>
              {saveMessage && (
                <p role="status" className="mt-3 text-xs leading-5 text-muted">
                  {saveMessage}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[#e5e8dc] bg-[#f0f5e8] p-5">
              <p className="text-sm font-semibold">Publishing is not connected yet</p>
              <p className="mt-2 text-xs leading-5 text-[#5d6651]">
                The current repository does not include a Workout API contract.
                This draft is saved locally and cannot yet be published or
                assigned to an athlete.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

export default WorkoutBuilderPage
