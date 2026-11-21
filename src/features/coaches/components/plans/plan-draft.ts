import type { OwnedCoachPlanDetail } from '../../services/plan.service'
import type { CoachPlanCreateRequest, CoachPlanFormFeature, CoachPlanFormField, CoachPlanPatchRequest } from '../../types/coach.types'

export type Answer = string | number | string[]
export type Answers = Record<number, Answer>
export type FeatureDetails = Record<number, CoachPlanFormFeature>

export function initialDraft(plan?: OwnedCoachPlanDetail) {
  const answers: Answers = {}
  for (const field of [...(plan?.general_fields ?? []), ...(plan?.features.flatMap(f => f.fields) ?? [])]) {
    const value = field.value
    if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) answers[field.id] = value
  }
  return {
    title: plan?.title ?? '', summary: plan?.summary ?? '', description: plan?.description ?? '',
    price: String(plan?.price ?? ''), compare: String(plan?.compare_at_price ?? ''),
    duration: String(plan?.duration_days ?? ''), delivery: String(plan?.first_delivery_days ?? ''),
    includes: plan?.includes.map(i => i.code) ?? [], featureIds: plan?.features.map(f => f.id) ?? [], answers,
  }
}
export type PlanDraft = ReturnType<typeof initialDraft>

export function hasAnswer(value: Answer | undefined) {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && String(value).trim() !== ''
}
export function toggleItem<T>(items: T[], item: T) {
  return items.includes(item) ? items.filter(value => value !== item) : [...items, item]
}

function normalizedAnswer(field: CoachPlanFormField, answers: Answers) {
  const value = answers[field.id]
  if (!hasAnswer(value)) return null
  if (field.valueType === 'INTEGER') return Number(value)
  if (typeof value === 'string') return value.trim()
  return value
}

function fieldWrites(fields: CoachPlanFormField[], answers: Answers, original?: Answers) {
  return fields.flatMap(field => {
    const value = normalizedAnswer(field, answers)
    if (original && JSON.stringify(value) === JSON.stringify(normalizedAnswer(field, original))) return []
    return value === null && !original ? [] : [{ fieldId: field.id, value }]
  })
}

export function createBody(draft: PlanDraft, general: CoachPlanFormField[], details: FeatureDetails): CoachPlanCreateRequest {
  return {
    title: draft.title.trim(), summary: draft.summary.trim() || null, description: draft.description.trim() || null,
    price: Number(draft.price), durationDays: Number(draft.duration), firstDeliveryDays: draft.delivery ? Number(draft.delivery) : null,
    includes: draft.includes, featureIds: draft.featureIds,
    fieldValues: fieldWrites([...general, ...draft.featureIds.flatMap(id => details[id]?.fields ?? [])], draft.answers),
  }
}

export function patchBody(draft: PlanDraft, plan: OwnedCoachPlanDetail, general: CoachPlanFormField[], details: FeatureDetails): CoachPlanPatchRequest {
  const before = initialDraft(plan)
  const body: CoachPlanPatchRequest = {}
  const scalar = createBody(draft, general, details)
  if (scalar.title !== plan.title) body.title = scalar.title
  if (scalar.summary !== plan.summary) body.summary = scalar.summary
  if (scalar.description !== plan.description) body.description = scalar.description
  if (scalar.price !== plan.price) body.price = scalar.price
  const compare = draft.compare ? Number(draft.compare) : null
  if (compare !== plan.compare_at_price || body.price !== undefined) body.compareAtPrice = compare
  if (scalar.durationDays !== plan.duration_days) body.durationDays = scalar.durationDays
  if (scalar.firstDeliveryDays !== plan.first_delivery_days) body.firstDeliveryDays = scalar.firstDeliveryDays
  if (draft.includes.length !== before.includes.length || !draft.includes.every(code => before.includes.includes(code))) {
    body.includes = draft.includes.map(code => ({ code }))
  }
  const fields = fieldWrites(general, draft.answers, before.answers)
  if (fields.length) body.fields = fields
  const features: NonNullable<CoachPlanPatchRequest['features']> = []
  for (const id of draft.featureIds) {
    const fields = fieldWrites(details[id]?.fields ?? [], draft.answers, before.answers)
    if (fields.length || !before.featureIds.includes(id)) features.push({ featureId: id, fields })
  }
  for (const id of before.featureIds) {
    if (!draft.featureIds.includes(id)) features.push({ featureId: id, fields: null })
  }
  if (features.length) body.features = features
  return body
}
