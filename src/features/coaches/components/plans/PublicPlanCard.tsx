import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { CoachPublicPlanSummary } from '../../types/coach.types'
import { formatPlanDays } from '../../utils/public-plan-format'
import PlanIcon from './PlanIcon'
import { PublicPlanPrice, RecommendedPlanBadge } from './PublicPlanHighlights'

export default function PublicPlanCard({ plan, to }: { plan: CoachPublicPlanSummary; to: string }) {
  const { t, i18n } = useTranslation()
  const titleId = useId()
  const badgeId = plan.is_recommended ? `${titleId}-recommended` : undefined

  return (
    <Link
      to={to}
      aria-labelledby={titleId}
      aria-describedby={badgeId}
      className={`group flex h-full min-w-0 flex-col rounded-2xl border p-5 motion-safe:transition hover:border-success-fg hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-success-fg ${plan.is_recommended ? 'border-success-border bg-success-surface' : 'border-border-default bg-surface-subtle'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <h3 id={titleId} className="min-w-0 text-lg font-bold wrap-break-word">{plan.title}</h3>
        {plan.is_recommended && <RecommendedPlanBadge id={badgeId} />}
      </div>
      {plan.summary && <p className="mt-2 text-sm leading-6 wrap-break-word text-fg-secondary">{plan.summary}</p>}
      {plan.features.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {plan.features.map((feature) => (
            <li key={feature.id} className="rounded-full border border-border-default bg-surface px-3 py-1 text-xs wrap-break-word text-fg-secondary">
              {feature.label}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border-default pt-4">
          <div className="min-w-0">
            <div className="text-xl"><PublicPlanPrice plan={plan} /></div>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-fg-secondary">
              <PlanIcon name="clock" size={14} />
              {formatPlanDays(plan.duration_days, i18n.language, t)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-success-fg group-hover:underline group-focus-visible:underline">
            {t('publicPlan.viewDetails')}
            <span className="rtl:rotate-180"><PlanIcon name="arrow" size={17} /></span>
          </span>
        </div>
      </div>
    </Link>
  )
}
