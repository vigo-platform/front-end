import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../../shared/components/ui/Button'
import Skeleton from '../../../../shared/components/feedback/Skeleton'
import { ApiError } from '../../../../shared/api/client'
import { getUserErrorMessage } from '../../../../shared/api/user-error'
import { planService, type OwnedCoachPlanDetail } from '../../services/plan.service'
import type { CoachPlanFormFeature, CoachPlanFormOptions } from '../../types/coach.types'
import PlanDialog from './PlanDialog'
import PlanIcon from './PlanIcon'
import { CatalogField, FeatureSettings, NumberField, PlanChoice } from './PlanFields'
import { createBody, hasAnswer, initialDraft, patchBody, toggleItem, type Answer, type FeatureDetails, type PlanDraft } from './plan-draft'

interface Props {
  token: string
  planId?: number
  onClose: () => void
  onSaved: () => void
}

export default function PlanEditor(props: Props) {
  const { token, planId, onClose } = props
  const { t } = useTranslation()
  const [data, setData] = useState<{ options: CoachPlanFormOptions; plan?: OwnedCoachPlanDetail } | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const title = t(planId ? 'plans.edit' : 'plans.new')
  useEffect(() => {
    let active = true
    Promise.all([planService.getFormOptions(token), planId ? planService.getMyPlan(token, planId) : undefined])
      .then(([options, plan]) => {
        if (!active) return
        if (plan && (plan.is_archived || !plan.is_active)) setError(t('plans.stale'))
        else setData({ options, plan })
      })
      .catch(e => { if (active) setError(getUserErrorMessage(e, t, 'errors.loadData')) })
    return () => { active = false }
  }, [token, planId, t, attempt])
  return <PlanDialog title={title} onClose={onClose} busy={busy} variant="editor">
    {data ? <EditorForm {...props} {...data} busy={busy} setBusy={setBusy} /> :
      <div className="plan-dialog-body">
        {error ? <div role="alert" className="space-y-4"><p className="text-danger-fg">{error}</p><Button variant="outline" onClick={() => { setError(''); setAttempt(n => n + 1) }}>{t('common.tryAgain')}</Button></div> :
          <div role="status" aria-label={t('common.loading')} className="space-y-4">
            <Skeleton className="h-12" /><Skeleton className="h-28" /><Skeleton className="h-24" />
          </div>}
      </div>}
  </PlanDialog>
}

