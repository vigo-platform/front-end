import { apiRequest } from '../../../lib/api/client'
import type { UserProfile } from '../types/user.types'

export const userService = {
  async getMe(accessToken: string): Promise<UserProfile> {
    const response = await apiRequest<UserProfile>('/api/v1/users/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response.data
  },
}
