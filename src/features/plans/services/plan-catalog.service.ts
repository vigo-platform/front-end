import { apiRequest } from '../../../shared/api/client'
import type { PublicPlan } from '../types/plan.types'

export const planCatalogService = {
  async getPublicPlans() {
    return (await apiRequest<PublicPlan[]>('/api/v1/plans')).data
  },
}
