import { apiRequest } from '../../../shared/api/client'
import type { AthleteCoachRelation } from '../types/athlete-relation.types'

export const athleteService = {
  async getMyCoaches(accessToken: string): Promise<AthleteCoachRelation[]> {
    const response = await apiRequest<AthleteCoachRelation[]>('/api/v1/athletes/me/coaches', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  },
}
