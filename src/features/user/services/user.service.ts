import { apiRequest } from '../../../shared/api/client'
import type { UpdateProfileRequest, UserProfile, UserRole, UserStatus } from '../types/user.types'

type RawUserProfile = Record<string, unknown>

export function normalizeUserProfile(data: unknown): UserProfile {
  const raw = (data && typeof data === 'object' ? data : {}) as RawUserProfile
  const value = (snake: string, camel: string) => raw[snake] ?? raw[camel]

  return {
    user_id: String(value('user_id', 'userId') ?? ''),
    email: String(raw.email ?? ''),
    display_name: value('display_name', 'displayName') == null
      ? undefined
      : String(value('display_name', 'displayName')),
    phone: (raw.phone ?? null) as string | null,
    avatar_url: (value('avatar_url', 'avatarUrl') ?? null) as string | null,
    birth_date: (value('birth_date', 'birthDate') ?? null) as string | null,
    gender: raw.gender as UserProfile['gender'],
    role: (raw.role ?? 'ATHLETE') as UserRole,
    status: (raw.status ?? 'ACTIVE') as UserStatus,
    created_at: String(value('created_at', 'createdAt') ?? ''),
    updated_at: value('updated_at', 'updatedAt') == null
      ? undefined
      : String(value('updated_at', 'updatedAt')),
  }
}

function toApiProfile(data: UpdateProfileRequest) {
  return {
    displayName: data.display_name,
    ...(data.avatar_url !== undefined ? { avatarUrl: data.avatar_url } : {}),
    ...(data.birth_date !== undefined ? { birthDate: data.birth_date } : {}),
    ...(data.gender !== undefined ? { gender: data.gender } : {}),
  }
}

export const userService = {
  async getMe(accessToken: string): Promise<UserProfile> {
    const response = await apiRequest<unknown>('/api/v1/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return normalizeUserProfile(response.data)
  },

  async updateMe(accessToken: string, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiRequest<unknown>('/api/v1/users/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: toApiProfile(data),
    })
    return normalizeUserProfile(response.data)
  },
}
