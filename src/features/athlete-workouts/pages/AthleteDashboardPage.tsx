import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'

function formatMemberSince(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

function AthleteDashboardPage() {
  const { user } = useAuth()
  const displayName = user?.display_name?.trim() || 'Athlete'
  const firstName = displayName.split(/\\s+/)[0]

  return (
    <AppShell title="Overview">
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">
              Athlete space
            </p>
            <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-[-1.5px] text-[#171815] sm:text-[38px]">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#77786f]">
              Your training space starts here. Find a coach and keep your account details up to date.
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
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Account type</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3eb] text-[12px]">◉</span>
            </div>
            <p className="mt-5 text-[24px] font-bold tracking-[-0.8px]">Athlete</p>
            <p className="mt-1 text-[11px] text-[#898a81]">Your current Vigo role</p>
          </article>

          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Member since</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3eb] text-[12px]">◷</span>
            </div>
            <p className="mt-5 text-[24px] font-bold tracking-[-0.8px]">{formatMemberSince(user?.created_at)}</p>
            <p className="mt-1 text-[11px] text-[#898a81]">Based on your account creation date</p>
          </article>

          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-5 sm:col-span-2 sm:p-6 xl:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Profile</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3eb] text-[12px]">↗</span>
            </div>
            <p className="mt-5 truncate text-[18px] font-bold tracking-[-0.5px]">{user?.display_name || 'Complete your profile'}</p>
            <p className="mt-1 truncate text-[11px] text-[#898a81]">{user?.email || 'Email unavailable'}</p>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
          <article className="relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#171916] p-7 text-white sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/[0.035]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
                Your next step
              </span>
              <h2 className="mt-6 max-w-lg text-[27px] font-bold leading-[1.15] tracking-[-1px] sm:text-[32px]">
                Find a coach who fits your goals.
              </h2>
              <p className="mt-3 max-w-lg text-[12px] leading-6 text-white/55">
                Explore approved coach profiles, compare specialties and experience, and learn more about their coaching plans.
              </p>
            </div>
            <div className="relative mt-8">
              <Link
                to="/coaches"
                className="inline-flex h-11 items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]"
              >
                Explore coaches <span aria-hidden="true">→</span>
              </Link>
            </div>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-8 text-[110px] font-black leading-none tracking-[-12px] text-white/[0.045]">V</span>
          </article>

          <article className="flex flex-col rounded-[22px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Training overview</p>
            <h2 className="mt-4 text-[20px] font-bold tracking-[-0.6px]">Workouts are not connected yet</h2>
            <p className="mt-3 text-[12px] leading-6 text-[#77786f]">
              Workout assignment and execution endpoints are not part of the available API contracts. This dashboard therefore does not show sample assignments or invented progress numbers.
            </p>
            <div className="mt-auto border-t border-[#edede8] pt-5">
              <Link to="/workouts" className="inline-flex items-center gap-2 text-[11px] font-bold text-[#4e642e] transition hover:gap-3">
                Open workout area <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[22px] border border-[#e1e1da] bg-white p-6 sm:p-7">
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

          <article className="flex flex-col justify-between rounded-[22px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">A clearer training journey</p>
              <h2 className="mt-3 max-w-md text-[22px] font-bold leading-tight tracking-[-0.8px] text-[#20231b]">
                Start with the right connection.
              </h2>
              <p className="mt-3 max-w-lg text-[12px] leading-6 text-[#73786a]">
                Your coach directory is available now. Workout plans and athlete-coach relationship management will appear here when their API support is available.
              </p>
            </div>
            <Link to="/coaches" className="mt-7 inline-flex w-fit items-center gap-2 text-[11px] font-bold text-[#4e642e] hover:gap-3">
              Browse the coach directory <span aria-hidden="true">→</span>
            </Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
