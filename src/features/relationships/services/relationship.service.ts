import { apiRequest } from '../../../shared/api/client'
import type {
  CoachAthleteRelation,
  RelationPage,
  RelationQuery,
} from '../types/relationship.types'

const auth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
})

function queryString(params: RelationQuery = {}) {
  const query = new URLSearchParams()
  if (params.page !== undefined) query.set('page', String(params.page))
  if (params.size !== undefined) query.set('size', String(params.size))
  if (params.status) query.set('status', params.status)
  return query.size > 0 ? `?${query.toString()}` : ''
}

export const relationshipService = {
  async getMyAthletes(accessToken: string, params: RelationQuery = {}) {
    return (await apiRequest<RelationPage>(
      `/api/v1/coaches/me/athletes${queryString(params)}`,
      auth(accessToken),
    )).data
  },

  async getMyCoaches(accessToken: string, status?: RelationQuery['status']) {
    const suffix = status ? `?status=${encodeURIComponent(status)}` : ''
    return (await apiRequest<CoachAthleteRelation[]>(
      `/api/v1/athletes/me/coaches${suffix}`,
      auth(accessToken),
    )).data
  },
}
