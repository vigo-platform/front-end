import type { ApiErrorPayload, ApiResponse } from './types'
import i18n from '../../i18n'

const configuredBase = import.meta.env.VITE_API_BASE_URL ?? ''
const API_BASE_URL = import.meta.env.DEV && /^https?:\/\//i.test(configuredBase) ? '' : configuredBase

export class ApiError extends Error {
  code: string
  status: number
  data: unknown
  serverMessage: string | null

  constructor(serverMessage: string | null, code: string, status: number, data: unknown) {
    super(`API request failed (${status})`)
    this.name = 'ApiError'
    this.serverMessage = serverMessage
    this.code = code
    this.status = status
    this.data = data
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

function localizedError(payload: unknown, status: number): ApiError {
  const error = payload as ApiErrorPayload | null
  const isPersian = i18n.resolvedLanguage?.startsWith('fa') ?? false
  const localizedMessage = isPersian
    ? error?.messageFa ?? error?.message_fa ?? error?.message
    : error?.message ?? error?.messageFa ?? error?.message_fa

  return new ApiError(localizedMessage ?? null, error?.code ?? 'UNKNOWN_ERROR', status, error?.data ?? null)
}

function requestHeaders(options: RequestOptions, hasJsonBody: boolean) {
  const headers = new Headers(options.headers)
  headers.set('Accept-Language', i18n.resolvedLanguage ?? 'en')
  if (hasJsonBody) headers.set('Content-Type', 'application/json')
  return headers
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders(options, options.body !== undefined && !isFormData),
    body: options.body === undefined
      ? undefined
      : isFormData
        ? options.body as FormData
        : JSON.stringify(options.body),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) throw localizedError(payload, response.status)
  return payload as ApiResponse<T>
}

export async function apiDownload(path: string, options: Omit<RequestOptions, 'body'> = {}): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders(options, false),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw localizedError(payload, response.status)
  }

  return response.blob()
}
