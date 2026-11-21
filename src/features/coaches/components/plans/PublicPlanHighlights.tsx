import { useTranslation } from 'react-i18next'
import type { CoachPublicPlanSummary } from '../../types/coach.types'
import { formatNumber } from '../../utils/public-plan-format'
import PlanIcon from './PlanIcon'

export function RecommendedPlanBadge({ id }: { id?: string }) {
  const { t } = useTranslation()

  return (
    <span id={id} className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-on-brand">
      <PlanIcon name="star" size={14} />
      {t('plans.recommended')}
    </span>
  )
}

type PlanPricing = Pick<CoachPublicPlanSummary, 'price' | 'compare_at_price' | 'currency'>

export function PublicPlanPrice({ plan }: { plan: PlanPricing }) {
  const { t, i18n } = useTranslation()
  const { price, compare_at_price: originalPrice, currency } = plan
  const unit = currency === 'IRR' ? t('plans.rial') : currency
  const formatPrice = (amount: number) => formatNumber(amount, i18n.language)

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="inline-flex flex-wrap items-baseline gap-x-1.5 font-extrabold tabular-nums text-fg">
        {formatPrice(price)}{unit && <span className="text-sm font-semibold text-fg-secondary">{unit}</span>}
      </span>
      {originalPrice != null && originalPrice > price && (
        <s className="text-xs font-medium text-fg-secondary">
          <span className="sr-only">{t('publicPlan.originalPrice')} </span>
          {formatPrice(originalPrice)} {unit}
        </s>
      )}
    </div>
  )
}
