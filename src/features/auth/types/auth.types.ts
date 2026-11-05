export interface ApiResponse<T> {
  success: boolean
  code?: string
  message: string
  messageFa?: string
  timestamp: string
  data: T
}

export type OtpChannel = 'EMAIL' | 'SMS'
export type LoginStep = 'SUCCESS' | 'OTP_REQUIRED' | 'PASSWORD_CHANGE_REQUIRED'

export interface TokenPair {
  tokenType: 'Bearer'
  accessToken: string
  accessExpiresIn: number
  refreshToken: string
  refreshExpiresIn: number
}
export interface LoginPasswordRequest { identifier: string; password: string }
export interface LoginOtpEmailRequest { email: string }
export interface LoginOtpPhoneRequest { phone: string }
export interface VerifyOtpRequest { mfaToken: string; otp: string }
export interface LoginResponseData {
  step: LoginStep
  tokens?: TokenPair
  challenge?: { mfaToken: string; channel: OtpChannel; expiresIn: number; resendAfter: number }
  passwordChange?: { passwordChangeToken: string; expiresIn: number }
}
export interface SignupInitiateRequest { identifier: string }
export interface ContactOtpChallenge { mfaToken: string; channel: OtpChannel; expiresIn: number; resendAfter: number }
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
export interface RefreshTokenResponse { tokens: TokenPair }
export interface LogoutRequest { refreshToken: string }
export interface ResetPasswordInitiateRequest { identifier: string }
export interface ResetPasswordInitiateResponse { step: 'OTP_REQUIRED'; challenge: ContactOtpChallenge }
export interface ResetPasswordVerifyRequest { mfaToken: string; otp: string }
export type ResetPasswordVerifyResponse =
  | { step: 'OTP_REQUIRED'; challenge: ContactOtpChallenge }
  | { step: 'PASSWORD_RESET_REQUIRED'; passwordReset: { passwordResetToken: string; expiresIn: number } }
export interface ResetPasswordCompleteRequest {
  passwordResetToken: string
  newPassword: string
}
export interface PasswordResetCompleteResponse { step: 'PASSWORD_UPDATED_LOGIN_REQUIRED' }
export interface RateLimitData { retryAfterSeconds?: number; retry_after_seconds?: number; lockedUntil?: string }
