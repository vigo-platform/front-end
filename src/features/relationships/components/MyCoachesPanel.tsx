import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { relationshipService } from '../services/relationship.service'
import type { CoachAthleteRelation } from '../types/relationship.types'
import { previewAthleteRelations } from '../../auth/data/dashboard-preview'

interface MyCoachesPanelProps {
  accessToken: string | null
  preview: boolean
}

function formatDate(value: string, locale: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-persian' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toUpperCase()
}

function MyCoachesPanel({ accessToken, preview }: MyCoachesPanelProps) {
  const { t, i18n } = useTranslation()
  const [relations, setRelations] = useState<CoachAthleteRelation[]>(preview ? previewAthleteRelations : [])
  const [loading, setLoading] = useState(!preview)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL')

  useEffect(() => {
    if (preview || !accessToken) return
    let active = true
    Promise.resolve()
      .then(() => {
        if (!active) return undefined
        setLoading(true)
        setError('')
        return relationshipService.getMyCoaches(accessToken, status === 'ALL' ? undefined : status)
      })
      .then((result) => { if (active && result) setRelations(result) })
      .catch(() => {
        if (active) {
          setRelations([])
          setError(t('relationships.loadError'))
        }
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, preview, status, t])

  const visibleRelations = preview && status !== 'ALL'
    ? relations.filter((relation) => relation.status === status)
    : relations

  return (
    <section className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t('ui.Relationships')}</p>
          <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t('relationships.myCoaches')}</h2>
          <p className="mt-1 text-[11px] text-fg-secondary">{t('relationships.myCoachesDescription')}</p>
        </div>
        <span className="text-[10px] font-semibold text-fg-muted">{visibleRelations.length} {t('relationships.coaches')}</span>
      </div>
      <div className="mt-4">
        <label className="text-[10px] font-medium text-fg-secondary">
          {t('relationships.filter')}
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="ms-2 rounded-lg border border-border-default bg-surface px-2.5 py-1.5 text-[10px] text-fg">
            <option value="ALL">{t('relationships.allStatuses')}</option>
            <option value="ACTIVE">{t('ui.ACTIVE')}</option>
            <option value="EXPIRED">{t('ui.EXPIRED')}</option>
          </select>
        </label>
      </div>
      {error ? (
        <div role="alert" className="mt-5 rounded-xl border border-danger-border bg-danger-surface px-4 py-5 text-center text-[11px] text-danger-fg">{error}</div>
      ) : loading ? (
        <div className="mt-5 rounded-xl border border-border-default bg-surface-subtle px-4 py-7 text-center text-[11px] text-fg-muted">{t('ui.Loading...')}</div>
      ) : visibleRelations.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {visibleRelations.map((relation) => (
            <article key={relation.relation_id} className="rounded-xl border border-border-default bg-surface-subtle p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-success-fg">{initials(relation.coach_name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-[13px] font-bold text-fg">{relation.coach_name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${relation.status === 'ACTIVE' ? 'bg-success-surface text-success-fg' : 'bg-surface-muted text-fg-muted'}`}>{t(`ui.${relation.status}`)}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-fg-secondary">{relation.plan_title}</p>
                  <p className="mt-1 text-[9px] text-fg-muted">{formatDate(relation.starts_at, i18n.language)} – {formatDate(relation.ends_at, i18n.language)}</p>
                  <Link to={`/coaches/${encodeURIComponent(relation.coach_id)}`} className="mt-3 inline-flex text-[10px] font-bold text-success-fg hover:underline">{t('relationships.viewCoach')} →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-7 text-center">
          <p className="text-[12px] font-semibold text-fg">{t('relationships.noCoaches')}</p>
          <p className="mt-1 text-[10px] text-fg-muted">{t('relationships.noCoachesDescription')}</p>
          <Link to="/coaches" className="mt-4 inline-flex rounded-full bg-fg px-4 py-2 text-[10px] font-semibold text-fg-inverse">{t('ui.Browse coaches')}</Link>
        </div>
      )}
    </section>
  )
}

export default MyCoachesPanel
