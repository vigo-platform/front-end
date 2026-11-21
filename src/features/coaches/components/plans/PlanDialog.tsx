import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import PlanIcon from './PlanIcon'

export default function PlanDialog({ title, children, onClose, busy = false, compact = false, variant }: {
  title: string; children: ReactNode; onClose: () => void; busy?: boolean; compact?: boolean
  variant?: 'editor' | 'layout'
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { t } = useTranslation()
  useEffect(() => {
    const element = dialog.current!
    const previous = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => { element.close(); document.body.style.overflow = previous }
  }, [])
  return (
    <dialog ref={dialog} aria-labelledby={titleId} className={'plan-dialog' + (compact ? ' plan-dialog-compact' : '') + (variant ? ' plan-dialog-' + variant : '')}
      onCancel={event => { event.preventDefault(); if (!busy) onClose() }}>
      <header className="plan-dialog-header">
        {variant && <span aria-hidden="true" className="plan-dialog-emblem"><PlanIcon name={variant === 'editor' ? 'stack' : 'layout'} size={20} /></span>}
        <h2 id={titleId} className="min-w-0 flex-1 text-lg font-bold sm:text-xl">{title}</h2>
        <button type="button" disabled={busy} className="plan-icon-button" aria-label={t('plans.close')} onClick={onClose}><PlanIcon name="close" /></button>
      </header>
      {children}
    </dialog>
  )
}
