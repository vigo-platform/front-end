import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppShell from '../../../shared/components/layout/AppShell'
import Skeleton from '../../../shared/components/feedback/Skeleton'
import Button from '../../../shared/components/ui/Button'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { useAuth } from '../../auth/context/auth-context'
import { planService } from '../services/plan.service'
import type { CoachOwnedPlanSummary } from '../types/coach.types'
import PlanDialog from '../components/plans/PlanDialog'
import PlanIcon from '../components/plans/PlanIcon'
import CoachPlanCard from '../components/plans/CoachPlanCard'
import PlanEditor from '../components/plans/PlanEditor'
import PlanLayoutDialog from '../components/plans/PlanLayoutDialog'
import './coach-plans.css'

type Dialog = { kind: 'create' | 'layout' } | { kind: 'edit' | 'archive'; plan: CoachOwnedPlanSummary }

export default function CoachPlansPage() {
  const { accessToken, user } = useAuth()
  const { t, i18n } = useTranslation()
  const [plans, setPlans] = useState<CoachOwnedPlanSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [version, setVersion] = useState(0)
  const [archived, setArchived] = useState(false)
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    if (!accessToken) return
    let active = true
    planService.getOwnedSummaries(accessToken)
      .then(data => {
        if (active) { setPlans([...data].sort((a,b) => a.display_order - b.display_order || a.id - b.id)); setLoadError('') }
      })
      .catch(e => { if (active) setLoadError(getUserErrorMessage(e, t, 'errors.loadData')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, t, version])
  function refresh() {
    setLoading(true)
    setLoadError('')
    setVersion(n => n + 1)
  }
  function open(next: Dialog) { setError(''); setNotice(''); setDialog(next) }
  function saved(message: string) {
    setDialog(null)
    setError('')
    setNotice(message)
    refresh()
  }
  async function changeArchived(plan: CoachOwnedPlanSummary, restore: boolean) {
    if (!accessToken || busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      if (restore) await planService.unarchivePlan(accessToken, plan.id)
      else await planService.archivePlan(accessToken, plan.id)
      saved(t(restore ? 'plans.restored' : 'plans.archivedDone'))
    } catch (e) {
      setError(getUserErrorMessage(e, t, 'plans.failure'))
    } finally { setBusy(false) }
  }
  const current = plans.filter(p => !p.is_archived)
  const archive = plans.filter(p => p.is_archived)
  const published = current.filter(p => p.is_active)
  const visible = archived ? archive : current
  const hasData = !loading && !loadError
  return <AppShell title="plans.title">
    <div className="mx-auto w-full max-w-[1180px] space-y-6">
      <header className="plan-hero">
        <div className="plan-track" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{t('plans.title')}</h1>
          <p className="mt-2 max-w-lg text-sm leading-7 text-sidebar-muted">{t('plans.subtitle')}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button onClick={() => open({ kind: 'create' })} disabled={busy}><PlanIcon name="plus" />{t('plans.new')}</Button>
            {user?.user_id && <Link className="inline-flex items-center gap-2 text-xs font-semibold text-sidebar-fg hover:underline" to={'/coaches/' + encodeURIComponent(user.user_id)}>{t('plans.viewProfile')}<PlanIcon name="external" size={15} /></Link>}
          </div>
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1 rounded-xl border border-border-default bg-surface p-1">
          {[false, true].map(value => <button type="button" aria-pressed={archived === value} key={String(value)} className={'plan-filter' + (archived === value ? ' plan-filter-selected' : '')}
            onClick={() => { setArchived(value); setError('') }}>{t(value ? 'plans.archiveTab' : 'plans.current')}
            {hasData && <span className="plan-count">{(value ? archive : current).length.toLocaleString(i18n.language)}</span>}
          </button>)}
        </div>
        {!archived && hasData && published.length > 0 && user?.user_id && <Button variant="outline" disabled={busy} onClick={() => open({ kind: 'layout' })}><PlanIcon name="layout" size={16} />{t('plans.layout')}</Button>}
      </div>
      {notice && <p role="status" className="flex items-center gap-2 rounded-xl border border-success-border bg-success-surface px-4 py-3 text-sm text-success-fg"><PlanIcon name="check" size={16} />{notice}</p>}
      {error && !dialog && <p role="alert" className="text-sm text-danger-fg">{error}</p>}
      {loadError ? <section role="alert" className="plan-empty"><p>{loadError}</p><Button variant="outline" onClick={refresh}>{t('common.tryAgain')}</Button></section>
        : loading ? <div role="status" aria-label={t('common.loading')} className="plan-grid">{[0,1].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}</div>
        : visible.length ? <div className="plan-grid">{visible.map(plan => <CoachPlanCard key={plan.id} plan={plan} busy={busy} onEdit={() => open({ kind: 'edit', plan })} onArchive={() => open({ kind: 'archive', plan })} onRestore={() => void changeArchived(plan, true)} onLayout={() => open({ kind: 'layout' })} />)}</div>
        : <section className="plan-empty"><span className="grid size-14 place-items-center rounded-2xl bg-surface-muted text-success-fg"><PlanIcon name={archived ? 'archive' : 'stack'} size={26} /></span>
          <h2 className="text-lg font-bold">{t(archived ? 'plans.emptyArchive' : 'plans.empty')}</h2><p className="text-sm text-fg-secondary">{t(archived ? 'plans.emptyArchiveText' : 'plans.emptyText')}</p>
          {!archived && <Button onClick={() => open({ kind: 'create' })}><PlanIcon name="plus" size={16} />{t('plans.new')}</Button>}
        </section>}
    </div>
    {(dialog?.kind === 'create' || dialog?.kind === 'edit') && accessToken && <PlanEditor token={accessToken} planId={dialog.kind === 'edit' ? dialog.plan.id : undefined} onClose={() => setDialog(null)} onSaved={() => { setArchived(false); saved(t(dialog.kind === 'create' ? 'plans.created' : 'plans.updated')) }} />}
    {dialog?.kind === 'layout' && user?.user_id && <PlanLayoutDialog coachId={user.user_id} plans={published} onClose={() => setDialog(null)} onSaved={() => { setDialog(null); setNotice(t('plans.layoutSaved')) }} />}
    {dialog?.kind === 'archive' && <PlanDialog title={t('plans.archiveQuestion')} compact onClose={() => { setError(''); setDialog(null) }} busy={busy}>
      <div className="plan-dialog-body space-y-3"><p className="text-sm leading-7">{t('plans.archiveMessage', { title: dialog.plan.title })}</p>
        {error && <p role="alert" className="text-sm text-danger-fg">{error}</p>}
      </div><footer className="plan-dialog-footer"><Button variant="ghost" disabled={busy} onClick={() => { setError(''); setDialog(null) }}>{t('plans.cancel')}</Button><Button variant="danger" loading={busy} onClick={() => void changeArchived(dialog.plan, false)}>{t('plans.archive')}</Button></footer>
    </PlanDialog>}
  </AppShell>
}
