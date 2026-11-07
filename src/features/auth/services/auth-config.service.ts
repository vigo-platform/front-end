import { authService } from './auth.service'
import type { AuthSettings } from '../types/auth.types'
import type { AuthConfig, OtpChannel } from '../types/auth-config.types'

function getEnabledChannels(settings: AuthSettings): OtpChannel[] {
  const channels: OtpChannel[] = []
  if (settings.emailNotificationEnabled) channels.push('EMAIL')
  if (settings.smsNotificationEnabled) channels.push('PHONE')

  const defaultChannel: OtpChannel | null =
    settings.defaultOtpChannel === 'EMAIL'
      ? 'EMAIL'
      : settings.defaultOtpChannel === 'SMS'
        ? 'PHONE'
        : null

  if (defaultChannel) {
    const defaultIndex = channels.indexOf(defaultChannel)
    if (defaultIndex > 0) channels.unshift(channels.splice(defaultIndex, 1)[0])
  }

  return channels
}

export const authConfigService = {
  async getConfig() {
    const response = await authService.getSettings()
    const enabledChannels = getEnabledChannels(response.data)
    const data: AuthConfig = {
      signup: { enabledChannels },
      login: { enabledChannels },
    }

    return { data, settings: response.data }
  },
}
