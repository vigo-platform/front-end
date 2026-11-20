import { apiRequest } from '../../../shared/api/client'
import type { PublicPlanPage, PublicPlanQuery } from '../types/plan.types'

export const planCatalogService = {
  async getPublicPlans(params: PublicPlanQuery = {}) {
    const query = new URLSearchParams()
    if (params.page !== undefined) query.set('page', String(params.page))
    if (params.size !== undefined) query.set('size', String(params.size))
    if (params.coach_id) query.set('coach_id', params.coach_id)
    const suffix = query.size > 0 ? `?${query.toString()}` : ''
    return (await apiRequest<PublicPlanPage>(`/api/v1/plans${suffix}`)).data
  },
}
