import { apiRequest } from '../../../shared/api/client'
import type {
  CoachPlanCreateRequest,
  CoachPlanFormOptions,
  CoachPlanPatchRequest,
  CoachPublicPlanDetail,
  ManagedCoachPlan,
} from '../types/coach.types'

const auth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
})

export interface OwnedCoachPlanDetail extends Omit<CoachPublicPlanDetail, 'coach_id'> {
  coach_id: number
  is_active: boolean
  is_archived: boolean
  status: string
  created_at: string
  updated_at: string
}

export const planService = {
  // Public summaries are included in GET /api/v1/coaches/{coach_id}. The backend
  // currently exposes individual public details through the singular /plan route.
  async getPublicPlan(coachId: string | number, planId: string | number) {
    return (await apiRequest<CoachPublicPlanDetail>(
      `/api/v1/coaches/${encodeURIComponent(String(coachId))}/plan/${encodeURIComponent(String(planId))}`,
    )).data
  },

  async getMyPlans(accessToken: string) {
    return (await apiRequest<ManagedCoachPlan[]>('/api/v1/coaches/me/plans', auth(accessToken))).data
  },

  async getMyPlan(accessToken: string, planId: string | number) {
    return (await apiRequest<OwnedCoachPlanDetail>(
      `/api/v1/coaches/me/plan/${encodeURIComponent(String(planId))}`,
      auth(accessToken),
    )).data
  },

  async getFormOptions(accessToken: string) {
    return (await apiRequest<CoachPlanFormOptions>('/api/v1/coaches/me/plan/form-options', auth(accessToken))).data
  },

  async getFeatureFormDetails(accessToken: string, featureId: string | number) {
    return (await apiRequest<unknown>(
      `/api/v1/coaches/me/plan/form-options/features/${encodeURIComponent(String(featureId))}`,
      auth(accessToken),
    )).data
  },

  async createPlan(accessToken: string, data: CoachPlanCreateRequest) {
    return (await apiRequest<ManagedCoachPlan>('/api/v1/coaches/me/plans', {
      ...auth(accessToken),
      method: 'POST',
      body: data,
    })).data
  },

  async updatePlan(accessToken: string, planId: string | number, data: CoachPlanPatchRequest) {
    return (await apiRequest<ManagedCoachPlan>(
      `/api/v1/coaches/me/plans/${encodeURIComponent(String(planId))}`,
      { ...auth(accessToken), method: 'PATCH', body: data },
    )).data
  },

  async archivePlan(accessToken: string, planId: string | number) {
    return (await apiRequest<null>(
      `/api/v1/coaches/me/plans/${encodeURIComponent(String(planId))}`,
      { ...auth(accessToken), method: 'DELETE' },
    )).data
  },

  async unarchivePlan(accessToken: string, planId: string | number) {
    return (await apiRequest<null>(
      `/api/v1/coaches/me/plans/${encodeURIComponent(String(planId))}/unarchive`,
      { ...auth(accessToken), method: 'POST' },
    )).data
  },
}
