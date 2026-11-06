export function getAvatarUrl(value?: string | null) {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  return baseUrl.replace(/\/$/, '') + value
}
