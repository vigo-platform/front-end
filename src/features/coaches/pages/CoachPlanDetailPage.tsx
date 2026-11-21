import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../../../shared/api/client'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import Skeleton from '../../../shared/components/feedback/Skeleton'
import { useAuth } from '../../auth/context/auth-context'
import CoachPublicLayout from '../components/CoachPublicLayout'
import PlanIcon from '../components/plans/PlanIcon'
import { PublicPlanPrice, RecommendedPlanBadge } from '../components/plans/PublicPlanHighlights'
import { planService } from '../services/plan.service'
import type { CoachPlanField, CoachPublicPlanDetail } from '../types/coach.types'
import { formatNumber, formatPlanDays } from '../utils/public-plan-format'

type PlanResult = { key: string } & (
  | { status: 'ready'; plan: CoachPublicPlanDetail }
  | { status: 'error'; error: unknown }
)

function PlanFieldValues({ fields }: { fields: CoachPlanField[] }) {
  const { i18n } = useTranslation()
  const locale = i18n.language
  const list = new Intl.ListFormat(locale)
  const entries = fields.flatMap((field) => {
    const options = field.selected_options?.map((option) => option.label) ?? []
    const values = options.length > 0 ? options : [field.value].flat()
    const formatted = values.flatMap((value) => {
      if (typeof value === 'number') return [formatNumber(value, locale)]
      return typeof value === 'string' && value.trim() ? [value] : []
    })

    return formatted.length > 0 ? [{ id: field.id, label: field.label, value: list.format(formatted) }] : []
  })

  if (entries.length === 0) return null

  return (
    <dl className="mt-3 divide-y divide-border-default">
      {entries.map(({ id, label, value }) => (
        <div key={id} className="grid gap-1 py-3 text-sm leading-6 sm:grid-cols-2 sm:gap-4">
          <dt className="wrap-break-word text-fg-secondary">{label}</dt>
          <dd className="font-semibold wrap-break-word whitespace-pre-line text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function PlanDetails({ plan }: { plan: CoachPublicPlanDetail }) {
  const { t, i18n } = useTranslation()
  const dayCount = (days: number) => formatPlanDays(days, i18n.language, t)
  const summary = plan.summary?.trim()
  const description = plan.description?.trim()
  const hasDescription = description && description !== summary

  return (
    <article className="space-y-5">
      <header className={`grid items-center gap-7 rounded-3xl border p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] lg:gap-10 ${plan.is_recommended ? 'border-success-border bg-success-surface' : 'border-border-default bg-surface'}`}>
        <div className="min-w-0 space-y-4">
          {plan.is_recommended && <RecommendedPlanBadge />}
          <h1 className="text-3xl leading-tight font-extrabold wrap-break-word sm:text-4xl lg:text-5xl">{plan.title}</h1>
          {summary && <p className="max-w-2xl text-base leading-8 wrap-break-word whitespace-pre-line text-fg-secondary">{summary}</p>}
        </div>

        <div className="min-w-0 space-y-3 rounded-2xl border border-border-default bg-surface-subtle p-5 sm:p-6">
          <dl className="space-y-2">
            <dt className="text-sm font-semibold text-fg-secondary">{t('publicPlan.price')}</dt>
            <dd className="text-2xl sm:text-3xl"><PublicPlanPrice plan={plan} /></dd>
          </dl>
          <dl className="divide-y divide-border-default border-t border-border-default text-sm">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3">
              <dt className="inline-flex items-center gap-2 font-medium text-fg-secondary">
                <PlanIcon name="clock" size={17} />{t('publicPlan.duration')}
              </dt>
              <dd className="font-bold">{dayCount(plan.duration_days)}</dd>
            </div>
            {plan.first_delivery_days != null && (
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-3">
                <dt className="inline-flex items-center gap-2 font-medium text-fg-secondary">
                  <PlanIcon name="details" size={17} />{t('publicPlan.firstDelivery')}
                </dt>
                <dd className="font-bold">{dayCount(plan.first_delivery_days)}</dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      {(hasDescription || plan.includes.length > 0) && (
        <div className={`grid gap-5 ${hasDescription && plan.includes.length > 0 ? 'lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)]' : ''}`}>
          {hasDescription && (
            <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
              <h2 className="text-lg font-bold">{t('publicPlan.about')}</h2>
              <p className="mt-3 text-sm leading-8 wrap-break-word whitespace-pre-line text-fg-secondary">{description}</p>
            </section>
          )}
          {plan.includes.length > 0 && (
            <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
              <h2 className="text-lg font-bold">{t('publicPlan.includes')}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {plan.includes.map((service) => (
                  <li key={service.id} className="flex items-center gap-3 rounded-xl bg-surface-muted px-3.5 py-2.5 text-sm font-semibold wrap-break-word">
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
                      <PlanIcon name="check" size={15} />
                    </span>
                    <span className="min-w-0">{service.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {plan.general_fields.length > 0 && (
        <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
          <h2 className="text-lg font-bold">{t('publicPlan.general')}</h2>
          <PlanFieldValues fields={plan.general_fields} />
        </section>
      )}

      {plan.features.length > 0 && (
        <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
          <h2 className="text-lg font-bold">{t('publicPlan.features')}</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {plan.features.map((feature) => (
              <li key={feature.id} className="min-w-0 rounded-2xl border border-border-default bg-surface-subtle p-4 sm:p-5">
                <h3 className="text-base font-bold wrap-break-word">{feature.label}</h3>
                {feature.description && (
                  <p className="mt-1.5 text-sm leading-7 wrap-break-word whitespace-pre-line text-fg-secondary">{feature.description}</p>
                )}
                <PlanFieldValues fields={feature.fields} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default function CoachPlanDetailPage() {
  const { t, i18n } = useTranslation()
  const { coachId = '', planId = '' } = useParams()
  const { isPreview } = useAuth()
  const coachProfilePath = `${isPreview ? '/_preview/athlete/coaches' : '/coaches'}/${encodeURIComponent(coachId)}`
  const [result, setResult] = useState<PlanResult | null>(null)
  const [attempt, setAttempt] = useState(0)
  const requestKey = JSON.stringify([coachId, planId, i18n.language, attempt])
  const current = result?.key === requestKey ? result : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [coachId, planId])

  useEffect(() => {
    const controller = new AbortController()

    planService.getPublicPlan(coachId, planId, controller.signal).then(
      (plan) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, status: 'ready', plan })
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, status: 'error', error })
      },
    )

    return () => controller.abort()
  }, [coachId, planId, requestKey])

  return (
    <CoachPublicLayout title={t('publicPlan.title')}>
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <Link to={coachProfilePath} className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-fg-secondary hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-success-fg">
          <span className="rotate-180 rtl:rotate-0"><PlanIcon name="arrow" size={18} /></span>
          {t('publicPlan.backToCoach')}
        </Link>

        {!current ? (
          <div role="status" className="grid gap-5 rounded-3xl border border-border-default bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_18rem]">
            <span className="sr-only">{t('common.loading')}</span>
            <div className="space-y-4 self-center">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : current.status === 'ready' ? (
          <PlanDetails plan={current.plan} />
        ) : (
          <section role="alert" className="rounded-3xl border border-border-default bg-surface px-6 py-14 text-center">
            <h1 className="text-xl font-bold">{t('publicPlan.unavailable')}</h1>
            {current.error instanceof ApiError && current.error.status === 404 ? (
              <p className="mt-2 text-sm text-fg-secondary">{t('publicPlan.notFound')}</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-fg-secondary">{getUserErrorMessage(current.error, t, 'publicPlan.loadError')}</p>
                <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-5 cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-on-brand hover:bg-brand-hover">
                  {t('common.tryAgain')}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    </CoachPublicLayout>
  )
}
