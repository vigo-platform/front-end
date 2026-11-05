// Common API response envelope
export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  message_fa: string
  timestamp: string
  data: T
}
export type LoginStep = 'SUCCESS' | '2FA-EMAIL' | '2FA-PHONE'
export interface LoginPasswordRequest { identifier: string; password: string }
export interface LoginOtpEmailRequest { email: string }
export interface LoginOtpPhoneRequest { phone: string }
export interface VerifyOtpRequest { mfa_token: string; otp: string }
export interface LoginResponseData {
  step: LoginStep
  access_token: string | null
  refresh_token: string | null
  mfa_token: string | null
}
export interface SignupInitiateRequest { email: string }
export interface SignupInitiateResponse { mfa_token: string }
export interface SignupVerifyRequest { mfa_token: string; otp: string }
export interface SignupVerifyResponse { temp_token: string }
export interface SignupCompleteRequest {
  temp_token: string
  first_name: string
  last_name: string
  password: string
}
export interface RefreshTokenRequest { refresh_token: string }
export interface RefreshTokenResponse { access_token: string; refresh_token: string }
export interface LogoutRequest { refresh_token: string }
export interface ResetPasswordInitiateRequest { email: string }
export interface ResetPasswordInitiateResponse { mfaToken: string }
export interface ResetPasswordVerifyRequest { mfaToken: string; otp: string }
export interface ResetPasswordVerifyResponse {
  step: 'PASSWORD_RESET_REQUIRED'
  passwordReset: { passwordResetToken: string; expiresIn: number }
}
export interface ResetPasswordCompleteRequest {
  passwordResetToken: string
  newPassword: string
}
export interface RateLimitData { retry_after_seconds: number; locked_until: string }
