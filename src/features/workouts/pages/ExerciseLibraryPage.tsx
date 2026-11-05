import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../components/layout/AppShell'
import { exerciseLibrary } from '../data/exercises'
import { loadWorkoutDraft, saveWorkoutDraft } from '../services/workout-draft.service'
import type { ExerciseCategory } from '../types/workout.types'

type CategoryFilter = 'ALL' | ExerciseCategory

const categoryLabels: Record<CategoryFilter, string> = {
  ALL: 'All exercises',
  STRENGTH: 'Strength',
  CARDIO: 'Cardio',
  MOBILITY: 'Mobility',
  CORE: 'Core',
}

function ExerciseLibraryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    loadWorkoutDraft().exercises.map((item) => item.exercise_id),
  )

  const filteredExercises = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return exerciseLibrary.filter((exercise) => {
      const matchesCategory =
        category === 'ALL' || exercise.category === category
      const searchableText = [
        exercise.name,
        exercise.muscle_group,
        exercise.equipment,
        exercise.description,
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedSearch)
    })
  }, [category, search])

  function toggleExercise(exerciseId: string) {
    const draft = loadWorkoutDraft()
    const alreadySelected = draft.exercises.some(
      (item) => item.exercise_id === exerciseId,
    )

    const nextExercises = alreadySelected
      ? draft.exercises.filter((item) => item.exercise_id !== exerciseId)
      : [
          ...draft.exercises,
          { exercise_id: exerciseId, sets: 3, reps: 10, rest_seconds: 60 },
        ]

    saveWorkoutDraft({ ...draft, exercises: nextExercises })
    setSelectedIds(nextExercises.map((item) => item.exercise_id))
  }

  return (
    <AppShell title="Exercise library">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link to="/coach" className="text-sm font-medium text-muted hover:text-ink">
              ← Coach workspace
            </Link>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Exercise library
            </h2>
            <p className="mt-2 text-sm text-muted">
              Find movements and add them to your current workout draft.
            </p>
          </div>
          <Link
            to="/coach/workouts/new"
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-[#30352a]"
          >
            Open workout builder ({selectedIds.length})
          </Link>
        </section>

        <section className="rounded-2xl border border-[#e5e8dc] bg-[#f0f5e8] px-4 py-3 text-xs leading-5 text-[#5d6651]">
          Sample exercise catalog for frontend development. It is not yet
          connected to the backend exercise service.
        </section>

        <section className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search exercises</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by exercise, muscle group, or equipment"
              className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-[#8da85d]"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryFilter)
              }
              className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none focus:border-[#8da85d] sm:min-w-48"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {filteredExercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
            <h3 className="font-semibold">No exercises found</h3>
            <p className="mt-2 text-sm text-muted">
              Try another search term or category.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedIds.includes(exercise.id)

              return (
                <article
                  key={exercise.id}
                  className="flex min-h-56 flex-col rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-[#f0f5e8] px-3 py-1 text-[11px] font-semibold text-[#607b38]">
                      {categoryLabels[exercise.category]}
                    </span>
                    <span className="text-xs text-muted">{exercise.equipment}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{exercise.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {exercise.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="text-xs font-medium text-muted">
                      {exercise.muscle_group}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExercise(exercise.id)}
                      className={
                        isSelected
                          ? 'rounded-full border border-[#d8e4c5] bg-[#f0f5e8] px-4 py-2 text-xs font-semibold text-[#607b38]'
                          : 'rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#30352a]'
                      }
                    >
                      {isSelected ? 'Remove' : 'Add to workout'}
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </AppShell>
  )
}

export default ExerciseLibraryPage
