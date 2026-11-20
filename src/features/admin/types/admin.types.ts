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
  email?: string; phone?: string | null; first_name?: string; last_name?: string
  profile_image_file_id?: string | null; invitation_expires_at?: string | null
  certificates?: Array<{
    certificate_id?: number; category?: 'UNIVERSITY' | 'FEDERATION' | 'SKILL'
    title: string; issuer?: string | null; field_of_study?: string | null
    degree?: string | null; file_id?: string
  }>
  experiences?: Array<{
    experience_id?: number; title: string; organization?: string | null
    description?: string | null; duration_months?: number | null
  }>
}
export type AdminUser = UserProfile

export type PublicCoachApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface AdminPublicCoachApplication {
  applicationId: string
  fullName: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string | null
  profileImageFileId?: string | null
  certificates: Array<{
    certificateId?: number
    category: 'UNIVERSITY' | 'FEDERATION' | 'SKILL'
    title: string
    issuer?: string | null
    fieldOfStudy?: string | null
    degree?: string | null
    fileId: string
  }>
  experiences: Array<{
    experienceId?: number
    title: string
    organization?: string | null
    description?: string | null
    durationMonths?: number | null
  }>
  headline?: string | null
  bio: string
  specialties: string[]
  experienceYears: number
  instagramHandle?: string | null
  locale?: 'fa' | 'en'
  status: PublicCoachApplicationStatus
  rejectionReason?: string | null
  reviewedAt?: string | null
  invitationExpiresAt?: string | null
  createdAt: string
  updatedAt: string
}
