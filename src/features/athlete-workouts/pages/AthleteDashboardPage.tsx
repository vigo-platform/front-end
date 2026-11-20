import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { coachService } from '../../coaches/services/coach.service'
import type { CoachDirectoryItem } from '../../coaches/types/coach.types'
import { useTranslation } from 'react-i18next'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import Skeleton from '../../../shared/components/feedback/Skeleton'
import { CoachDirectorySkeleton } from '../../../shared/components/feedback/LoadingStates'
import MyCoachesPanel from '../../relationships/components/MyCoachesPanel'

interface AthleteDashboardPageProps {
  isPreview?: boolean
}

function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

function formatDate(value?: string | null, locale = 'en') {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', { month: 'short', year: 'numeric' }).format(date)
}

function AthleteDashboardPage({ isPreview = false }: AthleteDashboardPageProps) {
  const { t, i18n } = useTranslation()
  const { user, accessToken, isPreview: previewContext } = useAuth()
  const preview = Boolean(isPreview || previewContext)
  const [coaches, setCoaches] = useState<CoachDirectoryItem[]>([])
  const [totalCoaches, setTotalCoaches] = useState(0)
  const [isLoadingCoaches, setIsLoadingCoaches] = useState(true)
  const [coachError, setCoachError] = useState('')

  const displayName = user?.display_name?.trim() || t('ui.Athlete')
  const firstName = displayName.split(/\\s+/)[0]

  useEffect(() => {
    let active = true
    coachService.search({ page: 0, size: 3 })
      .then((page) => {
        if (!active) return
        setCoaches(page.content ?? [])
        setTotalCoaches(page.totalElements ?? 0)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setCoaches([])
        setTotalCoaches(0)
        setCoachError(getUserErrorMessage(requestError, t, 'errors.loadCoaches'))
      })
      .finally(() => {
        if (active) setIsLoadingCoaches(false)
      })

    return () => { active = false }
  }, [t])

  const uniqueSpecialties = new Set(coaches.flatMap((coach) => coach.specialties ?? [])).size

  return (
    <AppShell title={t("ui.Overview")}>
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-fg-secondary">{t("ui.Athlete space")}</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-fg sm:text-[42px]">
              {t('ui.Good morning, {{name}}.', { name: firstName })}
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-fg-secondary">
              {t('ui.Explore verified coaches and manage your Vigo account.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-success-border bg-success-surface px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-success-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-hover" />
              {t('ui.' + (user?.status || 'Status unavailable'))}
            </span>
            <span className="rounded-full border border-border-default bg-surface px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[1px] text-fg-secondary">
              {t('ui.Member since')} {formatDate(user?.created_at, i18n.language)}
            </span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-[18px] border border-border-default bg-surface p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Available coaches")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{isLoadingCoaches ? <Skeleton className="h-9 w-20" /> : formatNumber(totalCoaches, i18n.language)}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Approved public profiles")}</p>
          </article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Specialties shown")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{isLoadingCoaches ? <Skeleton className="h-9 w-20" /> : formatNumber(uniqueSpecialties, i18n.language)}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Across the coaches loaded")}</p>
          </article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5 sm:p-6">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Account type")}</p>
            <p className="mt-4 text-[25px] font-bold tracking-[-0.8px] text-fg">{t("ui.Athlete")}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Your current Vigo role")}</p>
          </article>
        </section>

        <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[22px] bg-sidebar p-7 text-sidebar-fg sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-[330px] w-[330px] rounded-full border-[48px] border-sidebar-fg/[0.04]" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-sidebar-active">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {t("ui.Your next step")}
            </span>
            <h2 className="mt-6 max-w-lg text-[29px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[36px]">
              {t("ui.Find the coach who moves you forward.")}
            </h2>
            <p className="mt-3 max-w-md text-[12px] leading-6 text-sidebar-fg/60">
              {t("ui.Browse approved coach profiles and compare their experience and specialties.")}
            </p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link to="/coaches" className="inline-flex h-11 w-fit items-center gap-3 rounded-full bg-brand px-5 text-[11px] font-bold text-on-brand transition hover:bg-brand-hover">{t("ui.Explore coaches")} <span aria-hidden="true">→</span></Link>
            <Link to="/plans" className="inline-flex h-11 w-fit items-center gap-3 rounded-full border border-sidebar-fg/20 px-5 text-[11px] font-bold text-sidebar-fg transition hover:bg-sidebar-fg/10">{t("planMarketplace.browsePlans")}</Link>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-sidebar-fg/[0.045]">V</span>
        </section>

        <MyCoachesPanel accessToken={accessToken} preview={preview} />

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Marketplace")}</p>
              <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-fg">{t("ui.Discover coaches")}</h2>
              <p className="mt-1 text-[12px] text-fg-secondary">{t("ui.Approved coaches currently available on Vigo.")}</p>
            </div>
            <Link to="/coaches" className="text-[10px] font-bold text-success-fg hover:underline">{t('ui.View all coaches →')}</Link>
          </div>

          {coachError ? (
            <div role="alert" className="mt-4 rounded-[18px] border border-danger-border bg-danger-surface px-6 py-8 text-center">
              <p className="text-[13px] font-semibold text-danger-fg">{t("ui.Could not load coaches")}</p>
              <p className="mt-2 text-[11px] text-danger-fg">{coachError}</p>
            </div>
          ) : isLoadingCoaches ? (
            <div className="mt-4"><CoachDirectorySkeleton count={3} /></div>
          ) : coaches.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {coaches.map((coach) => (
                <article key={coach.coachId} className="rounded-[18px] border border-border-default bg-surface p-5 sm:p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[1px] text-fg-secondary">{t("ui.Verified coach")}</p>
                  <h3 className="mt-2 text-[16px] font-bold tracking-[-0.4px] text-fg">{coach.displayName}</h3>
                  {coach.headline && <p className="mt-1 text-[11px] text-fg-secondary">{coach.headline}</p>}
                  <p className="mt-3 text-[10px] text-fg-secondary">{formatNumber(coach.experienceYears, i18n.language)} {t('ui.years of experience')}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(coach.specialties ?? []).slice(0, 3).map((specialty) => (
                      <span key={specialty} className="rounded-full bg-surface-muted px-2.5 py-1 text-[9px] text-success-fg">{specialty}</span>
                    ))}
                  </div>
                  <Link to={'/coaches/' + coach.coachId} className="mt-5 inline-flex text-[10px] font-bold text-success-fg hover:underline">
                    {t('ui.View profile →')}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-dashed border-border-default bg-surface-subtle px-6 py-8 text-center">
              <p className="text-[13px] font-semibold text-fg">{t("ui.No approved coaches are available yet")}</p>
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Account details")}</p>
            <h2 className="mt-2 text-[18px] font-bold tracking-[-0.5px]">{t("ui.Your information")}</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="min-w-0"><dt className="text-[10px] text-fg-muted">{t("ui.Full name")}</dt><dd className="mt-1 truncate text-[12px] font-semibold text-fg">{user?.display_name || '—'}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-fg-muted">{t("ui.Email address")}</dt><dd className="mt-1 break-all text-[12px] font-semibold text-fg">{user?.email || '—'}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-fg-muted">{t("ui.Phone")}</dt><dd className="mt-1 text-[12px] font-semibold text-fg">{user?.phone || t('ui.Not provided')}</dd></div>
              <div className="min-w-0"><dt className="text-[10px] text-fg-muted">{t("ui.Account status")}</dt><dd className="mt-1 text-[12px] font-semibold text-fg">{user?.status ? t('ui.' + user.status) : '—'}</dd></div>
            </dl>
          </article>
          <article className="flex flex-col justify-between rounded-[20px] border border-border-default bg-surface-muted p-6 sm:p-7">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-success-fg">{t("ui.Training activity")}</p>
              <h2 className="mt-3 text-[21px] font-bold tracking-[-0.7px] text-fg">{t("ui.Workout tracking is coming with the backend API.")}</h2>
              <p className="mt-2 text-[11px] leading-5 text-fg-muted">{t("ui.Assigned workouts and result submission are not exposed by the current backend yet. This dashboard does not show demo workouts.")}</p>
            </div>
            <Link to={isPreview ? '/_preview/athlete/workouts' : '/athlete/workouts'} className="mt-6 inline-flex w-fit rounded-full border border-success-border bg-surface/70 px-3 py-2 text-[10px] font-bold text-success-fg transition hover:bg-surface">{t('ui.Workout API status →')}</Link>
          </article>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteDashboardPage
