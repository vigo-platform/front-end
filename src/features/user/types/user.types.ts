export type UserRole = 'ATHLETE' | 'COACH' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'SUSPENDED'
export interface UserProfile {
  user_id: string
  email: string
  display_name?: string
  phone?: string | null
  avatar_url?: string | null
  birth_date?: string | null
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at?: string
}
