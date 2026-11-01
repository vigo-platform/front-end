import type { AuthConfig } from '../types/auth-config.types'

export const mockAuthConfig: AuthConfig = {
  signup: {
    enabledChannels: ['EMAIL'],
  },

  login: {
    enabledChannels: ['PHONE'],
  },
}