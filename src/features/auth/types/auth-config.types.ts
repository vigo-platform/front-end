export type OtpChannel = 'EMAIL' | 'PHONE'

export interface AuthConfig {
  signup: {
    enabledChannels: OtpChannel[]
  }
  login: {
    enabledChannels: OtpChannel[]
  }
}