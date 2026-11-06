import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { loadWorkoutDraft } from '../services/workout-draft.service'

function CoachWorkoutsPage() {
  const { isPreview } = useAuth()
  const coachPath = isPreview ? '/_preview/coach' : '/coach'
  const draft = loadWorkoutDraft()
  const hasSavedDraft = Boolean(draft.updated_at)

  return (
    <AppShell title="My workouts">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link to={coachPath} className="text-sm font-medium text-muted hover:text-ink">
              ← Coach workspace
            </Link>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              My workouts
            </h2>
            <p className="mt-2 text-sm text-muted">
              Review the workout draft saved in this browser.
            </p>
          </div>
          <Link
            to={coachPath + '/workouts/new'}
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-[#30352a]"
          >
            Create workout
          </Link>
        </section>

        {hasSavedDraft ? (
          <article className="rounded-2xl border border-border bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#f2f2ed] px-3 py-1 text-xs font-semibold text-[#66685f]">
                Draft
              </span>
              <span className="text-xs text-muted">
                Updated {new Date(draft.updated_at as string).toLocaleString()}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              {draft.title || 'Untitled workout'}
            </h3>
            {draft.description && (
              <p className="mt-2 text-sm leading-6 text-muted">
                {draft.description}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
              <span>{draft.exercises.length} exercises</span>
              <span>
                {draft.exercises.reduce((total, item) => total + item.sets, 0)} total sets
              </span>
            </div>
            <Link
              to={coachPath + '/workouts/new'}
              className="mt-6 inline-flex text-sm font-semibold text-ink hover:text-[#6d8c36]"
            >
              Continue editing →
            </Link>
          </article>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
            <h3 className="font-semibold">No saved workouts yet</h3>
            <p className="mt-2 text-sm text-muted">
              Create a workout and save it as a draft to see it here.
            </p>
            <Link
              to={coachPath + '/workouts/new'}
              className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Start building
            </Link>
          </div>
        )}

        <p className="rounded-xl border border-[#e5e8dc] bg-[#f0f5e8] p-4 text-xs leading-5 text-[#5d6651]">
          Drafts are stored in this browser only. Publishing and sharing
          workouts with athletes require the backend Workout API, which is not
          included in the current contracts.
        </p>
      </div>
    </AppShell>
  )
}

export default CoachWorkoutsPage
