import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { relationshipService } from '../services/relationship.service'
import type { CoachAthleteRelation, RelationPage, RelationStatus } from '../types/relationship.types'
import { previewCoachRelations } from '../../auth/data/dashboard-preview'

interface CoachAthletesPanelProps {
  accessToken: string | null
  preview: boolean
  onTotalChange?: (total: number) => void
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

function CoachAthletesPanel({ accessToken, preview, onTotalChange }: CoachAthletesPanelProps) {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<RelationPage | null>(null)
  const [status, setStatus] = useState<'ALL' | RelationStatus>('ALL')
  const [pageNumber, setPageNumber] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(!preview)
  const [error, setError] = useState('')

  useEffect(() => {
    if (preview || !accessToken) return
    let active = true
    Promise.resolve()
      .then(() => {
        if (!active) return undefined
        setLoading(true)
        setError('')
        return relationshipService.getMyAthletes(accessToken, {
          page: pageNumber,
          size: 5,
          ...(status === 'ALL' ? {} : { status }),
        })
      })
      .then((result) => {
        if (active && result) {
          setPage(result)
          onTotalChange?.(result.total_elements)
        }
      }).catch(() => {
      if (active) {
        setPage(null)
        setError(t('relationships.loadError'))
      }
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [accessToken, onTotalChange, pageNumber, preview, reloadKey, status, t])

  const relations: CoachAthleteRelation[] = useMemo(() => {
    const source = preview ? previewCoachRelations : page?.content ?? []
    return status === 'ALL' ? source : source.filter((relation) => relation.status === status)
  }, [page, preview, status])
  const totalPages = preview ? 1 : page?.total_pages ?? 0

  return (
    <article className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-muted">{t('ui.Relationships')}</p>
          <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t('ui.Your athletes')}</h2>
        </div>
        <span className="text-[9px] font-semibold text-fg-muted">
          {preview ? relations.length : page?.total_elements ?? 0} {t('relationships.athletes')}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <label className="text-[10px] font-medium text-fg-secondary">
          {t('relationships.filter')}
          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value as 'ALL' | RelationStatus); setPageNumber(0) }}
            className="ms-2 rounded-lg border border-border-default bg-surface px-2.5 py-1.5 text-[10px] text-fg"
          >
            <option value="ALL">{t('relationships.allStatuses')}</option>
            <option value="ACTIVE">{t('ui.ACTIVE')}</option>
            <option value="EXPIRED">{t('ui.EXPIRED')}</option>
          </select>
        </label>
        {!preview && <button type="button" onClick={() => { setPageNumber(0); setReloadKey((value) => value + 1) }} className="text-[10px] font-semibold text-success-fg hover:underline">{t('relationships.refresh')}</button>}
      </div>

      {error ? (
        <div role="alert" className="mt-5 rounded-xl border border-danger-border bg-danger-surface px-4 py-5 text-center">
          <p className="text-[11px] font-semibold text-danger-fg">{error}</p>
        </div>
      ) : loading ? (
        <div className="mt-5 rounded-xl border border-border-default bg-surface-subtle px-4 py-7 text-center text-[11px] text-fg-muted">{t('ui.Loading...')}</div>
      ) : relations.length ? (
        <>
          <div className="mt-4 divide-y divide-border-default">
            {relations.map((relation) => (
              <div key={relation.relation_id} className="flex items-start gap-3 py-4 first:pt-1 last:pb-1">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-success-fg">{initials(relation.athlete_name)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[12px] font-bold text-fg">{relation.athlete_name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${relation.status === 'ACTIVE' ? 'bg-success-surface text-success-fg' : 'bg-surface-muted text-fg-muted'}`}>{t(`ui.${relation.status}`)}</span>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-fg-secondary">{relation.plan_title}</p>
                  <p className="mt-1 text-[9px] text-fg-muted">{formatDate(relation.starts_at, i18n.language)} – {formatDate(relation.ends_at, i18n.language)}</p>
                </div>
              </div>
            ))}
          </div>
          {!preview && totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-border-default pt-3">
              <button type="button" disabled={pageNumber <= 0 || loading} onClick={() => setPageNumber((value) => value - 1)} className="text-[10px] font-semibold text-success-fg disabled:opacity-40">{t('relationships.previous')}</button>
              <span className="text-[9px] text-fg-muted">{t('relationships.page')} {pageNumber + 1} / {totalPages}</span>
              <button type="button" disabled={pageNumber + 1 >= totalPages || loading} onClick={() => setPageNumber((value) => value + 1)} className="text-[10px] font-semibold text-success-fg disabled:opacity-40">{t('relationships.next')}</button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border-default bg-surface-subtle px-5 py-7 text-center">
          <p className="text-[12px] font-semibold text-fg">{t('relationships.noAthletes')}</p>
          <p className="mt-1 text-[10px] text-fg-muted">{t('relationships.noAthletesDescription')}</p>
        </div>
      )}
    </article>
  )
}

export default CoachAthletesPanel
