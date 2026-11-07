import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import {
  previewAthleteCoachRelation,
  previewCoachPlans,
} from '../../auth/data/dashboard-preview'

interface AthleteDashboardPageProps {
  isPreview?: boolean
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US').format(value) + ' Toman'
}

function AthleteDashboardPage({ isPreview = false }: AthleteDashboardPageProps) {
  const { user, isPreview: previewContext } = useAuth()
  const preview = isPreview || previewContext
  const coachesPath = preview ? '/_preview/athlete/coaches' : '/coaches'
  const displayName = user?.display_name?.trim() || 'Athlete'
  const firstName = displayName.split(/\s+/)[0]
  const relation = preview ? previewAthleteCoachRelation : null
  const plans = preview ? previewCoachPlans : []
  const activeRelation = relation?.status === 'ACTIVE'

  return (
    <AppShell title="Overview">
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">Athlete space</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-[#171815] sm:text-[42px]">
              Good morning, {firstName}.
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-[#77786f]">
              Your coaching connections and account, all in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8c8] bg-[#f2f8e8] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-[#526a2e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9bcf43]" />
              {user?.status || 'Status unavailable'}
            </span>
            <span className="rounded-full border border-[#e2e2db] bg-white px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[1px] text-[#77786f]">
              Member since {formatDate(user?.created_at)}
            </span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Coaching relationship</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3e9] text-[12px] text-[#60783a]">↗</span>
            </div>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{preview && activeRelation ? '01' : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Active coach connections</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Available plans</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3e9] text-[12px] text-[#60783a]">▤</span>
            </div>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{preview ? String(plans.length).padStart(2, '0') : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Plans from your coach</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Account type</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f3e9] text-[12px] text-[#60783a]">◉</span>
            </div>
            <p className="mt-4 text-[25px] font-bold tracking-[-0.8px] text-[#20211d]">Athlete</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Your current Vigo role</p>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
          <article className="relative flex min-h-[285px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#171916] p-7 text-white sm:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-[330px] w-[330px] rounded-full border-[48px] border-white/[0.04]" />
            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />
                Your next step
              </span>
              <h2 className="mt-6 max-w-lg text-[29px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[36px]">
                Find the coach who moves you forward.
              </h2>
              <p className="mt-3 max-w-md text-[12px] leading-6 text-white/60">
                Explore coach profiles, compare specialties and discover the plans they offer.
              </p>
            </div>
            <Link to={coachesPath} className="relative mt-8 inline-flex h-11 w-fit items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]">
              Explore coaches <span aria-hidden="true">→</span>
            </Link>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-white/[0.045]">V</span>
          </article>

          <article className="flex flex-col rounded-[22px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Your coach</p>
              <span className="rounded-full bg-[#f0f3e9] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[1px] text-[#60783a]">
                {activeRelation ? 'Active' : 'Not connected'}
              </span>
            </div>
            {activeRelation && relation ? (
              <>
                <div className="mt-7 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c7f36b] text-[14px] font-bold text-[#20231b]">JD</div>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-bold text-[#20211d]">{relation.coach_name}</h3>
                    <p className="mt-1 text-[10px] text-[#888980]">Your active coach</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-[#edede8] pt-4">
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#96978d]">Connected plan</p>
                  <p className="mt-2 text-[13px] font-semibold text-[#30312b]">{relation.plan_title}</p>
                  <p className="mt-1 text-[10px] text-[#888980]">Since {formatDate(relation.starts_at)}</p>
                </div>
                <Link to={coachesPath + '/' + relation.coach_id} className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-[11px] font-bold text-[#4e642e] hover:gap-3">
                  View coach profile <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <>
                <h3 className="mt-7 text-[19px] font-bold leading-tight">Your coaching connection starts here.</h3>
                <p className="mt-2 text-[11px] leading-5 text-[#77786f]">Discover coaches and explore their public profiles and plans.</p>
                <Link to={coachesPath} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-[11px] font-bold text-[#4e642e] hover:gap-3">
                  Find a coach <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </article>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Explore</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-[#20211d]">Coaching plans</h2>
              <p className="mt-1 text-[12px] text-[#77786f]">Public plans published by coaches.</p>
            </div>
            <Link to={coachesPath} className="text-[10px] font-bold text-[#526a2e] hover:underline">View coach directory →</Link>
          </div>
          {preview ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.plan_id} className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#82975e]">Coaching plan</p>
                      <h3 className="mt-2 text-[16px] font-bold tracking-[-0.4px] text-[#20211d]">{plan.title}</h3>
                    </div>
                    <span className="rounded-full bg-[#f0f3e9] px-2.5 py-1 text-[8px] font-bold uppercase text-[#60783a]">{plan.status}</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-[#77786f]">{plan.description}</p>
                  <div className="mt-5 flex items-end justify-between border-t border-[#edede8] pt-4">
                    <div>
                      <p className="text-[9px] text-[#92938a]">Duration</p>
                      <p className="mt-1 text-[12px] font-semibold text-[#34352f]">{plan.duration_days} days</p>
                    </div>
                    <p className="text-[12px] font-bold text-[#34352f]">{formatPrice(plan.price)}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-dashed border-[#d9dacf] bg-[#fbfbf8] px-6 py-8 text-center">
              <p className="text-[13px] font-semibold text-[#34352f]">Coach plans will appear here</p>
              <p className="mt-1 text-[11px] text-[#85867d]">The coach directory and public plan endpoints are ready to connect.</p>
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Account details</p>
            <h2 className="mt-2 text-[18px] font-bold tracking-[-0.5px]">Your information</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="min-w-0"><dt className="text-[10px] text-[#92938a]">Full name</dt><dd className="mt-1 truncate text-[12px] font-semibold text-[#34352f]">{user?.display_name || '—'}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-[#92938a]">Email address</dt><dd className="mt-1 break-all text-[12px] font-semibold text-[#34352f]">{user?.email || '—'}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-[#92938a]">Phone</dt><dd className="mt-1 text-[12px] font-semibold text-[#34352f]">{user?.phone || 'Not provided'}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-[#92938a]">Account status</dt><dd className="mt-1 text-[12px] font-semibold text-[#34352f]">{user?.status || '—'}</dd></div>
            </dl>
          </article>
          <article className="flex flex-col justify-between rounded-[20px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">Training activity</p>
              <h2 className="mt-3 text-[21px] font-bold tracking-[-0.7px] text-[#20231b]">Your assigned sessions are ready.</h2>
              <p className="mt-2 text-[11px] leading-5 text-[#73786a]">Open your assigned workouts, record completed reps and weights, and review your saved sessions.</p>
            </div>
            <Link to={preview ? '/_preview/athlete/workouts' : '/athlete/workouts'} className="mt-6 inline-flex w-fit rounded-full border border-[#d7dfcb] bg-white/70 px-3 py-2 text-[10px] font-bold text-[#526a2e] transition hover:bg-white">View my workouts →</Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
