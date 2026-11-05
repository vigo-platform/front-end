import { apiRequest } from '../../../lib/api/client'
import type {
  LoginPasswordRequest, LoginOtpEmailRequest, LoginOtpPhoneRequest,
  LoginResponseData, VerifyOtpRequest, SignupInitiateRequest,
  ContactOtpChallenge, SignupVerifyRequest, SignupVerifyResponse,
  SignupCompleteRequest, RegisteredAccount, RefreshTokenRequest,
  RefreshTokenResponse, ResetPasswordInitiateRequest,
  ResetPasswordInitiateResponse, ResetPasswordVerifyRequest,
  ResetPasswordVerifyResponse, ResetPasswordCompleteRequest,
  PasswordResetCompleteResponse,
} from '../types/auth.types'

const AUTH_BASE = '/api/v1/auth'

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
    return apiRequest<ContactOtpChallenge>(`${AUTH_BASE}/register/initiate`, { method: 'POST', body: data })
  },
  verifySignup(data: SignupVerifyRequest) {
    return apiRequest<SignupVerifyResponse>(`${AUTH_BASE}/register/verify`, { method: 'POST', body: data })
  },
  completeSignup(data: SignupCompleteRequest) {
    return apiRequest<RegisteredAccount>(`${AUTH_BASE}/register/complete`, { method: 'POST', body: data })
  },
  refreshToken(data: RefreshTokenRequest) {
    return apiRequest<RefreshTokenResponse>(`${AUTH_BASE}/refresh`, { method: 'POST', body: data })
  },
  logout(accessToken: string) {
    return apiRequest<null>(`${AUTH_BASE}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } })
  },
  initiatePasswordReset(data: ResetPasswordInitiateRequest) {
    return apiRequest<ResetPasswordInitiateResponse>(`${AUTH_BASE}/password/reset/initiate`, { method: 'POST', body: data })
  },
  verifyPasswordReset(data: ResetPasswordVerifyRequest) {
    return apiRequest<ResetPasswordVerifyResponse>(`${AUTH_BASE}/password/reset/verify`, { method: 'POST', body: data })
  },
  completePasswordReset(data: ResetPasswordCompleteRequest) {
    return apiRequest<PasswordResetCompleteResponse>(`${AUTH_BASE}/password/reset/complete`, { method: 'POST', body: data })
  },
}
