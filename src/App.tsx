import './App.css'
import { athleteDashboardMock } from './features/dashboard/data/dashboard.mock'

function App() {
  const { user, coach, plan, stats, next_workout, assigned_workouts } =
    athleteDashboardMock

  return (
    <main className="app">
      <header>
        <h1>Vigo</h1>
        <p>Welcome back, {user.display_name}!</p>
      </header>

      <section>
        <h2>Your Progress</h2>
        <p>Completed workouts: {stats.completed_workouts}</p>
        <p>Training hours: {stats.training_hours}</p>
        <p>Current streak: {stats.current_streak_days} days</p>
      </section>

      <section>
        <h2>Your Coach</h2>
        <p>{coach.display_name}</p>
        <p>{coach.headline}</p>
        <p>Current plan: {plan.title}</p>
      </section>

      <section>
        <h2>Next Workout</h2>
        <h3>{next_workout.title}</h3>
        <p>{next_workout.duration_minutes} minutes</p>
        <p>{next_workout.exercise_count} exercises</p>
      </section>

      <section>
        <h2>Assigned Workouts</h2>

        {assigned_workouts.map((workout) => (
          <article key={workout.id}>
            <h3>{workout.title}</h3>
            <p>{workout.scheduled_label}</p>
            <p>{workout.duration_minutes} minutes</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App