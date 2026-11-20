import type { TFunction } from 'i18next'
import { ApiError } from './client'

type ErrorTranslationKey =
  | 'errors.connection'
  | 'errors.server'
  | 'errors.invalidCredentials'
  | 'errors.forbidden'
  | 'errors.notFound'
  | 'errors.invalidRequest'

/**
 * Converts technical/network/API failures into localized, user-facing copy.
 * Keep ApiError.message for diagnostics only; never render it directly.
 */
export function getUserErrorMessage(
  error: unknown,
  t: TFunction,
  fallbackKey: string,
): string {
  if (error instanceof ApiError) {
    if (error.code === 'INVALID_CREDENTIALS' || error.code === 'INVALID_OTP') {
      return t('errors.invalidCredentials')
    }
    if (error.status === 401) return t('errors.invalidCredentials')
    if (error.status === 403) return t('errors.forbidden')
    if (error.status === 404) return t('errors.notFound')
    if (error.status === 400 || error.status === 422) return t('errors.invalidRequest')
    if (error.status >= 500) return t('errors.server')
    return t(fallbackKey)
  }

  if (error instanceof TypeError) return t('errors.connection')
  return t(fallbackKey)
}
