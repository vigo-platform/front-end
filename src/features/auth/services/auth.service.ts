import { apiRequest } from '../../../lib/api/client'
import type {
  LoginPasswordRequest, LoginOtpEmailRequest, LoginOtpPhoneRequest,
  LoginResponseData, VerifyOtpRequest, SignupInitiateRequest,
  SignupInitiateResponse, SignupVerifyRequest, SignupVerifyResponse,
  SignupCompleteRequest, RefreshTokenRequest, RefreshTokenResponse,
  LogoutRequest, ResetPasswordInitiateRequest, ResetPasswordInitiateResponse,
  ResetPasswordVerifyRequest, ResetPasswordVerifyResponse,
  ResetPasswordCompleteRequest,
} from '../types/auth.types'

const AUTH_BASE = '/api/auth'

export const authService = {
  loginWithPassword(data: LoginPasswordRequest) {
    return apiRequest<LoginResponseData>(`${AUTH_BASE}/login-password`, { method: 'POST', body: data })
  },
  loginWithEmailOtp(data: LoginOtpEmailRequest) {
    return apiRequest<LoginResponseData>(`${AUTH_BASE}/login-otp-email`, { method: 'POST', body: data })
  },
  loginWithPhoneOtp(data: LoginOtpPhoneRequest) {
    return apiRequest<LoginResponseData>(`${AUTH_BASE}/login-otp-phone`, { method: 'POST', body: data })
  },
  verifyOtp(data: VerifyOtpRequest) {
    return apiRequest<LoginResponseData>(`${AUTH_BASE}/verify`, { method: 'POST', body: data })
  },
  initiateSignup(data: SignupInitiateRequest) {
    return apiRequest<SignupInitiateResponse>(`${AUTH_BASE}/signup/initiate`, { method: 'POST', body: data })
  },
  verifySignup(data: SignupVerifyRequest) {
    return apiRequest<SignupVerifyResponse>(`${AUTH_BASE}/signup/verify`, { method: 'POST', body: data })
  },
  completeSignup(data: SignupCompleteRequest) {
    return apiRequest<null>(`${AUTH_BASE}/signup/complete`, { method: 'POST', body: data })
  },
  refreshToken(data: RefreshTokenRequest) {
    return apiRequest<RefreshTokenResponse>(`${AUTH_BASE}/refresh`, { method: 'POST', body: data })
  },
  logout(data: LogoutRequest) {
    return apiRequest<null>(`${AUTH_BASE}/logout`, { method: 'POST', body: data })
  },
  initiatePasswordReset(data: ResetPasswordInitiateRequest) {
    return apiRequest<ResetPasswordInitiateResponse>('/api/v1/auth/password/reset/initiate', { method: 'POST', body: data })
  },
  verifyPasswordReset(data: ResetPasswordVerifyRequest) {
    return apiRequest<ResetPasswordVerifyResponse>('/api/v1/auth/password/reset/verify', { method: 'POST', body: data })
  },
  completePasswordReset(data: ResetPasswordCompleteRequest) {
    return apiRequest<{ step: 'PASSWORD_UPDATED_LOGIN_REQUIRED' }>('/api/v1/auth/password/reset/complete', { method: 'POST', body: data })
  },
}
