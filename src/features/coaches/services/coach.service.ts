import { apiRequest } from '../../../shared/api/client'
import type {
  CoachDirectoryPage,
  CoachDirectoryQuery,
  CoachProfile,
  CoachProfileRequest,
} from '../types/coach.types'


function normalizeCoachProfile(data: unknown, fallbackCoachId = ''): CoachProfile {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
  const pick = (snake: string, camel: string) => raw[snake] ?? raw[camel]
  const stringValue = (snake: string, camel: string, fallback = ''): string =>
    String(pick(snake, camel) ?? fallback)
  const numberValue = (snake: string, camel: string): number =>
    Number(pick(snake, camel) ?? 0)
  const nullableNumber = (snake: string, camel: string): number | null => {
    const value = pick(snake, camel)
    return value == null ? null : Number(value)
  }
  const stringArray = (snake: string, camel: string): string[] => {
    const value = pick(snake, camel)
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  }

  const plans = Array.isArray(raw.plans) ? raw.plans.map((plan) => {
    const item = (plan && typeof plan === 'object' ? plan : {}) as Record<string, unknown>
    const features = Array.isArray(item.features) ? item.features : []
    return {
      id: Number(item.id ?? 0),
      title: String(item.title ?? ''),
      summary: item.summary == null ? null : String(item.summary),
      price: Number(item.price ?? 0),
      compare_at_price: item.compare_at_price == null && item.compareAtPrice == null
        ? null
        : Number(item.compare_at_price ?? item.compareAtPrice),
      currency: String(item.currency ?? ''),
      duration_days: Number(item.duration_days ?? item.durationDays ?? 0),
      is_recommended: Boolean(item.is_recommended ?? item.isRecommended),
      display_order: Number(item.display_order ?? item.displayOrder ?? 0),
      features: features.map((feature) => {
        const value = (feature && typeof feature === 'object' ? feature : {}) as Record<string, unknown>
        return { id: Number(value.id ?? 0), code: String(value.code ?? ''), label: String(value.label ?? '') }
      }),
    }
  }) : []

  return {
    coach_id: stringValue('coach_id', 'coachId', fallbackCoachId),
    display_name: stringValue('display_name', 'displayName'),
    headline: stringValue('headline', 'headline'),
    bio: stringValue('bio', 'bio'),
    specialties: stringArray('specialties', 'specialties'),
    experience_years: numberValue('experience_years', 'experienceYears'),
    certifications: Array.isArray(raw.certifications) ? raw.certifications as CoachProfile['certifications'] : [],
    instagram_handle: (pick('instagram_handle', 'instagramHandle') ?? null) as string | null,
    result_image_urls: stringArray('result_image_urls', 'resultImageUrls'),
    avatar_url: (pick('avatar_url', 'avatarUrl') ?? null) as string | null,
    status: raw.status as CoachProfile['status'],
    rejection_reason: (pick('rejection_reason', 'rejectionReason') ?? null) as string | null,
    min_plan_price: nullableNumber('min_plan_price', 'minPlanPrice'),
    active_athletes_count: numberValue('active_athletes_count', 'activeAthletesCount'),
    created_at: stringValue('created_at', 'createdAt') || undefined,
    updated_at: stringValue('updated_at', 'updatedAt') || undefined,
    has_active_plan: (raw.has_active_plan ?? raw.hasActivePlan) as boolean | undefined,
    price: nullableNumber('price', 'price'),
    compare_at_price: nullableNumber('compare_at_price', 'compareAtPrice'),
    currency: (raw.currency ?? null) as string | null,
    plans,
  }
}

function toCoachProfilePayload(data: CoachProfileRequest) {
  return {
    displayName: data.display_name,
    ...(data.headline !== undefined ? { headline: data.headline } : {}),
    bio: data.bio,
    specialties: data.specialties,
    experienceYears: data.experience_years,
    ...(data.certifications !== undefined ? { certifications: data.certifications } : {}),
    ...(data.instagram_handle !== undefined ? { instagramHandle: data.instagram_handle } : {}),
    ...(data.result_image_urls !== undefined ? { resultImageUrls: data.result_image_urls } : {}),
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
      body: toCoachProfilePayload(data),
    })
    return normalizeCoachProfile(response.data)
  },
}
