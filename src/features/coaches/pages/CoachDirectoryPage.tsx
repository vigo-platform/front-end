import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { useAuth } from '../../auth/context/auth-context'
import { getAvatarUrl } from '../utils/avatar'
import { coachService } from '../services/coach.service'
import type { CoachDirectoryPage } from '../types/coach.types'
import { useTranslation } from 'react-i18next'
import { CoachDirectorySkeleton } from '../../../shared/components/feedback/LoadingStates'
import { getUserErrorMessage } from '../../../shared/api/user-error'

const pageSize = 12

function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

function formatPrice(value: number, currency: string | null, locale = 'en') {
  const formattedValue = formatNumber(value, locale)
  return currency ? `${formattedValue} ${currency}` : formattedValue
}

function CoachDirectoryPage() {
  const { t, i18n } = useTranslation()
  const { isPreview } = useAuth()
  const coachesPath = isPreview ? '/_preview/athlete/coaches' : '/coaches'
  const [page, setPage] = useState<CoachDirectoryPage | null>(null)
  const [requestedPage, setRequestedPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadPage(pageNumber: number) {
    setRequestedPage(pageNumber)
    setIsLoading(true)
    setError('')

    try {
      const result = await coachService.search({ page: pageNumber, size: pageSize })
      setPage(result)
    } catch (requestError) {
      setError(getUserErrorMessage(requestError, t, 'errors.loadCoaches'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    coachService.search({ page: 0, size: pageSize })
      .then((result) => {
        if (isActive) setPage(result)
      })
      .catch((requestError: unknown) => {
        if (isActive) {
          setError(getUserErrorMessage(requestError, t, 'errors.loadCoaches'))
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [t])

  return (
    <CoachPublicLayout title={t('ui.Discover coaches')}>
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[1.7px] text-success-fg">{t('ui.Find your coach')}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t('ui.Discover coaches')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted">
            {t('ui.Explore approved coach profiles, compare their specialties, and find a coaching style that fits your goals.')}
          </p>
        </section>

        {error && (
          <section role="alert" className="rounded-2xl border border-danger-border bg-danger-surface p-5">
            <p className="text-sm font-semibold text-danger-fg">{t('ui.Could not load coaches')}</p>
            <button
              type="button"
              onClick={() => void loadPage(requestedPage)}
              className="mt-3 text-sm font-semibold text-danger-fg underline"
            >
              {t('ui.Try again')}
            </button>
          </section>
        )}

        {isLoading ? (
          <CoachDirectorySkeleton count={6} />
        ) : !error && page?.content.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-16 text-center">
            <h2 className="font-semibold">{t('ui.No coaches found')}</h2>
          </div>
        ) : !error && page ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-fg-muted">
                {t('ui.{{count}} coaches found', { count: formatNumber(page.totalElements, i18n.language) })}
              </p>
              <p className="text-xs text-fg-muted">{t('ui.Only approved and active coaches are listed.')}</p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {page.content.map((coach) => {
                const avatarUrl = getAvatarUrl(coach.avatarUrl)
                const startingPrice = coach.minPlanPrice ?? coach.price

                return (
                  <article
                    key={coach.coachId}
                    className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-border-default bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
                  >
                    <div aria-hidden="true" className="h-2 bg-gradient-to-r from-brand via-success-fg to-brand/40" />
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 rounded-2xl bg-brand/10 p-1 ring-1 ring-brand/15">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-xl object-cover" />
                          ) : (
                            <div aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-muted text-2xl font-bold text-success-fg">
                              {coach.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-success-surface px-2.5 py-1 text-[10px] font-semibold text-success-fg">
                              {t('ui.Approved')}
                            </span>
                          </div>
                          <h2 className="truncate text-lg font-bold tracking-tight text-fg">{coach.displayName}</h2>
                          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-fg-muted">
                            {coach.headline || coach.specialties.join(' · ') || t('ui.Coach')}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-fg-secondary">
                        {coach.bio || '—'}
                      </p>

                      <div className="mt-4 flex min-h-8 flex-wrap gap-2">
                        {coach.specialties.slice(0, 3).map((item) => (
                          <span key={item} className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-[11px] font-medium text-fg-secondary">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border-default pt-4">
                        <div>
                          <p className="text-[11px] text-fg-muted">{t('ui.Experience')}</p>
                          <p className="mt-1 text-sm font-semibold text-fg">
                            {formatNumber(coach.experienceYears, i18n.language)} {t('ui.years')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-fg-muted">{t('ui.Starting from')}</p>
                          <p className="mt-1 text-sm font-semibold text-fg">
                            {startingPrice == null
                              ? t('ui.Not listed')
                              : formatPrice(startingPrice, coach.currency, i18n.language)}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={coachesPath + '/' + coach.coachId}
                        className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-fg px-5 text-xs font-semibold text-fg-inverse transition hover:bg-brand hover:text-on-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {t('ui.View profile')}
                        <span aria-hidden="true" className="ms-2 transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </article>
                )
              })}
            </section>

            {page.totalPages > 1 && (
              <nav aria-label={t('ui.Coach directory pages')} className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  disabled={page.page <= 0 || isLoading}
                  onClick={() => void loadPage(page.page - 1)}
                  className="rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('ui.Previous')}
                </button>
                <span className="text-sm text-fg-muted">
                  {t('ui.Page')} {page.page + 1} {t('ui.of')} {page.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page.page + 1 >= page.totalPages || isLoading}
                  onClick={() => void loadPage(page.page + 1)}
                  className="rounded-full border border-border-default bg-surface px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('ui.Next')}
                </button>
              </nav>
            )}
          </>
        ) : null}
      </div>
    </CoachPublicLayout>
  )
}

export default CoachDirectoryPage
