import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { useAuth } from '../../auth/context/auth-context'
import { getAvatarUrl } from '../utils/avatar'
import { coachService } from '../services/coach.service'
import type { CoachProfile } from '../types/coach.types'

function CoachProfilePage() {
  const { coachId = '' } = useParams()
  const { isPreview } = useAuth()
  const coachesPath = isPreview ? '/_preview/athlete/coaches' : '/coaches'
  const [coach, setCoach] = useState<CoachProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    coachService.getProfile(coachId)
      .then((profile) => {
        if (isActive) setCoach(profile)
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
        <Link to={coachesPath} className="inline-flex text-sm font-medium text-muted hover:text-ink">
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
            <Link to={coachesPath} className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
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
                  <p className="mt-1 text-lg font-semibold">Not available yet</p>
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

            <section className="rounded-2xl border border-dashed border-border bg-white px-6 py-8">
              <h2 className="text-base font-semibold">Coaching plans are not available yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                The current User service does not expose plan endpoints. This profile uses only the public coach profile API and does not request placeholder plan data.
              </p>
            </section>
          </>
        )}
      </div>
    </CoachPublicLayout>
  )
}

export default CoachProfilePage
