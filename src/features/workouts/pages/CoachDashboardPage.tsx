import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { previewCoachPlans, previewCoachRelations } from '../../auth/data/dashboard-preview'
import { loadWorkoutDraft } from '../services/workout-draft.service'
import { planService } from '../../coaches/services/plan.service'
import type { CoachOwnedPlanSummary } from '../../coaches/types/coach.types'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { useTranslation } from 'react-i18next'

interface CoachDashboardPageProps {
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

function CoachDashboardPage({ isPreview = false }: CoachDashboardPageProps) {
  const { t, i18n } = useTranslation()
  const { user, accessToken, isPreview: previewContext } = useAuth()
  const preview = isPreview || previewContext
  const coachPath = preview ? '/_preview/coach' : '/coach'
  const firstName = user?.display_name?.trim().split(/\s+/)[0] || t('ui.Coach')
  const draft = loadWorkoutDraft()
  const activeAthletes = preview ? previewCoachRelations.filter((item) => item.status === 'ACTIVE') : []
  const [plans, setPlans] = useState<CoachOwnedPlanSummary[]>([])
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
  const activePlans = preview
    ? previewCoachPlans.filter((item) => item.status === 'ACTIVE')
    : accessToken ? plans.filter((item) => item.is_active && !item.is_archived) : []

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
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Active athletes")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-fg">{preview ? formatNumber(activeAthletes.length, i18n.language) : '—'}</p>
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
          <article className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Relationships")}</p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t("ui.Your athletes")}</h2>
              </div>
              <span className="text-[9px] font-semibold text-fg-muted">{preview ? activeAthletes.length + ' ' + t('ui.active') : t('ui.Not connected')}</span>
            </div>
            {preview ? (
              <div className="mt-5 divide-y divide-border-default">
                {activeAthletes.map((relation) => (
                  <div key={relation.relation_id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-bold text-success-fg">
                      {relation.athlete_name.split(/\s+/).map((part: string) => part[0]).slice(0, 2).join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-fg">{relation.athlete_name}</p>
                      <p className="mt-1 truncate text-[10px] text-fg-muted">{relation.plan_title}</p>
                    </div>
                    <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.8px] text-success-fg">{t('ui.ACTIVE')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-7 text-center">
                <p className="text-[12px] font-semibold text-fg">{t("ui.Athlete relationships will appear here")}</p>
                <p className="mt-1 text-[10px] text-fg-muted">{t("ui.The current backend does not expose coach–athlete relationship endpoints.")}</p>
              </div>
            )}
          </article>

          <article className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t("ui.Published content")}</p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t("ui.Your plans")}</h2>
              </div>
              <span className="text-[9px] font-semibold text-fg-muted">{visibleIsLoadingPlans ? t('ui.Loading...') : visiblePlanError ? t('ui.Unavailable') : activePlans.length + ' ' + t('ui.active')}</span>
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
            ) : activePlans.length > 0 ? (
              <div className="mt-5 space-y-3">
                {activePlans.map((plan) => (
                  <div key={'plan_id' in plan ? plan.plan_id : plan.id} className="rounded-xl bg-surface-subtle p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[12px] font-bold text-fg">{plan.title}</h3>
                      <span className="rounded-full bg-surface px-2 py-1 text-[8px] font-bold uppercase text-success-fg">{t('ui.ACTIVE')}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-5 text-fg-muted">{'description' in plan ? plan.description : plan.summary}</p>
                    <p className="mt-3 text-[10px] font-semibold text-success-fg">{formatNumber(plan.duration_days, i18n.language)} {t('ui.days')} · {new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US').format(plan.price)} {i18n.language === 'fa' ? 'تومان' : 'Toman'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-7 text-center">
                <p className="text-[12px] font-semibold text-fg">{t("ui.Your published plans will appear here")}</p>
                <p className="mt-1 text-[10px] text-fg-muted">{t("ui.No active coaching plans are available right now.")}</p>
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
