import { apiRequest } from '../../../shared/api/client'
import { normalizeUserProfile } from '../../user/services/user.service'
import type { UserProfile } from '../../user/types/user.types'
import type {
  AdminCoachApplication,
  AdminCoachFilters,
  AdminPage,
  AdminPublicCoachApplication,
  AdminUser,
  AdminUserFilters,
  AdminUserStatusRequest,
} from '../types/admin.types'

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  return query.toString()
}

const auth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
})

function normalizePage<T, R>(data: unknown, normalize: (item: unknown) => R): AdminPage<R> {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const content = Array.isArray(raw.content) ? raw.content : []
  return {
    page: Number(raw.page ?? 0),
    size: Number(raw.size ?? content.length),
    total_elements: Number(raw.total_elements ?? raw.totalElements ?? content.length),
    total_pages: Number(raw.total_pages ?? raw.totalPages ?? 1),
    content: content.map(normalize),
  }
}

function normalizeLegacyCoach(data: unknown): AdminCoachApplication {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const get = (snake: string, camel: string) => raw[snake] ?? raw[camel]
  return {
    coach_id: String(get('coach_id', 'coachId') ?? ''),
    display_name: String(get('display_name', 'displayName') ?? ''),
    headline: (raw.headline ?? undefined) as string | undefined,
    bio: String(raw.bio ?? ''),
    specialties: Array.isArray(raw.specialties) ? raw.specialties.filter((x): x is string => typeof x === 'string') : [],
    experience_years: Number(get('experience_years', 'experienceYears') ?? 0),
    certifications: Array.isArray(raw.certifications) ? raw.certifications as AdminCoachApplication['certifications'] : [],
    instagram_handle: (get('instagram_handle', 'instagramHandle') ?? null) as string | null,
    result_image_urls: Array.isArray(get('result_image_urls', 'resultImageUrls'))
      ? get('result_image_urls', 'resultImageUrls') as string[]
      : [],
    avatar_url: (get('avatar_url', 'avatarUrl') ?? null) as string | null,
    status: raw.status as AdminCoachApplication['status'],
    rejection_reason: (get('rejection_reason', 'rejectionReason') ?? null) as string | null,
    min_plan_price: get('min_plan_price', 'minPlanPrice') == null ? null : Number(get('min_plan_price', 'minPlanPrice')),
    active_athletes_count: Number(get('active_athletes_count', 'activeAthletesCount') ?? 0),
    created_at: String(get('created_at', 'createdAt') ?? ''),
    updated_at: String(get('updated_at', 'updatedAt') ?? ''),
  }
}

function normalizePublicApplication(data: unknown): AdminPublicCoachApplication {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  return {
    applicationId: String(raw.applicationId ?? raw.application_id ?? ''),
    fullName: String(raw.fullName ?? raw.full_name ?? ''),
    firstName: (raw.firstName ?? raw.first_name) as string | undefined,
    lastName: (raw.lastName ?? raw.last_name) as string | undefined,
    email: String(raw.email ?? ''),
    phone: (raw.phone ?? null) as string | null,
    profileImageFileId: (raw.profileImageFileId ?? raw.profile_image_file_id ?? null) as string | null,
    certificates: Array.isArray(raw.certificates) ? raw.certificates as AdminPublicCoachApplication['certificates'] : [],
    experiences: Array.isArray(raw.experiences) ? raw.experiences as AdminPublicCoachApplication['experiences'] : [],
    headline: (raw.headline ?? null) as string | null,
    bio: String(raw.bio ?? ''),
    specialties: Array.isArray(raw.specialties) ? raw.specialties.filter((x): x is string => typeof x === 'string') : [],
    experienceYears: Number(raw.experienceYears ?? raw.experience_years ?? 0),
    instagramHandle: (raw.instagramHandle ?? raw.instagram_handle ?? null) as string | null,
    locale: raw.locale as 'fa' | 'en' | undefined,
    status: (raw.status ?? 'PENDING') as AdminPublicCoachApplication['status'],
    rejectionReason: (raw.rejectionReason ?? raw.rejection_reason ?? null) as string | null,
    reviewedAt: (raw.reviewedAt ?? raw.reviewed_at ?? null) as string | null,
    invitationExpiresAt: (raw.invitationExpiresAt ?? raw.invitation_expires_at ?? null) as string | null,
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? ''),
  }
}

export const adminService = {
  async listUsers(token: string, filters: AdminUserFilters = {}) {
    const query = queryString({
      page: filters.page ?? 0,
      size: filters.size ?? 10,
      role: filters.role,
      status: filters.status,
      q: filters.q?.trim(),
    })
    const data = (await apiRequest<unknown>('/api/v1/users?' + query, auth(token))).data
    return normalizePage<unknown, AdminUser>(data, (item) => normalizeUserProfile(item))
  },

  async getUser(token: string, id: string) {
    const data = (await apiRequest<unknown>('/api/v1/users/' + encodeURIComponent(id), auth(token))).data
    return normalizeUserProfile(data)
  },

  async setUserStatus(token: string, id: string, body: AdminUserStatusRequest) {
    const data = (await apiRequest<unknown>('/api/v1/users/' + encodeURIComponent(id) + '/status', {
      ...auth(token),
      method: 'PATCH',
      body: { status: body.status, ...(body.reason ? { reason: body.reason } : {}) },
    })).data
    return normalizeUserProfile(data)
  },

  async listCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches?' + query, auth(token))).data
    return normalizePage<unknown, AdminCoachApplication>(data, normalizeLegacyCoach)
  },

  async getCoachApplication(token: string, id: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/' + encodeURIComponent(id), auth(token))).data
    return normalizeLegacyCoach(data)
  },

  async approveCoach(token: string, id: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/' + encodeURIComponent(id) + '/approve', {
      ...auth(token), method: 'POST',
    })).data
    return normalizeLegacyCoach(data)
  },

  async rejectCoach(token: string, id: string, reason: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/' + encodeURIComponent(id) + '/reject', {
      ...auth(token), method: 'POST', body: { reason },
    })).data
    return normalizeLegacyCoach(data)
  },

  async listPublicCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications?' + query, auth(token))).data
    return normalizePage<unknown, AdminPublicCoachApplication>(data, normalizePublicApplication)
  },

  async getPublicCoachApplication(token: string, applicationId: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId), auth(token))).data
    return normalizePublicApplication(data)
  },

  async approvePublicCoachApplication(token: string, applicationId: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId) + '/approve', {
      ...auth(token), method: 'POST',
    })).data
    return normalizePublicApplication(data)
  },

  async rejectPublicCoachApplication(token: string, applicationId: string, reason: string) {
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId) + '/reject', {
      ...auth(token), method: 'POST', body: { reason },
    })).data
    return normalizePublicApplication(data)
  },
}
