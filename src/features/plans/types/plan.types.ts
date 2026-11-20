export type PlanInclude = 'WORKOUT' | 'DIET' | 'SUPPLEMENT' | 'CHAT_SUPPORT'
export type PlanStatus = 'ACTIVE' | 'ARCHIVED'

/**
 * Public catalog model follows the Plan schema in user.yaml.
 * The /api/v1/plans collection route is not yet documented in that contract.
 */
export interface PublicPlan {
  plan_id: string
  coach_id: string
  title: string
  description?: string
  price: number
  duration_days: number
  includes?: PlanInclude[]
  status: PlanStatus
  created_at?: string
  updated_at?: string
}
