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

export interface CoachPublicPlanSummary {
  id: number
  title: string
  summary: string | null
  price: number
  compare_at_price: number | null
  currency: string
  duration_days: number
  is_recommended: boolean
  display_order: number
  features: Array<{
    id: number
    code: string
    label: string
  }>
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
  has_active_plan?: boolean
  price?: number | null
  compare_at_price?: number | null
  currency?: string | null
  plans?: CoachPublicPlanSummary[]
}

export interface CoachDirectoryItem {
  coachId: number
  displayName: string
  headline: string | null
  bio: string
  specialties: string[]
  experienceYears: number
  certifications: Array<{
    title: string
    issuer?: string
    year?: number
  }>
  instagramHandle: string | null
  resultImageUrls: string[]
  avatarUrl: string | null
  minPlanPrice: number | null
  has_active_plan: boolean
  price: number | null
  compare_at_price: number | null
  currency: string | null
  activeAthletesCount: number
  createdAt: string
  updatedAt: string
}

export interface CoachDirectoryPage {
  page: number
  size: number
  totalElements: number
  totalPages: number
  content: CoachDirectoryItem[]
}

export interface CoachDirectoryQuery {
  page?: number
  size?: number
}
