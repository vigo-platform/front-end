import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'

const workspaceLinks = [
  {
    title: 'Exercise library',
    description: 'Browse the sample exercise catalog and add movements to a workout draft.',
    href: '/coach/exercises',
    action: 'Browse exercises',
    number: '01',
  },
  {
    title: 'Workout builder',
    description: 'Create a structured workout by setting exercises, sets, repetitions, and rest time.',
    href: '/coach/workouts/new',
    action: 'Build a workout',
    number: '02',
  },
  {
    title: 'My workouts',
    description: 'Review the workout draft saved in this browser.',
    href: '/coach/workouts',
    action: 'View workouts',
    number: '03',
  },
]

function CoachDashboardPage() {
  return (
    <AppShell title="Coach workspace">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Coach workspace
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Build better training plans.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Manage the building blocks of your athletes’ training. Start by
            choosing exercises, then organize them into a workout.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {workspaceLinks.map((item) => (
            <article
              key={item.href}
              className="flex min-h-64 flex-col rounded-3xl border border-border bg-white p-6 sm:p-8"
            >
              <span className="text-xs font-semibold tracking-[0.16em] text-muted">
                {item.number}
              </span>
              <h3 className="mt-8 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                {item.description}
              </p>
              <Link
                to={item.href}
                className="mt-auto inline-flex w-fit items-center gap-2 pt-8 text-sm font-semibold text-ink transition hover:text-[#6d8c36]"
              >
                {item.action}
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[#dce8c9] bg-[#f0f5e8] p-6 sm:p-8">
          <p className="text-sm font-semibold">MVP workspace</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6651]">
            Exercise data and workout drafts are currently local development
            data. Saving a draft stores it in this browser; publishing and
            athlete assignment will be connected when the Workout API contract
            is available.
          </p>
        </section>
      </div>
    </AppShell>
  )
}

export default CoachDashboardPage
