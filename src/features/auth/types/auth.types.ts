export interface ApiResponse<T> {
  success: boolean
  code?: string
  message: string
  messageFa?: string
  timestamp: string
  data: T
}

export type OtpChannel = 'EMAIL' | 'SMS' | 'IN_APP'
export type ContactOtpChannel = 'EMAIL' | 'SMS'
export type LoginStep = 'SUCCESS' | 'OTP_REQUIRED' | 'PASSWORD_CHANGE_REQUIRED'

export interface TokenPair {
  tokenType: 'Bearer'
  accessToken: string
  accessExpiresIn: number
  refreshToken: string
  refreshExpiresIn: number
}

export interface LoginPasswordRequest {
  identifier: string
  password: string
}
export interface LoginOtpEmailRequest { email: string }
export interface LoginOtpPhoneRequest { phone: string }
export interface VerifyOtpRequest { mfaToken: string; otp: string }

export interface OtpChallenge {
  mfaToken: string
  channel: OtpChannel
  expiresIn: number
  resendAfter: number
}
export interface LoginResponseData {
  step: LoginStep
  tokens?: TokenPair
  challenge?: OtpChallenge
  passwordChange?: PasswordChangeGrant
}

export interface SignupInitiateRequest { identifier: string }
export interface ContactOtpChallenge extends OtpChallenge {
  channel: ContactOtpChannel
}
export interface SignupVerifyRequest { mfaToken: string; otp: string }
export interface SignupVerifyResponse { registrationToken: string; expiresIn: number }
export interface SignupCompleteRequest {
  registrationToken: string
  firstName?: string
  lastName?: string
  password: string
}
export interface RegisteredAccount {
  userId: number
  status: string
  tokens?: TokenPair
}

export interface RefreshTokenRequest { refreshToken: string }
export type RefreshTokenResponse = TokenPair
export type LogoutRequest = Record<string, never>

export interface ResetPasswordInitiateRequest { identifier: string }
export interface ResetPasswordInitiateResponse {
  step: 'OTP_REQUIRED'
  challenge: ContactOtpChallenge
}
export interface PasswordResetGrant { passwordResetToken: string; expiresIn: number }
export interface ResetPasswordVerifyRequest { mfaToken: string; otp: string }
export type ResetPasswordVerifyResponse =
  | { step: 'OTP_REQUIRED'; challenge: ContactOtpChallenge }
  | { step: 'PASSWORD_RESET_REQUIRED'; passwordReset: PasswordResetGrant }
export interface ResetPasswordCompleteRequest {
  passwordResetToken: string
  newPassword: string
}
export interface PasswordResetCompleteResponse {
  step: 'PASSWORD_UPDATED_LOGIN_REQUIRED'
}

export interface PasswordChangeGrant {
  passwordChangeToken: string
  expiresIn: number
}
export interface PasswordChangeInitiateRequest {
  currentPassword: string
}
export type PasswordChangeInitiateResponse =
  | { step: 'OTP_REQUIRED'; challenge: OtpChallenge }
  | { step: 'PASSWORD_CHANGE_REQUIRED'; passwordChange: PasswordChangeGrant }
export interface PasswordChangeVerifyResponse {
  step: 'PASSWORD_CHANGE_REQUIRED'
  passwordChange: PasswordChangeGrant
}
export interface PasswordChangeCompleteRequest {
  passwordChangeToken: string
  newPassword: string
}
export interface PasswordUpdatedResponse {
  step: 'PASSWORD_UPDATED_LOGIN_REQUIRED'
}
export type ExpiredPasswordCompleteResponse =
  | LoginResponseData
  | PasswordUpdatedResponse

export interface AuthSettings {
  loginEnabled: boolean
  registerEnabled: boolean
  defaultOtpChannel: OtpChannel
  emailNotificationEnabled: boolean
  smsNotificationEnabled: boolean
  inAppNotificationEnabled: boolean
}
export interface RateLimitData {
  retryAfterSeconds?: number
  retry_after_seconds?: number
  lockedUntil?: string
}
