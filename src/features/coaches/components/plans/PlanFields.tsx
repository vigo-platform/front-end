import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { planService } from '../../services/plan.service'
import type { CoachPlanFeatureLabel, CoachPlanFormFeature, CoachPlanFormField } from '../../types/coach.types'
import { hasAnswer, toggleItem, type Answer, type Answers } from './plan-draft'
import PlanIcon from './PlanIcon'

export function PlanChoice({ checked, onChange, children }: {
  checked: boolean; onChange: () => void; children: ReactNode
}) {
  return <label className="plan-choice">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="plan-choice-check"><PlanIcon name="check" size={12} /></span>
    <span>{children}</span>
  </label>
}

export function NumberField({ label, value, onChange, min, max = Number.MAX_SAFE_INTEGER, required = false }: {
  label: string; value: string; onChange: (value: string) => void; min: number; max?: number; required?: boolean
}) {
  const { t, i18n } = useTranslation()
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const n = Number(value)
    let message = ''
    if (value !== '') {
      if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(n)) message = t('plans.wholeNumber')
      else if (n < min) message = t('plans.minimum', { limit: min.toLocaleString(i18n.language) })
      else if (n > max) message = t('plans.maximum', { limit: max.toLocaleString(i18n.language) })
    }
    input.current?.setCustomValidity(message)
  }, [value, min, max, t, i18n.language])
  return <label className="plan-field">{label}{required && ' *'}
    <input className="plan-input" ref={input} inputMode="numeric" dir="auto" value={value} required={required} onChange={e => onChange(e.target.value
      .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632)).replace(/[,٬]/g, ''))} />
  </label>
}

export function CatalogField({ field, answers, onChange, required }: {
  field: CoachPlanFormField; answers: Answers; onChange: (id: number, value: Answer) => void; required: boolean
}) {
  const { t } = useTranslation()
  const label = field.label + (required ? ' *' : '')
  const rules = field.validationRules ?? {}
  const value = answers[field.id]
  const options = rules.options ?? []
  const id = useId()
  return <div className="min-w-0" data-field={field.id}>
    {field.valueType === 'MULTI_SELECT' ? <fieldset>
      <legend className="plan-field-label">{label}</legend>
      <div className="plan-choices">{options.map(opt =>
        <PlanChoice key={opt.code} checked={Array.isArray(value) && value.includes(opt.code)}
          onChange={() => onChange(field.id, toggleItem(Array.isArray(value) ? value : [], opt.code))}>
          {opt.label}
        </PlanChoice>)}</div>
    </fieldset> : field.valueType === 'INTEGER' ? <NumberField label={field.label} required={required} min={rules.min ?? -2147483648} max={rules.max ?? 2147483647} value={String(value ?? '')} onChange={v => onChange(field.id, v)} />
    : <label htmlFor={id} className="plan-field">{label}
      {field.valueType === 'SINGLE_SELECT' ? <select className="plan-input" id={id} value={String(value ?? '')} required={required} onChange={e => onChange(field.id, e.target.value)}>
        <option value="">{t('plans.choose')}</option>
        {options.map(opt => <option key={opt.code} value={opt.code}>{opt.label}</option>)}
      </select> : <input className="plan-input" id={id} value={String(value ?? '')} required={required} minLength={rules.minLength} maxLength={rules.maxLength} onChange={e => onChange(field.id, e.target.value)} />}
    </label>}
    {field.helpText && <p className="mt-1.5 text-xs leading-5 text-fg-secondary">{field.helpText}</p>}
  </div>
}

export function FeatureSettings({ token, feature, details, onLoaded, answers, original, added, onChange }: {
  token: string; feature: CoachPlanFeatureLabel; details?: CoachPlanFormFeature; onLoaded: (feature: CoachPlanFormFeature) => void
  answers: Answers; original: Answers; added: boolean; onChange: (id: number, value: Answer) => void
}) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (details) return
    let active = true
    planService.getFeatureFormDetails(token, feature.id)
      .then(result => { if (active) onLoaded(result) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [token, feature.id, details, onLoaded, attempt])
  return <section className="plan-feature-settings space-y-4 rounded-xl border border-border-default bg-surface p-4">
    <h4 className="text-sm font-bold">{feature.label}</h4>
    {details ? <>
      {details.description && <p className="text-xs leading-6 text-fg-secondary">{details.description}</p>}
      {details.fields.map(field => <CatalogField key={field.id} field={field} answers={answers} required={field.required && (added || hasAnswer(original[field.id]))} onChange={onChange} />)}
    </> : failed ? <p role="alert" className="text-sm text-danger-fg">{t('plans.featureLoadError')} <button type="button" className="underline" onClick={() => { setFailed(false); setAttempt(n => n + 1) }}>{t('common.tryAgain')}</button></p> : <p role="status" className="text-xs text-fg-secondary">{t('common.loading')}</p>}
  </section>
}
