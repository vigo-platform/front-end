import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../components/layout/AppShell'
import {
  getAssignedWorkouts,
  type AssignedWorkoutSummary,
} from '../services/athlete-workout.service'

function AthleteDashboardPage() {
  const [workouts, setWorkouts] = useState<AssignedWorkoutSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true

    getAssignedWorkouts()
      .then((items) => {
        if (active) setWorkouts(items)
      })
      .catch(() => {
        if (active) setHasError(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const completedCount = workouts.filter(
    (workout) => workout.status === 'COMPLETED',
  ).length

  return (
    <AppShell title="Athlete dashboard">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Athlete workspace
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Your training
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            View your assigned workouts and keep track of completed sessions.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm text-muted">Assigned workouts</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {isLoading ? '—' : workouts.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm text-muted">Completed workouts</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {isLoading ? '—' : completedCount}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">Your workouts</h3>
              <p className="mt-1 text-sm text-muted">
                Open a workout to view its exercises and record your performance.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-white p-8 text-sm text-muted">
              Loading your workouts…
            </div>
          ) : hasError ? (
            <div className="rounded-2xl border border-[#ead1cd] bg-[#fff8f6] p-6">
              <p className="font-semibold">Could not load workouts</p>
              <p className="mt-2 text-sm text-muted">
                Please try again. Your saved workout results have not been changed.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : workouts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
              <h4 className="font-semibold">No workouts assigned yet</h4>
              <p className="mt-2 text-sm text-muted">
                When your coach assigns a workout, it will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {workouts.map((workout) => (
                <article
                  key={workout.id}
                  className="flex flex-col rounded-2xl border border-border bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={
                        workout.status === 'COMPLETED'
                          ? 'rounded-full bg-[#edf4e4] px-3 py-1 text-xs font-semibold text-[#587333]'
                          : 'rounded-full bg-[#f2f2ed] px-3 py-1 text-xs font-semibold text-[#66685f]'
                      }
                    >
                      {workout.status === 'COMPLETED' ? 'Completed' : 'Assigned'}
                    </span>
                    <span className="text-xs text-muted">
                      {workout.estimated_duration_minutes} min
                    </span>
                  </div>
                  <h4 className="mt-5 text-lg font-semibold">{workout.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {workout.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                    <span>{workout.exercises.length} exercises</span>
                    <span>Coach: {workout.coach_name}</span>
                  </div>
                  <div className="mt-6 border-t border-border pt-4">
                    <Link
                      to={workout.status === 'COMPLETED' ? '#' : `/workouts/${workout.id}`}
                      onClick={(event) => {
                        if (workout.status === 'COMPLETED') event.preventDefault()
                      }}
                      aria-disabled={workout.status === 'COMPLETED'}
                      className={
                        workout.status === 'COMPLETED'
                          ? 'text-sm font-semibold text-muted'
                          : 'text-sm font-semibold text-ink hover:text-[#6d8c36]'
                      }
                    >
                      {workout.status === 'COMPLETED'
                        ? 'Workout submitted'
                        : 'View workout and start →'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#e5e8dc] bg-[#f0f5e8] p-5 text-xs leading-5 text-[#5d6651]">
          Demo workout data is used until the backend provides workout
          assignment and execution endpoints. Results are stored in this
          browser only and are not visible to a coach on another device.
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
