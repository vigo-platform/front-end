import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'

function formatMemberSince(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

const workspaceLinks = [
  {
    number: '01',
    eyebrow: 'Exercise workspace',
    title: 'Exercise library',
    description: 'Browse the current exercise interface and explore its sample movement catalog.',
    href: '/coach/exercises',
    action: 'Open library',
  },
  {
    number: '02',
    eyebrow: 'Workout workspace',
    title: 'Workout builder',
    description: 'Explore the workout draft builder and organize exercises, sets, reps, and rest periods.',
    href: '/coach/workouts/new',
    action: 'Open builder',
  },
  {
    number: '03',
    eyebrow: 'Saved locally',
    title: 'My workouts',
    description: 'Return to the workout draft saved in this browser.',
    href: '/coach/workouts',
    action: 'View drafts',
  },
]

function CoachDashboardPage() {
  const { user } = useAuth()
  const displayName = user?.display_name?.trim() || 'Coach'
  const firstName = displayName.split(/\s+/)[0]

  return (
    <AppShell title="Overview">
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">Coach space</p>
            <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-1.5px] text-[#171815] sm:text-[38px]">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#77786f]">
              Your coaching workspace, with your account details and the tools currently available in this MVP.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dedfd6] bg-white px-4 py-2.5">
            <span className={`h-2 w-2 rounded-full ${user?.status === 'ACTIVE' ? 'bg-[#a7d94e]' : 'bg-[#d99b67]'}`} />
            <span className="text-[9px] font-bold uppercase tracking-[1px] text-[#55564e]">
              Account {user?.status?.toLowerCase() || 'status unavailable'}
            </span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Workspace role</p>
            <p className="mt-5 text-[24px] font-bold tracking-[-0.8px]">Coach</p>
            <p className="mt-1 text-[11px] text-[#898a81]">Your current Vigo role</p>
          </article>
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Member since</p>
            <p className="mt-5 text-[24px] font-bold tracking-[-0.8px]">{formatMemberSince(user?.created_at)}</p>
            <p className="mt-1 text-[11px] text-[#898a81]">Based on your account creation date</p>
          </article>
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-5 sm:col-span-2 sm:p-6 xl:col-span-1">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Account profile</p>
            <p className="mt-5 truncate text-[18px] font-bold tracking-[-0.5px]">{user?.display_name || 'Profile name unavailable'}</p>
            <p className="mt-1 truncate text-[11px] text-[#898a81]">{user?.email || 'Email unavailable'}</p>
          </article>
        </section>

        <section className="relative overflow-hidden rounded-[22px] bg-[#171916] p-7 text-white sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.035]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
              Your workspace
            </span>
            <h2 className="mt-6 text-[27px] font-bold leading-[1.15] tracking-[-1px] sm:text-[32px]">
              Build your coaching workflow.
            </h2>
            <p className="mt-3 max-w-xl text-[12px] leading-6 text-white/55">
              The current MVP includes the exercise and workout draft interfaces. Publishing plans, assigning athletes, and managing coaching relationships need their dedicated backend endpoints.
            </p>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-1 right-8 text-[110px] font-black leading-none tracking-[-12px] text-white/[0.045]">V</span>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Available tools</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px]">Your coaching workspace</h2>
              <p className="mt-1 text-[12px] text-[#77786f]">These interfaces are currently local previews, not server-synced coaching tools.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {workspaceLinks.map((item) => (
              <article key={item.href} className="group flex min-h-[230px] flex-col rounded-[20px] border border-[#e1e1da] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(35,42,23,0.07)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[1.5px] text-[#96978d]">{item.number}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3e9] text-[13px] text-[#60783a] transition group-hover:bg-[#c7f36b]">↗</span>
                </div>
                <p className="mt-7 text-[9px] font-bold uppercase tracking-[1.2px] text-[#82975e]">{item.eyebrow}</p>
                <h3 className="mt-2 text-[18px] font-bold tracking-[-0.5px]">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{item.description}</p>
                <Link to={item.href} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-[11px] font-bold text-[#4e642e] transition group-hover:gap-3">
                  {item.action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Account details</p>
            <h2 className="mt-3 text-[19px] font-bold tracking-[-0.5px]">Your information</h2>
            <dl className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-[#eeeeea] pb-3">
                <dt className="text-[11px] text-[#888980]">Email</dt>
                <dd className="max-w-[65%] break-all text-right text-[11px] font-semibold text-[#34352f]">{user?.email || '—'}</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-[#eeeeea] pb-3">
                <dt className="text-[11px] text-[#888980]">Phone</dt>
                <dd className="text-right text-[11px] font-semibold text-[#34352f]">{user?.phone || 'Not provided'}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[11px] text-[#888980]">Account status</dt>
                <dd className="text-right text-[11px] font-semibold text-[#34352f]">{user?.status || '—'}</dd>
              </div>
            </dl>
          </article>

          <article className="flex flex-col justify-between rounded-[20px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">MVP scope</p>
              <h2 className="mt-3 text-[20px] font-bold tracking-[-0.6px]">What is connected today?</h2>
              <p className="mt-3 text-[12px] leading-6 text-[#73786a]">
                Your account profile is loaded from the User Service. Exercise catalog and workout drafts remain browser-local until their backend contracts are available.
              </p>
            </div>
            <Link to="/coach/workouts" className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-bold text-[#4e642e] hover:gap-3">
              Review saved drafts <span aria-hidden="true">→</span>
            </Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default CoachDashboardPage
