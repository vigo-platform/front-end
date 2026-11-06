export type UserRole = 'ATHLETE' | 'COACH' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

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

export interface UpdateProfileRequest {
  display_name: string
  avatar_url?: string | null
  birth_date?: string | null
  gender?: Gender
}
