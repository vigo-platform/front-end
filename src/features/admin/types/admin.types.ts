import type { UserProfile, UserRole, UserStatus } from '../../user/types/user.types'

export type CoachApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export interface AdminPage<T> { page: number; size: number; total_elements: number; total_pages: number; content: T[] }
export interface AdminUserFilters { page?: number; size?: number; role?: UserRole | ''; status?: UserStatus | ''; q?: string }
export interface AdminCoachFilters { page?: number; size?: number; status?: CoachApplicationStatus | '' }
export interface AdminUserStatusRequest { status: UserStatus; reason?: string }
export interface AdminCoachApplication {
  coach_id: string; display_name: string; headline?: string; bio: string; specialties: string[]
  experience_years: number; certifications?: Array<{ title: string; issuer?: string; year?: number }>
  instagram_handle?: string | null; result_image_urls?: string[]; avatar_url?: string | null
  status?: CoachApplicationStatus; rejection_reason?: string | null; min_plan_price?: number | null
  active_athletes_count?: number; created_at?: string; updated_at?: string
}
export type AdminUser = UserProfile
