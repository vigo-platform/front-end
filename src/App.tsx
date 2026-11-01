import './App.css'
import AppShell from './components/layout/AppShell'
import { athleteDashboardMock } from './features/dashboard/data/dashboard.mock'

function App() {
  const { user, coach, plan, stats, next_workout, assigned_workouts } =
    athleteDashboardMock

  return (
    <AppShell title="Dashboard">
      <div className="app space-y-8">
        <section>
          <h2 className="text-2xl font-semibold">
            Welcome back, {user.display_name}!
          </h2>
          <p className="mt-2 text-muted">
            Here's an overview of your training progress.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Your Progress</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm text-muted">Completed Workouts</p>
              <p className="mt-2 text-2xl font-bold">
                {stats.completed_workouts}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm text-muted">Training Hours</p>
              <p className="mt-2 text-2xl font-bold">
                {stats.training_hours}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm text-muted">Current Streak</p>
              <p className="mt-2 text-2xl font-bold">
                {stats.current_streak_days} days
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold">Your Coach</h2>
          <p className="mt-3 font-medium">{coach.display_name}</p>
          <p className="mt-1 text-sm text-muted">{coach.headline}</p>
          <p className="mt-4 text-sm">Current plan: {plan.title}</p>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-lg font-semibold">Next Workout</h2>
          <h3 className="mt-3 font-medium">{next_workout.title}</h3>
          <p className="mt-2 text-sm text-muted">
            {next_workout.duration_minutes} minutes ·{' '}
            {next_workout.exercise_count} exercises
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Assigned Workouts</h2>

          <div className="space-y-3">
            {assigned_workouts.map((workout) => (
              <article
                key={workout.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <h3 className="font-semibold">{workout.title}</h3>
                <p className="mt-2 text-sm text-muted">
                  {workout.scheduled_label} · {workout.duration_minutes} minutes
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

export default App