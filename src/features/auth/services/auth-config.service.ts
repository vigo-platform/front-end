import { mockAuthConfig } from '../mocks/auth-config.mock'

export const authConfigService = {
  async getConfig() {
    return {
      success: true,
      data: mockAuthConfig,
    }
  },
}