import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { previewAthleteCoachRelation } from '../../auth/data/dashboard-preview'

interface AthleteDashboardPageProps {
  isPreview?: boolean
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function AthleteDashboardPage({ isPreview = false }: AthleteDashboardPageProps) {
  const { user } = useAuth()
  const displayName = user?.display_name?.trim() || 'Athlete'
  const firstName = displayName.split(/\s+/)[0]
  const hasCoach = isPreview && previewAthleteCoachRelation.status === 'ACTIVE'

  return (
    <AppShell title="Overview">
      <div className="mx-auto w-full max-w-[1180px] space-y-7">
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">Athlete space</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-[#171815] sm:text-[40px]">
              Good morning, {firstName}.
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-[#77786f]">
              A clear view of your coaching and training journey.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] ${user?.status === 'ACTIVE' ? 'border-[#dce8c8] bg-[#f2f8e8] text-[#526a2e]' : 'border-[#e8dfd6] bg-white text-[#8c694b]'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-[#9bcf43]' : 'bg-[#c58a5d]'}`} />
              {user?.status || 'Status unavailable'}
            </span>
            <span className="rounded-full border border-[#e2e2db] bg-white px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[1px] text-[#77786f]">
              Member since {formatDate(user?.created_at)}
            </span>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
          <article className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#171916] p-7 text-white sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full border-[54px] border-white/[0.035]" />
            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
                Your training journey
              </span>
              <h2 className="mt-6 max-w-lg text-[28px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[34px]">
                Stronger starts with the right coach.
              </h2>
              <p className="mt-3 max-w-md text-[12px] leading-6 text-white/60">
                Discover coaches, explore their specialties, and find a training approach that works for you.
              </p>
            </div>
            <Link to="/coaches" className="relative mt-8 inline-flex h-11 w-fit items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]">
              Discover coaches <span aria-hidden="true">→</span>
            </Link>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-white/[0.045]">V</span>
          </article>

          <article className="flex flex-col rounded-[24px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Your coach</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f3eb] text-[13px] text-[#61773b]">✳</span>
            </div>
            {hasCoach ? (
              <>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c7f36b] text-[15px] font-bold text-[#20231b]">JD</div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-[#20211d]">{previewAthleteCoachRelation.coach_name}</h3>
                    <p className="mt-1 text-[10px] text-[#888980]">Strength & conditioning</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-[#edede8] pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#96978d]">Active plan</p>
                  <p className="mt-2 text-[13px] font-semibold text-[#30312b]">{previewAthleteCoachRelation.plan_title}</p>
                  <p className="mt-1 text-[10px] text-[#888980]">Started {formatDate(previewAthleteCoachRelation.starts_at)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1px] text-[#61773b]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9bcf43]" /> Active relationship
                  </span>
                  <span className="text-[10px] text-[#9a9b92]">Preview</span>
                </div>
              </>
            ) : (
              <>
                <h3 className="mt-6 text-[19px] font-bold leading-tight tracking-[-0.5px]">No coach connected yet</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#77786f]">
                  Browse coach profiles and compare their specialties and plans.
                </p>
                <Link to="/coaches" className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-[11px] font-bold text-[#4e642e] hover:gap-3">
                  Find your coach <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </article>
        </section>

        <section id="workouts" className="scroll-mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Training</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-[#20211d]">Your workouts</h2>
              <p className="mt-1 text-[12px] text-[#77786f]">Assigned training plans and sessions will appear here.</p>
            </div>
            <span className="rounded-full bg-[#eeefe9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[1px] text-[#77786f]">Workout API pending</span>
          </div>
          <div className="mt-4 flex flex-col items-start gap-5 rounded-[20px] border border-dashed border-[#d9dacf] bg-[#fbfbf8] p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eff2e8] text-[22px] text-[#6b8242]">↗</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-bold text-[#292a25]">Your training plan will show up here</h3>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-[#85867d]">
                Workout assignment and execution are not defined in the current API contracts, so this area is intentionally kept free of invented sessions or progress metrics.
              </p>
            </div>
            <Link to="/coaches" className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#d9dfce] bg-white px-4 text-[10px] font-bold text-[#526a2e] transition hover:bg-[#f2f8e8]">
              Browse coaches
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Account</p>
                <h2 className="mt-2 text-[18px] font-bold tracking-[-0.5px]">Personal details</h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f3eb] text-[13px]">◉</span>
            </div>
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
                <dt className="text-[10px] text-[#92938a]">Account role</dt>
                <dd className="mt-1 text-[12px] font-semibold text-[#34352f]">Athlete</dd>
              </div>
            </dl>
          </article>

          <article className="flex flex-col justify-between rounded-[20px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">Keep moving</p>
              <h2 className="mt-3 text-[21px] font-bold leading-tight tracking-[-0.7px] text-[#20231b]">Find your next training partner.</h2>
              <p className="mt-2 text-[11px] leading-5 text-[#73786a]">Explore coach profiles, specialties, experience, and available plans in one place.</p>
            </div>
            <Link to="/coaches" className="mt-6 inline-flex w-fit items-center gap-2 text-[11px] font-bold text-[#4e642e] hover:gap-3">
              Explore the directory <span aria-hidden="true">→</span>
            </Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
