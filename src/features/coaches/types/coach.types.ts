export interface CoachProfile {
  coach_id: string
  display_name: string
  headline?: string
  bio: string
  specialties: string[]
  experience_years: number
  certifications?: Array<{
    title: string
    issuer?: string
    year?: number
  }>
  instagram_handle?: string | null
  result_image_urls?: string[]
  avatar_url?: string | null
  min_plan_price?: number | null
  active_athletes_count?: number
  created_at?: string
  updated_at?: string
}

export interface CoachPage {
  page: number
  size: number
  total_elements: number
  total_pages: number
  content: CoachProfile[]
}

export type CoachSort = 'newest' | 'price_asc' | 'price_desc' | 'experience'

export interface CoachSearchParams {
  page?: number
  size?: number
  q?: string
  specialty?: string
  min_price?: number
  max_price?: number
  sort?: CoachSort
}

export type PlanInclude = 'WORKOUT' | 'DIET' | 'SUPPLEMENT' | 'CHAT_SUPPORT'

export interface CoachPlan {
  plan_id: string
  coach_id: string
  title: string
  description?: string
  price: number
  duration_days: number
  includes?: PlanInclude[]
  status: 'ACTIVE' | 'ARCHIVED'
}
