import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { exerciseLibrary } from '../data/exercises'
import { loadWorkoutDraft, saveWorkoutDraft } from '../services/workout-draft.service'
import type { ExerciseCategory } from '../types/workout.types'
import { useTranslation } from 'react-i18next'

type CategoryFilter = 'ALL' | ExerciseCategory

const categoryLabels: Record<CategoryFilter, string> = {
  ALL: 'All exercises',
  STRENGTH: 'Strength',
  CARDIO: 'Cardio',
  MOBILITY: 'Mobility',
  CORE: 'Core',
}

function ExerciseLibraryPage() {
  const { t } = useTranslation()
  const { isPreview } = useAuth()
  const coachPath = isPreview ? '/_preview/coach' : '/coach'
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
        t('ui.exercise.' + exercise.id + '.name'),
        t('ui.exercise.' + exercise.id + '.muscle_group'),
        t('ui.exercise.' + exercise.id + '.equipment'),
        t('ui.exercise.' + exercise.id + '.description'),
      ]
        .join(' ')
        .toLowerCase()

      return matchesCategory && searchableText.includes(normalizedSearch)
    })
  }, [category, search, t])

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
    <AppShell title={t("ui.Exercise library")}>
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link to={coachPath} className="text-sm font-medium text-fg-secondary hover:text-fg">
              {t("ui.← Coach workspace")}
            </Link>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {t("ui.Exercise library")}
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              {t("ui.Find movements and add them to your current workout draft.")}
            </p>
          </div>
          <Link
            to={coachPath + '/workouts/new'}
            className="inline-flex h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-semibold text-fg-inverse transition hover:bg-sidebar-hover"
          >
            {t('ui.Open workout builder')} ({selectedIds.length})
          </Link>
        </section>

        <section className="rounded-2xl border border-border-default bg-surface-muted px-4 py-3 text-xs leading-5 text-fg-secondary">
          {t('ui.Sample exercise catalog for frontend development. It is not yet connected to the backend exercise service.')}
        </section>

        <section className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">{t("ui.Search exercises")}</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("ui.Search by exercise, muscle group, or equipment")}
              className="h-12 w-full rounded-xl border border-border-default bg-surface px-4 text-sm outline-none transition focus:border-brand-hover"
            />
          </label>
          <label>
            <span className="sr-only">{t("ui.Filter by category")}</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as CategoryFilter)
              }
              className="h-12 w-full rounded-xl border border-border-default bg-surface px-4 text-sm outline-none focus:border-brand-hover sm:min-w-48"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {t('ui.' + label)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {filteredExercises.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-14 text-center">
            <h3 className="font-semibold">{t("ui.No exercises found")}</h3>
            <p className="mt-2 text-sm text-fg-secondary">
              {t("ui.Try another search term or category.")}
            </p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedIds.includes(exercise.id)

              return (
                <article
                  key={exercise.id}
                  className="flex min-h-56 flex-col rounded-2xl border border-border-default bg-surface p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold text-fg-secondary">
                      {t('ui.' + categoryLabels[exercise.category])}
                    </span>
                    <span className="text-xs text-fg-secondary">{t('ui.exercise.' + exercise.id + '.equipment')}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{t('ui.exercise.' + exercise.id + '.name')}</h3>
                  <p className="mt-2 text-sm leading-6 text-fg-secondary">
                    {t('ui.exercise.' + exercise.id + '.description')}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="text-xs font-medium text-fg-secondary">
                      {t('ui.exercise.' + exercise.id + '.muscle_group')}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExercise(exercise.id)}
                      className={
                        isSelected
                          ? 'rounded-full border border-success-border bg-surface-muted px-4 py-2 text-xs font-semibold text-fg-secondary'
                          : 'rounded-full bg-fg px-4 py-2 text-xs font-semibold text-fg-inverse transition hover:bg-sidebar-hover'
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
