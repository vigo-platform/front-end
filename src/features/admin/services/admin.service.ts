import { apiRequest } from '../../../shared/api/client'
import { normalizeUserProfile } from '../../user/services/user.service'
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

function normalizePage<R>(data: unknown, normalize: (item: unknown) => R): AdminPage<R> {
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
    certifications: Array.isArray(raw.certifications) ? raw.certifications as NonNullable<AdminCoachApplication['certifications']> : [],
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

function toAdminCoachApplication(data: unknown): AdminCoachApplication {
  const application = normalizePublicApplication(data)
  return {
    coach_id: application.applicationId,
    display_name: application.fullName,
    headline: application.headline ?? undefined,
    bio: application.bio,
    specialties: application.specialties,
    experience_years: application.experienceYears,
    certifications: application.certificates.map((certificate) => ({
      title: certificate.title,
      issuer: certificate.issuer ?? undefined,
      category: certificate.category,
      field_of_study: certificate.fieldOfStudy ?? null,
      degree: certificate.degree ?? null,
      file_id: certificate.fileId,
    })),
    instagram_handle: application.instagramHandle ?? null,
    result_image_urls: [],
    avatar_url: null,
    status: application.status,
    rejection_reason: application.rejectionReason ?? null,
    created_at: application.createdAt,
    updated_at: application.updatedAt,
    email: application.email,
    phone: application.phone ?? null,
    first_name: application.firstName,
    last_name: application.lastName,
    profile_image_file_id: application.profileImageFileId ?? null,
    invitation_expires_at: application.invitationExpiresAt ?? null,
    certificates: application.certificates.map((certificate) => ({
      certificate_id: certificate.certificateId,
      category: certificate.category,
      title: certificate.title,
      issuer: certificate.issuer ?? null,
      field_of_study: certificate.fieldOfStudy ?? null,
      degree: certificate.degree ?? null,
      file_id: certificate.fileId,
    })),
    experiences: application.experiences.map((experience) => ({
      experience_id: experience.experienceId,
      title: experience.title,
      organization: experience.organization ?? null,
      description: experience.description ?? null,
      duration_months: experience.durationMonths ?? null,
    })),
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
    return normalizePage<AdminUser>(data, normalizeUserProfile)
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

  // The current admin workspace reviews anonymous applications, not only
  // applications attached to an already registered athlete account.
  async listCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications?' + query, auth(token))).data
    return normalizePage<AdminCoachApplication>(data, toAdminCoachApplication)
  },

  async getCoachApplication(token: string, applicationId: string) {
    const data = (await apiRequest<unknown>(
      '/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId),
      auth(token),
    )).data
    return toAdminCoachApplication(data)
  },

  async approveCoach(token: string, applicationId: string) {
    const data = (await apiRequest<unknown>(
      '/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId) + '/approve',
      { ...auth(token), method: 'POST' },
    )).data
    return toAdminCoachApplication(data)
  },

  async rejectCoach(token: string, applicationId: string, reason: string) {
    const data = (await apiRequest<unknown>(
      '/api/v1/admin/coaches/applications/' + encodeURIComponent(applicationId) + '/reject',
      { ...auth(token), method: 'POST', body: { reason } },
    )).data
    return toAdminCoachApplication(data)
  },

  async listLegacyCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches?' + query, auth(token))).data
    return normalizePage<AdminCoachApplication>(data, normalizeLegacyCoach)
  },

  async listPublicCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    const data = (await apiRequest<unknown>('/api/v1/admin/coaches/applications?' + query, auth(token))).data
    return normalizePage<AdminPublicCoachApplication>(data, normalizePublicApplication)
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
