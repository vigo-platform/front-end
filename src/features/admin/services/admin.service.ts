import { apiRequest } from '../../../shared/api/client'
import type { AdminCoachApplication, AdminCoachFilters, AdminPage, AdminUser, AdminUserFilters, AdminUserStatusRequest } from '../types/admin.types'

function queryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)) })
  return query.toString()
}
const auth = (accessToken: string) => ({ headers: { Authorization: `Bearer ${accessToken}` } })

export const adminService = {
  async listUsers(token: string, filters: AdminUserFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, role: filters.role, status: filters.status, q: filters.q?.trim() })
    return (await apiRequest<AdminPage<AdminUser>>('/api/v1/users?' + query, auth(token))).data
  },
  async getUser(token: string, id: string) {
    return (await apiRequest<AdminUser>('/api/v1/users/' + encodeURIComponent(id), auth(token))).data
  },
  async setUserStatus(token: string, id: string, body: AdminUserStatusRequest) {
    return (await apiRequest<AdminUser>('/api/v1/users/' + encodeURIComponent(id) + '/status', { ...auth(token), method: 'PATCH', body })).data
  },
  async listCoachApplications(token: string, filters: AdminCoachFilters = {}) {
    const query = queryString({ page: filters.page ?? 0, size: filters.size ?? 10, status: filters.status })
    return (await apiRequest<AdminPage<AdminCoachApplication>>('/api/v1/admin/coaches?' + query, auth(token))).data
  },
  async getCoachApplication(token: string, id: string) {
    return (await apiRequest<AdminCoachApplication>('/api/v1/admin/coaches/' + encodeURIComponent(id), auth(token))).data
  },
  async approveCoach(token: string, id: string) {
    return (await apiRequest<AdminCoachApplication>('/api/v1/admin/coaches/' + encodeURIComponent(id) + '/approve', { ...auth(token), method: 'POST' })).data
  },
  async rejectCoach(token: string, id: string, reason: string) {
    return (await apiRequest<AdminCoachApplication>('/api/v1/admin/coaches/' + encodeURIComponent(id) + '/reject', { ...auth(token), method: 'POST', body: { reason } })).data
  },
}
