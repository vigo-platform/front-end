import type { ApiResponse } from '../../features/auth/types/auth.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  code: string
  status: number
  data: unknown

  constructor(
    message: string,
    code: string,
    status: number,
    data: unknown,
  ) {
    super(message)

    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.data = data
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const headers = new Headers(options.headers)

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = payload as Partial<ApiResponse<unknown>> | null

    throw new ApiError(
      error?.message ?? 'Something went wrong.',
      error?.code ?? 'UNKNOWN_ERROR',
      response.status,
      error?.data ?? null,
    )
  }

  return payload as ApiResponse<T>
}