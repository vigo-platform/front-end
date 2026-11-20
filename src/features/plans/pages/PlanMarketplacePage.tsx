import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CoachPublicLayout from '../../coaches/components/CoachPublicLayout'
import { planCatalogService } from '../services/plan-catalog.service'
import type { PublicPlanPage } from '../types/plan.types'

const PAGE_SIZE = 12

function formatPrice(value: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(value)
    return `${formatted} ${currency}`
  }
}

function PlanMarketplacePage() {
  const { t, i18n } = useTranslation()
  const [result, setResult] = useState<PublicPlanPage | null>(null)
  const [pageNumber, setPageNumber] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    planCatalogService.getPublicPlans({ page: pageNumber, size: PAGE_SIZE })
      .then((response) => {
        if (active) setResult(response)
      })
      .catch(() => {
        if (active) setError(t('planMarketplace.loadError'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [pageNumber, reloadKey, t])

  const plans = result?.content.filter((plan) => plan.status === 'ACTIVE') ?? []

  return (
    <CoachPublicLayout title={t('planMarketplace.title')}>
      <div className="mx-auto w-full max-w-5xl space-y-7">
        <section className="rounded-3xl bg-sidebar px-6 py-9 text-sidebar-fg sm:px-9 sm:py-12">
          <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-sidebar-active">{t('planMarketplace.eyebrow')}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{t('planMarketplace.title')}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-sidebar-fg/65">{t('planMarketplace.description')}</p>
        </section>

        {error ? (
          <div role="alert" className="rounded-2xl border border-danger-border bg-danger-surface px-6 py-8 text-center">
            <p className="text-sm font-semibold text-danger-fg">{error}</p>
            <button type="button" onClick={() => setReloadKey((value) => value + 1)} className="mt-4 rounded-full bg-fg px-4 py-2 text-xs font-semibold text-fg-inverse">{t('planMarketplace.tryAgain')}</button>
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-border-default bg-surface px-6 py-12 text-center text-sm text-fg-muted">{t('planMarketplace.loading')}</div>
        ) : plans.length ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-fg-secondary">{t('planMarketplace.totalPlans', { count: result?.total_elements ?? plans.length })}</p>
            </div>
            <section aria-label={t('planMarketplace.availablePlans')} className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.plan_id} className="flex flex-col rounded-2xl border border-border-default bg-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-success-fg">{t('planMarketplace.coachingPlan')}</p>
                      <h2 className="mt-2 text-xl font-bold text-fg">{plan.title}</h2>
                    </div>
                    <span className="rounded-full bg-success-surface px-3 py-1 text-[9px] font-bold text-success-fg">{t('ui.ACTIVE')}</span>
                  </div>
                  {plan.description && <p className="mt-3 text-sm leading-6 text-fg-secondary">{plan.description}</p>}
                  <div className="mt-5 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold text-fg">{formatPrice(plan.price, plan.currency, i18n.language)}</span>
                    <span className="text-xs text-fg-muted">{t('planMarketplace.forDuration', { count: new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US').format(plan.duration_days) })}</span>
                  </div>
                  {plan.includes.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[10px] font-semibold text-fg-secondary">{t('planMarketplace.includes')}</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {plan.includes.map((item) => <li key={item} className="rounded-full border border-border-default bg-surface-muted px-3 py-1.5 text-[10px] text-fg-secondary">{t(`planMarketplace.include.${item}`)}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto border-t border-border-default pt-5">
                    <Link to={`/coaches/${encodeURIComponent(plan.coach_id)}`} className="inline-flex h-10 items-center justify-center rounded-full bg-fg px-5 text-xs font-semibold text-fg-inverse transition hover:bg-brand hover:text-on-brand">
                      {t('planMarketplace.viewCoach')} <span aria-hidden="true" className="ms-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </section>
            {result && result.total_pages > 1 && (
              <nav aria-label={t('planMarketplace.pagination')} className="flex items-center justify-center gap-4 pt-2">
                <button type="button" disabled={pageNumber <= 0 || loading} onClick={() => setPageNumber((value) => value - 1)} className="rounded-full border border-border-default bg-surface px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">{t('relationships.previous')}</button>
                <span className="text-xs text-fg-muted">{t('relationships.page')} {pageNumber + 1} {t('relationships.of')} {result.total_pages}</span>
                <button type="button" disabled={pageNumber + 1 >= result.total_pages || loading} onClick={() => setPageNumber((value) => value + 1)} className="rounded-full border border-border-default bg-surface px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">{t('relationships.next')}</button>
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-fg">{t('planMarketplace.emptyTitle')}</h2>
            <p className="mt-2 text-sm text-fg-secondary">{t('planMarketplace.emptyDescription')}</p>
            <Link to="/coaches" className="mt-5 inline-flex rounded-full bg-fg px-5 py-2.5 text-xs font-semibold text-fg-inverse">{t('ui.Browse coaches')}</Link>
          </div>
        )}
      </div>
    </CoachPublicLayout>
  )
}

export default PlanMarketplacePage
