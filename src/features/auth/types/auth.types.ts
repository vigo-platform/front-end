// Common API response envelope

export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  message_fa: string
  timestamp: string
  data: T
}

// Login

export type LoginStep = 'SUCCESS' | '2FA-EMAIL' | '2FA-PHONE'

export interface LoginPasswordRequest {
  identifier: string
  password: string
}

export interface LoginOtpEmailRequest {
  email: string
}

export interface LoginOtpPhoneRequest {
  phone: string
}

export interface VerifyOtpRequest {
  mfa_token: string
  otp: string
}

export interface LoginResponseData {
  step: LoginStep
  access_token: string | null
  refresh_token: string | null
  mfa_token: string | null
}

// Signup

export interface SignupInitiateRequest {
  email: string
}

export interface SignupInitiateResponse {
  mfa_token: string
}

export interface SignupVerifyRequest {
  mfa_token: string
  otp: string
}

export interface SignupVerifyResponse {
  temp_token: string
}

export interface SignupCompleteRequest {
  temp_token: string
  first_name: string
  last_name: string
  password: string
}

// Token management

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

export interface LogoutRequest {
  refresh_token: string
}

// Password reset

export interface ResetPasswordInitiateRequest {
  email: string
}

export interface ResetPasswordVerifyRequest {
  mfa_token: string
  otp: string
}

export interface ResetPasswordCompleteRequest {
  temp_token: string
  password: string
}

// Rate limiting

export interface RateLimitData {
  retry_after_seconds: number
  locked_until: string
}