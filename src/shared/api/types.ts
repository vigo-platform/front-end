export interface ApiResponse<T> {
  success: boolean
  code?: string
  message: string
  messageFa?: string
  message_fa?: string
  timestamp: string
  data: T
}

export interface ApiErrorPayload {
  code?: string
  message?: string
  messageFa?: string
  message_fa?: string
  data?: unknown
}
