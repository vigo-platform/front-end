// Types based on user.yaml and storage.yaml.
// API field names intentionally remain snake_case.

export type UserRole = 'ATHLETE' | 'COACH' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export type CoachStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type RelationStatus = 'ACTIVE' | 'EXPIRED'
export type PlanStatus = 'ACTIVE' | 'ARCHIVED'

export type PlanInclude =
  | 'WORKOUT'
  | 'DIET'
  | 'SUPPLEMENT'
  | 'CHAT_SUPPORT'

export type FileCategory =
  | 'WORKOUT'
  | 'DIET'
  | 'SUPPLEMENT'
  | 'OTHER'

export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  message_fa?: string
  data: T
  timestamp: string
}

export interface UserProfile {
  user_id: string
  email: string
  display_name?: string
  phone?: string | null
  avatar_url?: string | null
  birth_date?: string | null
  gender?: Gender
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at?: string
}

export interface CoachProfile {
  coach_id: string
  display_name: string
  headline?: string
  bio: string
  specialties: string[]
  experience_years: number
  certifications?: {
    title: string
    issuer?: string
    year?: number
  }[]
  instagram_handle?: string | null
  result_image_urls?: string[]
  avatar_url?: string | null
  status?: CoachStatus
  min_plan_price?: number | null
  active_athletes_count?: number
  created_at?: string
  updated_at?: string
}

export interface Relation {
  relation_id: string
  coach_id: string
  coach_name: string
  athlete_id: string
  athlete_name: string
  plan_id: string
  plan_title: string
  starts_at: string
  ends_at: string
  status: RelationStatus
}

export interface Plan {
  plan_id: string
  coach_id: string
  title: string
  description?: string
  price: number
  duration_days: number
  includes: PlanInclude[]
  status: PlanStatus
  created_at?: string
  updated_at?: string
}

export interface FileMetadata {
  file_id: string
  coach_id: string
  athlete_id: string
  category: FileCategory
  title: string
  description?: string | null
  latest_version: number
  content_type?: string
  size_bytes?: number
  created_at: string
  updated_at: string
}
