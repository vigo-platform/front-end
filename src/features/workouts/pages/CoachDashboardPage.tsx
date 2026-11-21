import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { previewCoachPlans, previewCoachRelations } from '../../auth/data/dashboard-preview'
import { loadWorkoutDraft } from '../services/workout-draft.service'
import { planService } from '../../coaches/services/plan.service'
import type { ManagedCoachPlan } from '../../coaches/types/coach.types'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { useTranslation } from 'react-i18next'
import CoachAthletesPanel from '../../relationships/components/CoachAthletesPanel'

interface CoachDashboardPageProps {
  isPreview?: boolean
}

function formatNumber(value: number, locale = 'en') {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
}

function formatCurrency(value: number, currency: string, locale = 'en') {
  try {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${formatNumber(value, locale)} ${currency}`
  }
}

interface DashboardPlan {
  id: string | number
  title: string
  summary: string | null
  description: string | null
  price: number
  compareAtPrice: number | null
  currency: string
  durationDays: number
  isActive: boolean
  isArchived: boolean
  features: Array<{ id: number; label: string }>
  includes: string[]
  createdAt?: string
}

function formatDate(value?: string | null, locale = 'en') {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', { month: 'short', year: 'numeric' }).format(date)
}

function CoachDashboardPage({ isPreview = false }: CoachDashboardPageProps) {
  const { t, i18n } = useTranslation()
  const { user, accessToken, isPreview: previewContext } = useAuth()
  const preview = Boolean(isPreview || previewContext)
  const coachPath = preview ? '/_preview/coach' : '/coach'
  const firstName = user?.display_name?.trim().split(/\s+/)[0] || t('ui.Coach')
  const draft = loadWorkoutDraft()
  const activeAthletes = preview ? previewCoachRelations.filter((item) => item.status === 'ACTIVE') : []
  const [athleteCount, setAthleteCount] = useState<number | null>(preview ? activeAthletes.length : null)
  const [plans, setPlans] = useState<ManagedCoachPlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(!preview)
  const [planError, setPlanError] = useState('')

  useEffect(() => {
    if (preview || !accessToken) return

    let active = true

    Promise.resolve()
      .then(() => {
        if (!active) return undefined
        setIsLoadingPlans(true)
        setPlanError('')
        setPlans([])
        return planService.getMyPlans(accessToken)
      })
      .then((result) => {
        if (active && result) setPlans(result)
      })
      .catch((error: unknown) => {
        if (!active) return
        setPlans([])
        setPlanError(getUserErrorMessage(error, t, 'errors.loadData'))
      })
      .finally(() => {
        if (active) setIsLoadingPlans(false)
      })

    return () => { active = false }
  }, [accessToken, preview, t])

  const visiblePlanError = preview || !accessToken ? '' : planError
  const visibleIsLoadingPlans = !preview && Boolean(accessToken) && isLoadingPlans
  const displayPlans: DashboardPlan[] = preview
    ? previewCoachPlans.map((plan) => ({
        id: plan.plan_id,
        title: plan.title,
        summary: null,
        description: plan.description,
        price: plan.price,
        compareAtPrice: null,
        currency: 'IRR',
        durationDays: plan.duration_days,
        isActive: plan.status === 'ACTIVE',
        isArchived: false,
        features: [],
        includes: [...plan.includes],
      }))
    : plans.map((plan) => ({
        id: plan.planId,
        title: plan.title,
        summary: plan.summary,
        description: plan.description,
        price: plan.price,
        compareAtPrice: plan.compareAtPrice,
        currency: plan.currency,
        durationDays: plan.durationDays,
        isActive: plan.isActive,
        isArchived: plan.isArchived,
        features: plan.features,
        includes: plan.includes,
        createdAt: plan.createdAt,
      }))
  const activePlans = displayPlans.filter((plan) => plan.isActive && !plan.isArchived)
  const archivedPlansCount = displayPlans.filter((plan) => plan.isArchived).length

  return (
    <AppShell title={t("ui.Overview")}>
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-fg-secondary">{t("ui.Coach workspace")}</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-fg sm:text-[42px]">
              {t('ui.Welcome back, {{name}}.', { name: firstName })}
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-fg-secondary">{t("ui.Your athletes, coaching plans, and content workspace.")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-success-border bg-success-surface px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-success-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-hover" />{t('ui.' + (user?.status || 'Status unavailable'))}
            </span>
            <span className="rounded-full border border-border-default bg-surface px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[1px] text-fg-secondary">
              {t('ui.Member since')} {formatDate(user?.created_at, i18n.language)}
            </span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[18px] border border-border-default bg-surface p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Athlete relationships")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{athleteCount === null ? '—' : formatNumber(athleteCount, i18n.language)}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Coach relationships")}</p>
          </article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Active plans")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{visibleIsLoadingPlans ? t('ui.Loading...') : visiblePlanError ? '—' : formatNumber(activePlans.length, i18n.language)}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Published coaching plans")}</p>
          </article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Workout draft")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{formatNumber(draft.exercises.length, i18n.language)}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Exercises in this browser")}</p>
          </article>
          <article className="rounded-[18px] border border-border-default bg-surface p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Account role")}</p>
            <p className="mt-4 text-[25px] font-bold tracking-[-0.8px] text-fg">{t("ui.Coach")}</p>
            <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Your current Vigo role")}</p>
          </article>
        </section>

        <section className="relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[22px] bg-sidebar p-7 text-sidebar-fg sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-[330px] w-[330px] rounded-full border-[48px] border-sidebar-fg/[0.04]" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-sidebar-active">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />{t("ui.Your coaching workspace")}
            </span>
            <h2 className="mt-6 max-w-lg text-[29px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[36px]">{t("ui.Build a better plan for every athlete.")}</h2>
            <p className="mt-3 max-w-md text-[12px] leading-6 text-sidebar-fg/60">{t("ui.Organize your exercise resources and prepare structured workout drafts for your coaching workflow.")}</p>
          </div>
          <Link to={coachPath + '/workouts/new'} className="relative mt-8 inline-flex h-11 w-fit items-center gap-3 rounded-full bg-brand px-5 text-[11px] font-bold text-on-brand transition hover:bg-brand-hover">
            {t("ui.Create workout draft")} <span aria-hidden="true">→</span>
          </Link>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-sidebar-fg/[0.045]">V</span>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <CoachAthletesPanel accessToken={accessToken} preview={preview} onTotalChange={setAthleteCount} />

          <article className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Plan management")}</p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t("ui.Your plans")}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold text-fg-muted">
                {!preview && <Link to="/coach/plans" className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-on-brand hover:bg-brand-hover">{t('plans.manage')}</Link>}
                <span>{t("ui.{{count}} total plans", { count: displayPlans.length })}</span>
                <span className="rounded-full bg-success-surface px-2.5 py-1 text-success-fg">
                  {t("ui.{{count}} active", { count: activePlans.length })}
                </span>
                {archivedPlansCount > 0 && (
                  <span className="rounded-full bg-surface-muted px-2.5 py-1">
                    {t("ui.{{count}} archived", { count: archivedPlansCount })}
                  </span>
                )}
              </div>
            </div>
            {visiblePlanError ? (
              <div role="alert" className="mt-5 rounded-xl border border-danger-border bg-danger-surface px-5 py-6 text-center">
                <p className="text-[12px] font-semibold text-danger-fg">{t('errors.loadData')}</p>
                <p className="mt-1 text-[10px] text-danger-fg">{visiblePlanError}</p>
              </div>
            ) : visibleIsLoadingPlans ? (
              <div className="mt-5 rounded-xl border border-border-default bg-surface-subtle px-5 py-7 text-center text-[11px] text-fg-muted">
                {t('ui.Loading...')}
              </div>
            ) : displayPlans.length > 0 ? (
              <div className="mt-5 space-y-3">
                {displayPlans.map((plan) => {
                  const statusLabel = plan.isArchived ? 'ARCHIVED' : plan.isActive ? 'ACTIVE' : 'INACTIVE'
                  const planFeatures = [
                    ...plan.features.map((feature) => feature.label),
                    ...plan.includes,
                  ]
                  return (
                    <div key={plan.id} className="rounded-xl border border-border-default bg-surface-subtle p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-bold text-fg">{plan.title}</h3>
                          {(plan.summary || plan.description) && (
                            <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-fg-muted">
                              {plan.summary || plan.description}
                            </p>
                          )}
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide ${
                          plan.isArchived
                            ? 'bg-surface-muted text-fg-muted'
                            : plan.isActive
                              ? 'bg-success-surface text-success-fg'
                              : 'bg-warning-surface text-warning-fg'
                        }`}>
                          {t(`ui.${statusLabel}`)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-fg-secondary">
                        <span>{formatCurrency(plan.price, plan.currency, i18n.language)}</span>
                        {plan.compareAtPrice != null && plan.compareAtPrice > plan.price && (
                          <span className="text-fg-muted line-through">
                            {formatCurrency(plan.compareAtPrice, plan.currency, i18n.language)}
                          </span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{t('ui.{{count}} days', { count: formatNumber(plan.durationDays, i18n.language) })}</span>
                        {plan.createdAt && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{t('ui.Created')} {formatDate(plan.createdAt, i18n.language)}</span>
                          </>
                        )}
                      </div>
                      {planFeatures.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {planFeatures.map((feature, index) => (
                            <li key={feature + index} className="rounded-full border border-border-default bg-surface px-2.5 py-1 text-[9px] text-fg-secondary">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-7 text-center">
                <p className="text-[12px] font-semibold text-fg">{t("ui.No coaching plans yet")}</p>
                <p className="mt-1 text-[10px] text-fg-muted">{t("ui.Create your first coaching plan to manage it here.")}</p>
              </div>
            )}
          </article>
        </section>

        <section>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Workspace tools")}</p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-fg">{t("ui.Create and organize")}</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link to={coachPath + '/exercises'} className="group rounded-[18px] border border-border-default bg-surface p-5 transition hover:-translate-y-1 hover:border-success-border hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-fg-muted">{t('ui.01 / LIBRARY')}</span>
              <h3 className="mt-5 text-[15px] font-bold text-fg">{t("ui.Exercise library")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-fg-secondary">{t("ui.Browse the current exercise interface and sample movement catalog.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-success-fg group-hover:gap-3">{t('ui.Open library →')}</span>
            </Link>
            <Link to={coachPath + '/workouts/new'} className="group rounded-[18px] border border-border-default bg-surface p-5 transition hover:-translate-y-1 hover:border-success-border hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-fg-muted">{t('ui.02 / BUILDER')}</span>
              <h3 className="mt-5 text-[15px] font-bold text-fg">{t("ui.Workout builder")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-fg-secondary">{t("ui.Arrange exercises, sets, reps, and rest periods in a local draft.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-success-fg group-hover:gap-3">{t('ui.Build a workout →')}</span>
            </Link>
            <Link to={coachPath + '/workouts'} className="group rounded-[18px] border border-border-default bg-surface p-5 transition hover:-translate-y-1 hover:border-success-border hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-fg-muted">{t('ui.03 / DRAFTS')}</span>
              <h3 className="mt-5 text-[15px] font-bold text-fg">{t("ui.My workouts")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-fg-secondary">{t("ui.Continue editing workout drafts saved in this browser.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-success-fg group-hover:gap-3">{t('ui.View drafts →')}</span>
            </Link>
          </div>
        </section>

        <section className="rounded-[20px] border border-border-default bg-surface-muted p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-success-fg">{t('ui.Account')}</p>
              <h2 className="mt-2 text-[17px] font-bold text-fg">{user?.display_name || t('ui.Coach profile')}</h2>
              <p className="mt-1 text-[11px] text-fg-muted">{user?.email || t('ui.Email not available')} · {user?.phone || t('ui.No phone number')}</p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-success-border bg-surface/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[1px] text-success-fg">{t('ui.' + (user?.status || 'Status unavailable'))}</span>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

export default CoachDashboardPage
