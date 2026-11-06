import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { previewCoachPlans, previewCoachRelations } from '../../auth/data/dashboard-preview'
import { loadWorkoutDraft } from '../services/workout-draft.service'

interface CoachDashboardPageProps {
  isPreview?: boolean
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

const workspaceLinks = [
  {
    number: '01',
    eyebrow: 'Exercise workspace',
    title: 'Exercise library',
    description: 'Explore the sample movement catalog and choose exercises for a workout.',
    href: '/coach/exercises',
    action: 'Browse exercises',
    mark: 'EX',
  },
  {
    number: '02',
    eyebrow: 'Workout workspace',
    title: 'Workout builder',
    description: 'Arrange exercises and configure sets, reps, and rest periods in a draft.',
    href: '/coach/workouts/new',
    action: 'Build a workout',
    mark: 'WB',
  },
  {
    number: '03',
    eyebrow: 'Saved in this browser',
    title: 'My workouts',
    description: 'Continue editing the workout draft stored locally on this device.',
    href: '/coach/workouts',
    action: 'Open drafts',
    mark: 'DR',
  },
]

function CoachDashboardPage({ isPreview = false }: CoachDashboardPageProps) {
  const { user } = useAuth()
  const firstName = user?.display_name?.trim().split(/\s+/)[0] || 'Coach'
  const draft = loadWorkoutDraft()
  const activeAthletes = isPreview
    ? previewCoachRelations.filter((relation) => relation.status === 'ACTIVE')
    : []
  const activePlans = isPreview
    ? previewCoachPlans.filter((plan) => plan.status === 'ACTIVE')
    : []

  return (
    <AppShell title="Overview">
      <div className="mx-auto w-full max-w-[1180px] space-y-7">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">Coach workspace</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-[#171815] sm:text-[40px]">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-[#77786f]">
              Manage your coaching resources and keep your training content organized.
            </p>
          </div>
          <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] ${user?.status === 'ACTIVE' ? 'border-[#dce8c8] bg-[#f2f8e8] text-[#526a2e]' : 'border-[#e8dfd6] bg-white text-[#8c694b]'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-[#9bcf43]' : 'bg-[#c58a5d]'}`} />
            {user?.status || 'Status unavailable'}
          </span>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Active athletes</p>
            <p className="mt-4 text-[28px] font-bold tracking-[-1px] text-[#20211d]">{isPreview ? activeAthletes.length.toString().padStart(2, '0') : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Coach–athlete relations</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Active plans</p>
            <p className="mt-4 text-[28px] font-bold tracking-[-1px] text-[#20211d]">{isPreview ? activePlans.length.toString().padStart(2, '0') : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Published coaching plans</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Draft exercises</p>
            <p className="mt-4 text-[28px] font-bold tracking-[-1px] text-[#20211d]">{draft.exercises.length.toString().padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Saved in this browser</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Member since</p>
            <p className="mt-4 text-[19px] font-bold tracking-[-0.6px] text-[#20211d]">{formatDate(user?.created_at)}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Account creation date</p>
          </article>
        </section>

        <section className="relative overflow-hidden rounded-[24px] bg-[#171916] p-7 text-white sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full border-[54px] border-white/[0.035]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
              Coaching workspace
            </span>
            <h2 className="mt-6 max-w-xl text-[28px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[34px]">
              Turn your expertise into a clear training plan.
            </h2>
            <p className="mt-3 max-w-xl text-[12px] leading-6 text-white/60">
              Build a structured workout draft, organize your exercise library, and prepare your coaching content.
            </p>
            <Link to="/coach/workouts/new" className="mt-7 inline-flex h-11 items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]">
              Open workout builder <span aria-hidden="true">→</span>
            </Link>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-white/[0.045]">V</span>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Your tools</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-[#20211d]">Coaching workspace</h2>
            </div>
            <span className="text-[10px] text-[#92938a]">Drafts are stored locally until Workout APIs are available.</span>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {workspaceLinks.map((item) => (
              <Link key={item.href} to={item.href} className="group flex min-h-[205px] flex-col rounded-[20px] border border-[#e1e1da] bg-white p-6 transition hover:-translate-y-1 hover:border-[#cbd9b3] hover:shadow-[0_16px_38px_rgba(35,42,23,0.07)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[1.5px] text-[#96978d]">{item.number}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3e9] text-[9px] font-bold text-[#60783a] transition group-hover:bg-[#c7f36b]">{item.mark}</span>
                </div>
                <p className="mt-6 text-[9px] font-bold uppercase tracking-[1.2px] text-[#82975e]">{item.eyebrow}</p>
                <h3 className="mt-2 text-[18px] font-bold tracking-[-0.5px] text-[#20211d]">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{item.description}</p>
                <span className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-[11px] font-bold text-[#4e642e] transition group-hover:gap-3">
                  {item.action} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Account profile</p>
            <h2 className="mt-2 text-[18px] font-bold tracking-[-0.5px]">Your details</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="text-[10px] text-[#92938a]">Full name</dt>
                <dd className="mt-1 truncate text-[12px] font-semibold text-[#34352f]">{user?.display_name || '—'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] text-[#92938a]">Email address</dt>
                <dd className="mt-1 break-all text-[12px] font-semibold text-[#34352f]">{user?.email || '—'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] text-[#92938a]">Phone</dt>
                <dd className="mt-1 text-[12px] font-semibold text-[#34352f]">{user?.phone || 'Not provided'}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] text-[#92938a]">Account status</dt>
                <dd className="mt-1 text-[12px] font-semibold text-[#34352f]">{user?.status || '—'}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[20px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">Coaching relationships</p>
            <h2 className="mt-2 text-[18px] font-bold tracking-[-0.5px] text-[#20231b]">Your athletes</h2>
            {isPreview ? (
              <div className="mt-4 space-y-3">
                {activeAthletes.slice(0, 2).map((relation) => (
                  <div key={relation.relation_id} className="flex items-center justify-between gap-3 border-b border-[#dce2d2] pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-[#34382d]">{relation.athlete_name}</p>
                      <p className="mt-1 truncate text-[10px] text-[#777f6b]">{relation.plan_title}</p>
                    </div>
                    <span className="rounded-full bg-white/80 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.8px] text-[#60783a]">Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[11px] leading-5 text-[#73786a]">
                Athlete relationships will appear here when the User Service relation endpoint is connected.
              </p>
            )}
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default CoachDashboardPage
