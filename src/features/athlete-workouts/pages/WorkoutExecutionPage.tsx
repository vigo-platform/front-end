import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'

function WorkoutExecutionPage() {
  return (
    <AppShell title="Workout unavailable">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#82975e]">Athlete space</p>
        <h1 className="mt-3 text-xl font-semibold text-ink">Workout execution is not available yet</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          The backend does not currently provide workout detail or result-submission endpoints. This route is kept for the future integration, but it does not load demo data or save local results.
        </p>
        <Link to="/athlete/workouts" className="mt-5 inline-flex text-sm font-semibold text-[#526a2e] hover:underline">
          ← Back to my workouts
        </Link>
      </div>
    </AppShell>
  )
}

export default WorkoutExecutionPage
