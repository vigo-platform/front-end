export type PlanInclude = 'WORKOUT' | 'DIET' | 'SUPPLEMENT' | 'CHAT_SUPPORT'
export type PlanStatus = 'ACTIVE' | 'ARCHIVED'

/** Public coach plan returned by the plans catalogue endpoint. */
export interface PublicPlan {
  plan_id: string
  coach_id: string
  title: string
  description: string | null
  price: number
  currency: 'IRR'
  duration_days: number
  includes: PlanInclude[]
  status: PlanStatus
  created_at: string
  updated_at: string
}

export interface PublicPlanPage {
  page: number
  size: number
  total_elements: number
  total_pages: number
  content: PublicPlan[]
}

export interface PublicPlanQuery {
  page?: number
  size?: number
  coach_id?: string
}
