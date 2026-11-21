import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CoachOwnedPlanSummary } from '../../types/coach.types'
import Button from '../../../../shared/components/ui/Button'
import PlanDialog from './PlanDialog'
import PlanIcon from './PlanIcon'
import { usePlanReorder } from './usePlanReorder'

interface Layout { order: number[]; recommended: number | null }

function loadLayout(key: string, published: Layout): Layout {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? 'null')
    if (!raw || !Array.isArray(raw.order)) return published
    const current = new Set(published.order)
    const order = [...new Set<number>(raw.order.filter((id: number) => current.has(id)))]
    const retained = new Set(order)
    return {
      order: [...order, ...published.order.filter(id => !retained.has(id))],
      recommended: raw.recommended === null || current.has(raw.recommended) ? raw.recommended : published.recommended,
    }
  } catch { return published }
}

export default function PlanLayoutDialog({ plans, coachId, onClose, onSaved }: {
  plans: CoachOwnedPlanSummary[]; coachId: string; onClose: () => void; onSaved: () => void
}) {
  const { t, i18n } = useTranslation()
  const key = 'vigo.coachPlanLayout.' + coachId
  const published = { order: plans.map(p => p.id), recommended: plans.find(p => p.is_recommended)?.id ?? null }
  const [layout, setLayout] = useState(() => loadLayout(key, published))
  const [error, setError] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const byId = new Map(plans.map(plan => [plan.id, plan]))
  function move(id: number, to: number) {
    setLayout(previous => {
      if (to < 0 || to >= previous.order.length) return previous
      const order = previous.order.filter(item => item !== id)
      order.splice(to, 0, id)
      return { ...previous, order }
    })
    setAnnouncement(t('plans.moved', { title: byId.get(id)?.title, position: (to + 1).toLocaleString(i18n.language) }))
  }
  const {
    scrollerRef, listRef, ghostRef, registerRow, dragged, over,
    move: reorder, start, update, drop, finish,
  } = usePlanReorder(layout.order, move)
  const draggedPlan = dragged === null ? undefined : byId.get(dragged)
  function save() {
    try { localStorage.setItem(key, JSON.stringify(layout)) }
    catch { setError(true); return }
    onSaved()
  }
  return <PlanDialog title={t('plans.localLayout')} onClose={onClose} variant="layout">
    <div ref={scrollerRef} className="plan-dialog-body plan-layout-body space-y-4">
      <p className="plan-layout-info"><PlanIcon name="info" size={17} />{t('plans.localExplanation')}</p>
      {layout.order.length > 1 && <p className="text-sm text-fg-secondary">{t('plans.dragHelp')}</p>}
      <div className="relative">
        <ol ref={listRef} className="plan-layout-list">
          {layout.order.map((id, index) => {
            const plan = byId.get(id)!
            const featured = layout.recommended === id
            return <li key={id}
              ref={element => registerRow(id, element)}
              className="plan-layout-row"
              data-dragging={dragged === id}
              data-drop-target={over === id && dragged !== id}>
              <button type="button" className="plan-icon-button plan-handle" disabled={layout.order.length < 2}
                aria-label={t('plans.drag', { title: plan.title })} aria-keyshortcuts="ArrowUp ArrowDown"
                onPointerDown={e => start(e, id)} onPointerMove={update} onPointerUp={drop}
                onPointerCancel={() => finish(false)} onLostPointerCapture={() => finish(false)}
                onKeyDown={event => {
                  if (event.key === 'Escape' && dragged !== null) {
                    event.preventDefault()
                    finish(false)
                  }
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    reorder(id, index + (event.key === 'ArrowUp' ? -1 : 1))
                  }
                }}><PlanIcon name="grip" /></button>
              <span className="plan-position">{(index + 1).toLocaleString(i18n.language)}</span>
              <div className="min-w-0 flex-1"><p className="break-words text-sm font-bold">{plan.title}</p>
                {featured && <span className="plan-recommended text-xs font-semibold text-success-fg">{t('plans.recommended')}</span>}</div>
              <div className="plan-layout-actions">
                <button type="button" className="plan-icon-button" aria-label={t('plans.earlier') + ' · ' + plan.title} title={t('plans.earlier')} disabled={index === 0} onClick={() => reorder(id, index - 1)}><PlanIcon name="up" /></button>
                <button type="button" className="plan-icon-button" aria-label={t('plans.later') + ' · ' + plan.title} title={t('plans.later')} disabled={index === layout.order.length - 1} onClick={() => reorder(id, index + 1)}><PlanIcon name="down" /></button>
                <button type="button" className={'plan-icon-button' + (featured ? ' plan-starred' : '')} aria-pressed={featured} title={t(featured ? 'plans.unRecommend' : 'plans.recommend')} aria-label={t('plans.recommend') + ' · ' + plan.title} onClick={() => setLayout({ ...layout, recommended: featured ? null : id })}><PlanIcon name="star" /></button>
              </div>
            </li>
          })}
        </ol>
        {draggedPlan && <div ref={ghostRef} className="plan-drag-ghost" aria-hidden="true">
          <span className="plan-icon-button"><PlanIcon name="grip" /></span>
          <span className="min-w-0 truncate text-sm font-bold">{draggedPlan.title}</span>
        </div>}
      </div>
      <p className="sr-only" role="status">{announcement}</p>
      {error && <p role="alert" className="text-sm text-danger-fg">{t('plans.localError')}</p>}
    </div>
    <footer className="plan-dialog-footer">
      <Button variant="ghost" className="plan-layout-reset" onClick={() => setLayout(published)}>{t('plans.reset')}</Button>
      <Button className="plan-primary" onClick={save}><PlanIcon name="check" size={17} />{t('plans.saveLayout')}</Button>
    </footer>
  </PlanDialog>
}
