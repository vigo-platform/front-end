import { apiRequest } from '../../../shared/api/client'
import type {
  CoachPage,
  CoachProfile,
  CoachProfileRequest,
  CoachSearchParams,
} from '../types/coach.types'

type ApiRecord = Record<string, unknown>

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function normalizeCoach(value: unknown): CoachProfile | null {
  if (!isRecord(value) || typeof value.coach_id !== 'string' || typeof value.display_name !== 'string') {
    return null
  }

  const certifications = Array.isArray(value.certifications)
    ? value.certifications.flatMap((item) => {
        if (!isRecord(item) || typeof item.title !== 'string') return []
        return [{
          title: item.title,
          ...(typeof item.issuer === 'string' ? { issuer: item.issuer } : {}),
          ...(typeof item.year === 'number' ? { year: item.year } : {}),
        }]
      })
    : []

  return {
    coach_id: value.coach_id,
    display_name: value.display_name,
    headline: typeof value.headline === 'string' ? value.headline : undefined,
    bio: typeof value.bio === 'string' ? value.bio : '',
    specialties: Array.isArray(value.specialties)
      ? value.specialties.filter((item): item is string => typeof item === 'string')
      : [],
    experience_years: asNumber(value.experience_years, 0),
    certifications,
    avatar_url: typeof value.avatar_url === 'string' ? value.avatar_url : null,
    status: value.status === 'PENDING' || value.status === 'APPROVED' || value.status === 'REJECTED'
      ? value.status
      : undefined,
    rejection_reason: typeof value.rejection_reason === 'string' ? value.rejection_reason : null,
    min_plan_price: typeof value.min_plan_price === 'number' ? value.min_plan_price : null,
    active_athletes_count: asNumber(value.active_athletes_count, 0),
    created_at: typeof value.created_at === 'string' ? value.created_at : undefined,
    updated_at: typeof value.updated_at === 'string' ? value.updated_at : undefined,
  }
}

function normalizeCoachPage(value: unknown): CoachPage {
  if (!isRecord(value) || !Array.isArray(value.content)) {
    throw new Error('Invalid coach directory response: expected a page with a content array.')
  }

  const content = value.content.flatMap((item) => {
    const coach = normalizeCoach(item)
    return coach ? [coach] : []
  })

  if (value.content.length > 0 && content.length === 0) {
    throw new Error('Invalid coach directory response: no valid coach records were returned.')
  }

  return {
    page: asNumber(value.page, 0),
    size: asNumber(value.size, content.length),
    total_elements: asNumber(value.total_elements, content.length),
    total_pages: asNumber(value.total_pages, content.length > 0 ? 1 : 0),
    content,
  }
}

export const coachService = {
  async search(params: CoachSearchParams = {}): Promise<CoachPage> {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value))
      }
    })

    const suffix = query.size > 0 ? '?' + query.toString() : ''
    const response = await apiRequest<unknown>('/api/v1/coaches' + suffix)
    return normalizeCoachPage(response.data)
  },

  async getProfile(coachId: string): Promise<CoachProfile> {
    const response = await apiRequest<CoachProfile>(
      '/api/v1/coaches/' + encodeURIComponent(coachId),
    )
    return response.data
  },

  async getMyProfile(accessToken: string): Promise<CoachProfile> {
    const response = await apiRequest<CoachProfile>('/api/v1/coaches/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  },

  async updateMyProfile(accessToken: string, data: CoachProfileRequest): Promise<CoachProfile> {
    const response = await apiRequest<CoachProfile>('/api/v1/coaches/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: data,
    })
    return response.data
  },
}
