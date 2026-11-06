import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { coachService } from '../services/coach.service'
import type { CoachPlan, CoachProfile } from '../types/coach.types'

function formatToman(value: number) {
  return new Intl.NumberFormat('en-US').format(value) + ' Toman'
}

function getAvatarUrl(value?: string | null) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  return baseUrl.replace(/\/$/, '') + value
}

function CoachProfilePage() {
  const { coachId = '' } = useParams()
  const [coach, setCoach] = useState<CoachProfile | null>(null)
  const [plans, setPlans] = useState<CoachPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    Promise.all([
      coachService.getProfile(coachId),
      coachService.getPlans(coachId).catch(() => [] as CoachPlan[]),
    ])
      .then(([profile, activePlans]) => {
        if (!isActive) return
        setCoach(profile)
        setPlans(activePlans)
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(requestError instanceof Error ? requestError.message : 'Could not load this coach profile.')
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [coachId])

  const avatarUrl = getAvatarUrl(coach?.avatar_url)

  return (
    <CoachPublicLayout title="Coach profile">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Link to="/coaches" className="inline-flex text-sm font-medium text-muted hover:text-ink">
          ← Back to coaches
        </Link>

        {isLoading ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center text-sm text-muted" aria-live="polite">
            Loading coach profile...
          </div>
        ) : error || !coach ? (
          <section role="alert" className="rounded-2xl border border-border bg-white px-6 py-14 text-center">
            <h1 className="text-xl font-semibold">Coach profile unavailable</h1>
            <p className="mt-2 text-sm text-muted">{error || 'This coach profile could not be found.'}</p>
            <Link to="/coaches" className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
              Browse coaches
            </Link>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-24 w-24 shrink-0 rounded-3xl object-cover" />
                ) : (
                  <div aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-[#eff5e5] text-3xl font-bold text-[#607b38]">
                    {coach.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[1.6px] text-[#718d43]">Vigo coach</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{coach.display_name}</h1>
                  {coach.headline && <p className="mt-2 text-sm text-muted">{coach.headline}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {coach.specialties.map((item) => (
                      <span key={item} className="rounded-full bg-[#f0f5e8] px-3 py-1.5 text-xs font-semibold text-[#607b38]">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">Experience</p>
                  <p className="mt-1 text-lg font-semibold">{coach.experience_years} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Active athletes</p>
                  <p className="mt-1 text-lg font-semibold">{coach.active_athletes_count ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Starting plan price</p>
                  <p className="mt-1 text-lg font-semibold">
                    {coach.min_plan_price == null ? 'Not listed' : formatToman(coach.min_plan_price)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{coach.bio}</p>
            </section>

            {coach.certifications && coach.certifications.length > 0 && (
              <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <h2 className="text-lg font-semibold">Certifications</h2>
                <ul className="mt-4 space-y-3">
                  {coach.certifications.map((certification, index) => (
                    <li key={certification.title + index} className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold">{certification.title}</p>
                        {certification.issuer && <p className="mt-1 text-xs text-muted">{certification.issuer}</p>}
                      </div>
                      {certification.year && <span className="text-xs text-muted">{certification.year}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Coaching plans</h2>
                <p className="mt-1 text-sm text-muted">Active plans published by this coach.</p>
              </div>

              {plans.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-10 text-center text-sm text-muted">
                  No active plans are currently listed.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {plans.map((plan) => (
                    <article key={plan.plan_id} className="rounded-2xl border border-border bg-white p-5">
                      <h3 className="text-base font-semibold">{plan.title}</h3>
                      {plan.description && <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>}
                      <div className="mt-5 flex items-end justify-between gap-3 border-t border-border pt-4">
                        <div>
                          <p className="text-xs text-muted">Duration</p>
                          <p className="mt-1 text-sm font-semibold">{plan.duration_days} days</p>
                        </div>
                        <p className="text-sm font-semibold">{formatToman(plan.price)}</p>
                      </div>
                      {plan.includes && plan.includes.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {plan.includes.map((item) => (
                            <span key={item} className="rounded-full bg-canvas px-3 py-1 text-[11px] font-medium text-muted">
                              {item.replaceAll('_', ' ').toLowerCase()}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </CoachPublicLayout>
  )
}

export default CoachProfilePage
