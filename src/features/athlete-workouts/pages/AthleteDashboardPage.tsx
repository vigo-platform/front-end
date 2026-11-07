import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { coachService } from '../../coaches/services/coach.service'
import type { CoachProfile } from '../../coaches/types/coach.types'

interface AthleteDashboardPageProps {
  isPreview?: boolean
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function AthleteDashboardPage({ isPreview = false }: AthleteDashboardPageProps) {
  const { user } = useAuth()
  const [coaches, setCoaches] = useState<CoachProfile[]>([])
  const [totalCoaches, setTotalCoaches] = useState(0)
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true)
  const [coachError, setCoachError] = useState('')

  const displayName = user?.display_name?.trim() || 'Athlete'
  const firstName = displayName.split(/\\s+/)[0]

  useEffect(() => {
    let active = true
    setIsLoadingCoaches(true)
    setCoachError('')

    coachService.search({ page: 0, size: 3, sort: 'newest' })
      .then((page) => {
        if (!active) return
        setCoaches(page.content ?? [])
        setTotalCoaches(page.total_elements ?? 0)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setCoaches([])
        setTotalCoaches(0)
        setCoachError(requestError instanceof Error ? requestError.message : 'Could not load coaches.')
      })
      .finally(() => {
        if (active) setIsLoadingCoaches(false)
      })

    return () => { active = false }
  }, [])

  const uniqueSpecialties = new Set(coaches.flatMap((coach) => coach.specialties ?? [])).size

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
              Explore verified coaches and manage your Vigo account.
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
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Available coaches</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{isLoadingCoaches ? '—' : String(totalCoaches).padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Approved public profiles</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Specialties shown</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{isLoadingCoaches ? '—' : String(uniqueSpecialties).padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Across the coaches loaded</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">Account type</p>
            <p className="mt-4 text-[25px] font-bold tracking-[-0.8px] text-[#20211d]">Athlete</p>
            <p className="mt-1 text-[10px] text-[#898a81]">Your current Vigo role</p>
          </article>
        </section>

        <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#171916] p-7 text-white sm:p-9">
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
              Browse approved coach profiles and compare their experience and specialties.
            </p>
          </div>
          <Link to="/coaches" className="relative mt-8 inline-flex h-11 w-fit items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]">
            Explore coaches <span aria-hidden="true">→</span>
          </Link>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-white/[0.045]">V</span>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">Marketplace</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-[#20211d]">Discover coaches</h2>
              <p className="mt-1 text-[12px] text-[#77786f]">Approved coaches currently available on Vigo.</p>
            </div>
            <Link to="/coaches" className="text-[10px] font-bold text-[#526a2e] hover:underline">View all coaches →</Link>
          </div>

          {coachError ? (
            <div role="alert" className="mt-4 rounded-[18px] border border-[#ead1cd] bg-[#fff8f6] px-6 py-8 text-center">
              <p className="text-[13px] font-semibold text-[#9b5147]">Could not load coaches</p>
              <p className="mt-2 text-[11px] text-[#9b5147]">{coachError}</p>
            </div>
          ) : isLoadingCoaches ? (
            <div className="mt-4 rounded-[18px] border border-[#e1e1da] bg-white px-6 py-8 text-center text-[12px] text-[#77786f]">Loading coaches...</div>
          ) : coaches.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {coaches.map((coach) => (
                <article key={coach.coach_id} className="rounded-[18px] border border-[#e1e1da] bg-white p-5 sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#82975e]">Verified coach</p>
                  <h3 className="mt-2 text-[16px] font-bold tracking-[-0.4px] text-[#20211d]">{coach.display_name}</h3>
                  {coach.headline && <p className="mt-1 text-[11px] text-[#77786f]">{coach.headline}</p>}
                  <p className="mt-3 text-[10px] text-[#77786f]">{coach.experience_years} years of experience</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(coach.specialties ?? []).slice(0, 3).map((specialty) => (
                      <span key={specialty} className="rounded-full bg-[#f0f3e9] px-2.5 py-1 text-[9px] text-[#60783a]">{specialty}</span>
                    ))}
                  </div>
                  <Link to={'/coaches/' + coach.coach_id} className="mt-5 inline-flex text-[10px] font-bold text-[#526a2e] hover:underline">
                    View profile →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-dashed border-[#d9dacf] bg-[#fbfbf8] px-6 py-8 text-center">
              <p className="text-[13px] font-semibold text-[#34352f]">No approved coaches are available yet</p>
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
              <h2 className="mt-3 text-[21px] font-bold tracking-[-0.7px] text-[#20231b]">Workout tracking is coming with the backend API.</h2>
              <p className="mt-2 text-[11px] leading-5 text-[#73786a]">Assigned workouts and result submission are not exposed by the current backend yet. This dashboard does not show demo workouts.</p>
            </div>
            <Link to={isPreview ? '/_preview/athlete/workouts' : '/athlete/workouts'} className="mt-6 inline-flex w-fit rounded-full border border-[#d7dfcb] bg-white/70 px-3 py-2 text-[10px] font-bold text-[#526a2e] transition hover:bg-white">Workout API status →</Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
