import { apiRequest } from '../../../shared/api/client'
import type {
  CoachDirectoryPage,
  CoachDirectoryQuery,
  CoachProfile,
  CoachProfileRequest,
} from '../types/coach.types'

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
