import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/auth-context'
import AppShell from '../../../shared/components/layout/AppShell'
import { getAssignedWorkouts } from '../services/athlete-workout.service'
import type { AssignedWorkoutSummary } from '../services/athlete-workout.service'

function AthleteWorkoutsPage() {
  const { isPreview } = useAuth()
  const workoutsPath = isPreview ? '/_preview/athlete/workouts' : '/athlete/workouts'
  const [workouts, setWorkouts] = useState<AssignedWorkoutSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    getAssignedWorkouts()
      .then((items) => {
        if (active) setWorkouts(items)
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load your workouts.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [reloadKey])

  return (
    <AppShell title="My workouts">
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#82975e]">Athlete space</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">My workouts</h1>
          <p className="mt-2 text-sm text-muted">Review assigned sessions and record your training results.</p>
        </section>

        {error ? (
          <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="text-sm font-semibold text-red-800">Could not load workouts</h2>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button type="button" onClick={() => { setError(''); setIsLoading(true); setReloadKey((value) => value + 1) }} className="mt-3 text-sm font-semibold text-red-800 underline">Try again</button>
          </section>
        ) : isLoading ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-14 text-center text-sm text-muted">Loading workouts...</div>
        ) : workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
            <h2 className="font-semibold">No assigned workouts yet</h2>
            <p className="mt-2 text-sm text-muted">Your coach's assigned workouts will appear here.</p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {workouts.map((workout) => (
              <article key={workout.id} className="flex flex-col rounded-2xl border border-border bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className={workout.status === 'COMPLETED' ? 'rounded-full bg-[#f0f5e8] px-3 py-1 text-[10px] font-semibold text-[#607b38]' : 'rounded-full bg-[#f2f2ed] px-3 py-1 text-[10px] font-semibold text-[#66685f]'}>
                    {workout.status === 'COMPLETED' ? 'Completed' : 'Assigned'}
                  </span>
                  <span className="text-xs text-muted">{workout.estimated_duration_minutes} min</span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{workout.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{workout.description}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted">
                  <span>{workout.exercises.length} exercises</span>
                  <span>Coach: {workout.coach_name}</span>
                </div>
                {workout.status === 'COMPLETED' ? (
                  <p className="mt-5 text-xs font-medium text-[#607b38]">Completed {workout.completed_at ? new Date(workout.completed_at).toLocaleDateString() : ''}</p>
                ) : (
                  <Link to={`${workoutsPath}/${workout.id}`} className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-ink px-5 text-xs font-semibold text-white transition hover:bg-[#30352a]">
                    Start workout
                  </Link>
                )}
              </article>
            ))}
          </section>
        )}
        <p className="rounded-xl border border-[#e5e8dc] bg-[#f0f5e8] p-4 text-xs leading-5 text-[#5d6651]">
          Demo workouts and execution results are stored locally in this browser.
        </p>
      </div>
    </AppShell>
  )
}

export default AthleteWorkoutsPage
