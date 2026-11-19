import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { useAuth } from '../../auth/context/auth-context'
import { getAvatarUrl } from '../utils/avatar'
import { coachService } from '../services/coach.service'
import type { CoachProfile } from '../types/coach.types'
import { useTranslation } from 'react-i18next'
import { CoachProfileSkeleton } from '../../../shared/components/feedback/LoadingStates'

function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

function CoachProfilePage() {
  const { t, i18n } = useTranslation()
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
          setError(requestError instanceof Error ? requestError.message : t('ui.Could not load this coach profile.'))
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [coachId, t])

  const avatarUrl = getAvatarUrl(coach?.avatar_url)

  return (
    <CoachPublicLayout title={t("ui.Coach profile")}>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Link to={coachesPath} className="inline-flex text-sm font-medium text-fg-secondary hover:text-fg">
          ← {t('ui.Back to coaches')}
        </Link>

        {isLoading ? (
          <CoachProfileSkeleton />
        ) : error || !coach ? (
          <section role="alert" className="rounded-2xl border border-border-default bg-surface px-6 py-14 text-center">
            <h1 className="text-xl font-semibold">{t("ui.Coach profile unavailable")}</h1>
            <p className="mt-2 text-sm text-fg-secondary">{error || t('ui.This coach profile could not be found.')}</p>
            <Link to={coachesPath} className="mt-5 inline-flex rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-fg-inverse">
              {t("ui.Browse coaches")}
            </Link>
          </section>
        ) : (
          <>
            <section className="rounded-3xl border border-border-default bg-surface p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-24 w-24 shrink-0 rounded-3xl object-cover" />
                ) : (
                  <div aria-hidden="true" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-surface-muted text-3xl font-bold text-fg-secondary">
                    {coach.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[1.6px] text-fg-secondary">{t("ui.Vigo coach")}</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{coach.display_name}</h1>
                  {coach.headline && <p className="mt-2 text-sm text-fg-secondary">{coach.headline}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {coach.specialties.map((item) => (
                      <span key={item} className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-fg-secondary">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-border-default pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-fg-secondary">{t("ui.Experience")}</p>
                  <p className="mt-1 text-lg font-semibold">{formatNumber(coach.experience_years, i18n.language)} {t('ui.years')}</p>
                </div>
                <div>
                  <p className="text-xs text-fg-secondary">{t("ui.Active athletes")}</p>
                  <p className="mt-1 text-lg font-semibold">{coach.active_athletes_count == null ? '—' : formatNumber(coach.active_athletes_count, i18n.language)}</p>
                </div>
                <div>
                  <p className="text-xs text-fg-secondary">{t("ui.Starting plan price")}</p>
                  <p className="mt-1 text-lg font-semibold">{t("ui.Not available yet")}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border-default bg-surface p-6 sm:p-8">
              <h2 className="text-lg font-semibold">{t("ui.About")}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-fg-secondary">{coach.bio}</p>
            </section>

            {coach.certifications && coach.certifications.length > 0 && (
              <section className="rounded-3xl border border-border-default bg-surface p-6 sm:p-8">
                <h2 className="text-lg font-semibold">{t("ui.Certifications")}</h2>
                <ul className="mt-4 space-y-3">
                  {coach.certifications.map((certification, index) => (
                    <li key={certification.title + index} className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold">{certification.title}</p>
                        {certification.issuer && <p className="mt-1 text-xs text-fg-secondary">{certification.issuer}</p>}
                      </div>
                      {certification.year && <span className="text-xs text-fg-secondary">{certification.year}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-8">
              <h2 className="text-base font-semibold">{t("ui.Coaching plans are not available yet")}</h2>
              <p className="mt-2 text-sm leading-6 text-fg-secondary">
                {t("ui.The current User service does not expose plan endpoints. This profile uses only the public coach profile API and does not request placeholder plan data.")}
              </p>
            </section>
          </>
        )}
      </div>
    </CoachPublicLayout>
  )
}

export default CoachProfilePage
