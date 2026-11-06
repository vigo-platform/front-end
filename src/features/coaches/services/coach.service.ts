import { apiRequest } from '../../../shared/api/client'
import type {
  CoachPage,
  CoachPlan,
  CoachProfile,
  CoachSearchParams,
} from '../types/coach.types'

export const coachService = {
  async search(params: CoachSearchParams = {}): Promise<CoachPage> {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value))
      }
    })

    const suffix = query.size > 0 ? '?' + query.toString() : ''
    const response = await apiRequest<CoachPage>('/api/v1/coaches' + suffix)
    return response.data
  },

  async getProfile(coachId: string): Promise<CoachProfile> {
    const response = await apiRequest<CoachProfile>(
      '/api/v1/coaches/' + encodeURIComponent(coachId),
    )
    return response.data
  },

  async getPlans(coachId: string): Promise<CoachPlan[]> {
    const response = await apiRequest<CoachPlan[]>(
      '/api/v1/coaches/' + encodeURIComponent(coachId) + '/plans',
    )
    return response.data
  },
}
