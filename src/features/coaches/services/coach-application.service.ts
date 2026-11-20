import { apiRequest } from '../../../shared/api/client'
import type { CoachApplicationRequest, CoachApplicationSummary } from '../types/coach.types'

export const coachApplicationService = {
  async submit(data: CoachApplicationRequest) {
    return (await apiRequest<CoachApplicationSummary>('/api/v1/coaches/applications', {
      method: 'POST',
      body: data,
    })).data
  },

  async getStatus(lookupToken: string) {
    return (await apiRequest<Omit<CoachApplicationSummary, 'lookupToken'>>(
      `/api/v1/coaches/applications/${encodeURIComponent(lookupToken)}`,
    )).data
  },
}
