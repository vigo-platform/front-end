import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CoachOwnedPlanSummary } from '../../types/coach.types'
import Button from '../../../../shared/components/ui/Button'
import PlanIcon from './PlanIcon'

export default function CoachPlanCard({ plan, busy, onEdit, onArchive, onRestore, onLayout, onRecommend }: {
  plan: CoachOwnedPlanSummary
  busy: boolean
  onEdit: () => void
  onArchive: () => void
  onRestore: () => void
  onLayout: () => void
  onRecommend: () => void
}) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()
  const published = plan.is_active && !plan.is_archived
  const format = (value: number) => value.toLocaleString(i18n.language)
  useEffect(() => {
    if (!open) return
    function outside(event: PointerEvent) {
      if (!menu.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  function select(action: () => void) {
    setOpen(false)
    trigger.current?.focus()
    action()
  }
  return <article className={'plan-card' + (plan.is_recommended && published ? ' plan-card-featured' : '')}>
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className={'plan-status ' + (published ? 'bg-success-surface text-success-fg' : 'bg-page text-fg-secondary')}>
          <span className="size-1.5 rounded-full bg-current" />{t(plan.is_archived ? 'plans.archived' : published ? 'plans.active' : 'plans.inactive')}
        </span>
        {plan.is_recommended && published && <span className="plan-status bg-brand text-on-brand"><PlanIcon name="star" size={13} />{t('plans.recommended')}</span>}
      </div>
      {!plan.is_archived && <div ref={menu} className="relative" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}
        onKeyDown={e => { if (e.key === 'Escape' && open) { setOpen(false); trigger.current?.focus() } }}>
        <button type="button" ref={trigger} className="plan-icon-button" disabled={busy} aria-label={t('plans.more', { title: plan.title })} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}><PlanIcon name="more" /></button>
        {open && <div id={id} className="plan-card-menu">
          {published && !plan.is_recommended && <button type="button" disabled={busy} onClick={() => select(onRecommend)}><PlanIcon name="star" size={16} />{t('plans.recommend')}</button>}
          {published && <button type="button" disabled={busy} onClick={() => select(onLayout)}><PlanIcon name="layout" size={16} />{t('plans.layout')}</button>}
          <button type="button" disabled={busy} className="text-danger-fg" onClick={() => select(onArchive)}><PlanIcon name="archive" size={16} />{t('plans.archive')}</button>
        </div>}
      </div>}
    </div>
    <h2 className="mt-4 break-words text-xl font-bold leading-relaxed">{plan.title}</h2>
    {plan.summary && <p className="mt-1 break-words text-sm leading-6 text-fg-secondary">{plan.summary}</p>}
    {plan.features.length > 0 && <ul className="mt-4 flex flex-wrap gap-1.5">{plan.features.map(item => <li key={item.id} className="rounded-lg border border-border-default px-2 py-1 text-xs text-fg-secondary">{item.label}</li>)}</ul>}
    <div className="mt-auto pt-6"><div className="flex flex-wrap items-end justify-between gap-3 border-t border-border-default pt-4">
      <div>{plan.compare_at_price != null && plan.compare_at_price > plan.price && <del className="block text-xs text-fg-secondary">{format(plan.compare_at_price)}</del>}
        <p><strong className="text-xl tabular-nums">{format(plan.price)}</strong> <span className="text-xs text-fg-secondary">{plan.currency === 'IRR' ? t('plans.rial') : plan.currency}</span></p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-secondary"><PlanIcon name="clock" size={13} />{plan.duration_days === 1 ? t('plans.day') : t('plans.days', { number: format(plan.duration_days) })}</p>
      </div>
      {plan.is_archived ? <Button variant="outline" disabled={busy} onClick={onRestore}><PlanIcon name="restore" size={15} />{t('plans.restore')}</Button> :
        published && <Button variant="outline" disabled={busy} onClick={onEdit}><PlanIcon name="edit" size={15} />{t('plans.edit')}</Button>}
    </div></div>
  </article>
}
