export interface CoachProfileRequest {
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
}

export interface CoachProfile extends CoachProfileRequest {
  coach_id: string
  avatar_url?: string | null
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejection_reason?: string | null
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