function EditorForm({ token, plan, options, onClose, onSaved, busy, setBusy }: Props & {
  plan?: OwnedCoachPlanDetail; options: CoachPlanFormOptions; busy: boolean; setBusy: (value: boolean) => void
}) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(() => initialDraft(plan))
  const [original] = useState(() => initialDraft(plan))
  const [details, setDetails] = useState<FeatureDetails>({})
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const scroller = useRef<HTMLDivElement>(null)
  const stepHeading = useRef<HTMLLIElement>(null)
  const formSection = useRef<HTMLFieldSetElement>(null)
  const stepChanged = useRef(false)
  useLayoutEffect(() => {
    if (!stepChanged.current) return
    scroller.current?.scrollTo({ top: 0 })
    stepHeading.current?.focus({ preventScroll: true })
  }, [step])
  const remember = useCallback((feature: CoachPlanFormFeature) => setDetails(prev => ({ ...prev, [feature.id]: feature })), [])
  const selected = options.features.filter(feature => draft.featureIds.includes(feature.id))
  const waiting = selected.some(feature => !details[feature.id])
  const unit = !plan || plan.currency === 'IRR' ? t('plans.rial') : plan.currency
  const includeChoices = [...options.includeOptions, ...(plan?.includes.filter(item => !options.includeOptions.some(opt => opt.code === item.code)) ?? [])]
  const featureChoices = [...options.features, ...(plan?.features.filter(item => !options.features.some(opt => opt.id === item.id)) ?? [])]
  function update<K extends keyof PlanDraft>(key: K, value: PlanDraft[K]) {
    setDraft(prev => ({ ...prev, [key]: value }))
    setError('')
  }
  function answer(id: number, value: Answer) {
    setDraft(prev => ({ ...prev, answers: { ...prev.answers, [id]: value } }))
    setError('')
  }
  function navigate(next: number) {
    setError('')
    stepChanged.current = true
    setStep(next)
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    if (step === 1) {
      if (draft.title !== original.title && [...draft.title.trim()].length < 3) { setError(t('plans.badTitle')); return }
      navigate(2)
      return
    }
    if (waiting) return
    if (draft.includes.length === 0 && (!plan || original.includes.length > 0)) { setError(t('plans.chooseService')); return }
    const allFields = [...options.generalFields, ...selected.flatMap(f => details[f.id]?.fields ?? [])]
    for (const field of allFields) {
      const addedFeature = selected.some(f => !original.featureIds.includes(f.id) && details[f.id]?.fields.some(item => item.id === field.id))
      if (field.required && (!plan || hasAnswer(original.answers[field.id]) || addedFeature) && !hasAnswer(draft.answers[field.id])) {
        setError(t('plans.invalid', { field: field.label }))
        const invalid = formSection.current?.querySelector<HTMLElement>('[data-field="' + field.id + '"]')
        invalid?.scrollIntoView({ block: 'nearest' })
        invalid?.querySelector<HTMLElement>('input, select')?.focus({ preventScroll: true })
        return
      }
    }
    setBusy(true)
    setError('')
    try {
      if (plan) {
        const body = patchBody(draft, plan, options.generalFields, details)
        if (Object.keys(body).length) await planService.updatePlan(token, plan.id, body)
      } else {
        await planService.createPlan(token, createBody(draft, options.generalFields, details))
      }
      onSaved()
    } catch (e) {
      let message = getUserErrorMessage(e, t, 'plans.failure')
      if (e instanceof ApiError && e.status === 409) message = t('plans.stale')
      if (e instanceof ApiError && Array.isArray(e.data)) {
        const labels: Record<string, string> = { title: t('plans.titleField'), durationDays: t('plans.duration'), price: t('plans.price', { unit }), compareAtPrice: t('plans.compare', { unit }), summary: t('plans.summary'), description: t('plans.description'), firstDeliveryDays: t('plans.delivery'), includes: t('plans.include'), features: t('plans.features') }
        const issues = e.data.map(issue => {
          const name = allFields.find(field => field.id === issue?.fieldId)?.label ?? labels[String(issue?.field).split('[')[0]]
          return name ? t('plans.invalid', { field: name }) : message
        })
        if (issues.length) message = [...new Set(issues)].join(' ')
      }
      setError(message)
      setBusy(false)
    }
  }
  return <form className="plan-editor-form" onSubmit={submit} aria-busy={busy}>
    <ol className="plan-steps">
      {[1, 2].map(number => <li key={number}
        className="plan-step" data-done={number < step}
        aria-current={number === step ? 'step' : undefined}
        ref={number === step ? stepHeading : undefined} tabIndex={number === step ? -1 : undefined}>
        <span className="plan-step-icon"><PlanIcon name={number < step ? 'check' : number === 1 ? 'details' : 'sliders'} size={17} /></span>
        <span>{t(number === 1 ? 'plans.basics' : 'plans.services')}</span>
      </li>)}
    </ol>
    <div className="plan-dialog-body plan-editor-scroll" ref={scroller}>
      <fieldset ref={formSection} key={step} disabled={busy} className="plan-editor-step" data-step={step}>
        {step === 1 ? <>
          <section className="plan-panel space-y-4">
            <label className="plan-field">{t('plans.titleField')} *
              <input className="plan-input" required minLength={3} maxLength={80} placeholder={t('plans.titleHint')} value={draft.title} onChange={e => update('title', e.target.value)} />
            </label>
            <label className="plan-field">{t('plans.summary')}<input className="plan-input" maxLength={180} value={draft.summary} onChange={e => update('summary', e.target.value)} /></label>
            <label className="plan-field">{t('plans.description')}<textarea className="plan-input resize-y" rows={3} maxLength={1500} value={draft.description} onChange={e => update('description', e.target.value)} /></label>
          </section>
          <fieldset className="plan-panel grid gap-4 sm:grid-cols-2">
            <legend className="sr-only">{t('plans.commercial')}</legend>
            <p aria-hidden="true" className="plan-panel-title sm:col-span-2"><PlanIcon name="clock" size={17} />{t('plans.commercial')}</p>
            <NumberField label={t('plans.price', { unit })} required min={plan && draft.price === original.price ? plan.price : !plan || plan.currency === 'IRR' ? 10000 : 0} value={draft.price} onChange={value => setDraft(prev => ({ ...prev, price: value, compare: prev.price === prev.compare ? value : prev.compare }))} />
            {plan && <NumberField label={t('plans.compare', { unit })} min={Number(draft.price)} value={draft.compare} onChange={v => update('compare', v)} />}
            <NumberField label={t('plans.duration')} min={1} max={365} required value={draft.duration} onChange={v => update('duration', v)} />
            <NumberField label={t('plans.delivery')} min={0} max={2147483647} value={draft.delivery} onChange={v => update('delivery', v)} />
          </fieldset>
        </> : <>
          <fieldset className="plan-panel"><legend className="sr-only">{t('plans.include')}</legend>
            <p aria-hidden="true" className="plan-panel-title"><PlanIcon name="stack" size={17} />{t('plans.include')} *</p>
            <div className="plan-choices">{includeChoices.map(item => <PlanChoice key={item.code}
              checked={draft.includes.includes(item.code)} onChange={() => update('includes', toggleItem(draft.includes, item.code))}>{item.label}</PlanChoice>)}</div>
          </fieldset>
          {options.generalFields.length > 0 && <section className="plan-panel space-y-5">
            <h3 className="plan-panel-title"><PlanIcon name="sliders" size={17} />{t('plans.general')}</h3>
            {options.generalFields.map(field => <CatalogField key={field.id} field={field} answers={draft.answers} required={field.required && (!plan || hasAnswer(original.answers[field.id]))} onChange={answer} />)}
          </section>}
          {featureChoices.length > 0 && <fieldset className="plan-panel space-y-3">
            <legend className="sr-only">{t('plans.features')}</legend>
            <p aria-hidden="true" className="plan-panel-title"><PlanIcon name="star" size={17} />{t('plans.features')}</p>
            <div className="plan-choices">{featureChoices.map(item => <PlanChoice key={item.id}
              checked={draft.featureIds.includes(item.id)} onChange={() => update('featureIds', toggleItem(draft.featureIds, item.id))}>{item.label}</PlanChoice>)}</div>
            {selected.map(feature => <FeatureSettings key={feature.id} token={token} feature={feature} details={details[feature.id]} onLoaded={remember} answers={draft.answers} original={original.answers} added={!original.featureIds.includes(feature.id)} onChange={answer} />)}
          </fieldset>}
        </>}
      </fieldset>
    </div>
    <footer className="plan-dialog-footer">
      {error && <p role="alert" className="plan-form-error">{error}</p>}
      <Button type="button" variant="ghost" disabled={busy} onClick={step === 1 ? onClose : () => navigate(1)}>
        {t(step === 1 ? 'plans.cancel' : 'plans.back')}
      </Button>
      <Button type="submit" className="plan-primary" loading={busy} disabled={step === 2 && waiting}>
        {t(step === 1 ? 'plans.next' : plan ? 'plans.save' : 'plans.publish')}
        {!busy && <span className="plan-submit-icon" data-next={step === 1}><PlanIcon name={step === 1 ? 'arrow' : 'check'} size={17} /></span>}
      </Button>
    </footer>
  </form>
}
