import { apiRequest } from '../../../shared/api/client'
import type {
  CoachDirectoryPage,
  CoachDirectoryQuery,
  CoachProfile,
  CoachProfileRequest,
} from '../types/coach.types'


function normalizeCoachProfile(data: unknown, fallbackCoachId = ''): CoachProfile {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const stringValue = (snake: string, camel: string, fallback = ''): string =>
    String(raw[snake] ?? raw[camel] ?? fallback)
  const numberValue = (snake: string, camel: string): number =>
    Number(raw[snake] ?? raw[camel] ?? 0)
  const nullableNumber = (snake: string, camel: string): number | null => {
    const value = raw[snake] ?? raw[camel]
    return value == null ? null : Number(value)
  }
  const stringArray = (snake: string, camel: string): string[] => {
    const value = raw[snake] ?? raw[camel]
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  }

  return {
    coach_id: stringValue('coach_id', 'coachId', fallbackCoachId),
    display_name: stringValue('display_name', 'displayName'),
    headline: stringValue('headline', 'headline'),
    bio: stringValue('bio', 'bio'),
    specialties: stringArray('specialties', 'specialties'),
    experience_years: numberValue('experience_years', 'experienceYears'),
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications as CoachProfile['certifications']
      : [],
    instagram_handle: (raw.instagram_handle ?? raw.instagramHandle ?? null) as string | null,
    result_image_urls: stringArray('result_image_urls', 'resultImageUrls'),
    avatar_url: (raw.avatar_url ?? raw.avatarUrl ?? null) as string | null,
    status: raw.status as CoachProfile['status'],
    rejection_reason: (raw.rejection_reason ?? raw.rejectionReason ?? null) as string | null,
    min_plan_price: nullableNumber('min_plan_price', 'minPlanPrice'),
    active_athletes_count: numberValue('active_athletes_count', 'activeAthletesCount'),
    created_at: stringValue('created_at', 'createdAt') || undefined,
    updated_at: stringValue('updated_at', 'updatedAt') || undefined,
    has_active_plan: (raw.has_active_plan ?? raw.hasActivePlan) as boolean | undefined,
    price: nullableNumber('price', 'price'),
    compare_at_price: nullableNumber('compare_at_price', 'compareAtPrice'),
    currency: (raw.currency ?? null) as string | null,
  }
}

export const coachService = {
  async search(params: CoachDirectoryQuery = {}): Promise<CoachDirectoryPage> {
    const query = new URLSearchParams()

    if (params.page !== undefined) query.set('page', String(params.page))
    if (params.size !== undefined) query.set('size', String(params.size))

    const suffix = query.size > 0 ? '?' + query.toString() : ''
    const response = await apiRequest<CoachDirectoryPage>('/api/v1/coaches' + suffix)
    return response.data
  },

  async getProfile(coachId: string): Promise<CoachProfile> {
    const response = await apiRequest<unknown>(
      '/api/v1/coaches/' + encodeURIComponent(coachId),
    )
    return normalizeCoachProfile(response.data, coachId)
  },

  async getMyProfile(accessToken: string): Promise<CoachProfile> {
    const response = await apiRequest<unknown>('/api/v1/coaches/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return normalizeCoachProfile(response.data)
  },

  async updateMyProfile(accessToken: string, data: CoachProfileRequest): Promise<CoachProfile> {
    const response = await apiRequest<unknown>('/api/v1/coaches/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: data,
    })
    return normalizeCoachProfile(response.data)
  },
}
