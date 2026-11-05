import { apiRequest } from '../../../lib/api/client'
import type {
  LoginPasswordRequest, LoginOtpEmailRequest, LoginOtpPhoneRequest,
  LoginResponseData, VerifyOtpRequest, SignupInitiateRequest,
  ContactOtpChallenge, SignupVerifyRequest, SignupVerifyResponse,
  SignupCompleteRequest, RegisteredAccount, RefreshTokenRequest,
  RefreshTokenResponse, ResetPasswordInitiateRequest,
  ResetPasswordInitiateResponse, ResetPasswordVerifyRequest,
  ResetPasswordVerifyResponse, ResetPasswordCompleteRequest,
  PasswordResetCompleteResponse, PasswordChangeInitiateRequest,
  PasswordChangeInitiateResponse, PasswordChangeVerifyResponse,
  PasswordChangeCompleteRequest, PasswordUpdatedResponse,
  ExpiredPasswordCompleteResponse, AuthSettings,
} from '../types/auth.types'

const AUTH_BASE = '/api/v1/auth'

function bearer(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` }
}

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
    return apiRequest<null>(`${AUTH_BASE}/logout`, { method: 'POST', headers: bearer(accessToken) })
  },
  logoutAll(accessToken: string) {
    return apiRequest<null>(`${AUTH_BASE}/logout-all`, { method: 'POST', headers: bearer(accessToken) })
  },
  initiatePasswordChange(data: PasswordChangeInitiateRequest, accessToken: string) {
    return apiRequest<PasswordChangeInitiateResponse>(`${AUTH_BASE}/password/change/initiate`, {
      method: 'POST', headers: bearer(accessToken), body: data,
    })
  },
  verifyPasswordChange(data: VerifyOtpRequest, accessToken: string) {
    return apiRequest<PasswordChangeVerifyResponse>(`${AUTH_BASE}/password/change/verify`, {
      method: 'POST', headers: bearer(accessToken), body: data,
    })
  },
  completePasswordChange(data: PasswordChangeCompleteRequest, accessToken: string) {
    return apiRequest<PasswordUpdatedResponse>(`${AUTH_BASE}/password/change/complete`, {
      method: 'POST', headers: bearer(accessToken), body: data,
    })
  },
  completeExpiredPassword(data: PasswordChangeCompleteRequest) {
    return apiRequest<ExpiredPasswordCompleteResponse>(`${AUTH_BASE}/password/expired/complete`, {
      method: 'POST', body: data,
    })
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
  getSettings() {
    return apiRequest<AuthSettings>(`${AUTH_BASE}/settings`)
  },
}
