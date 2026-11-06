import { apiRequest } from '../../../shared/api/client'
import type { UpdateProfileRequest, UserProfile } from '../types/user.types'

export const userService = {
  async getMe(accessToken: string): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/api/v1/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  },

  async updateMe(accessToken: string, data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/api/v1/users/me', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: data,
    })
    return response.data
  },
}
