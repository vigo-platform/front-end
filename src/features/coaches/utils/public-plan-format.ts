import type { TFunction } from 'i18next'

export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatPlanDays(value: number, locale: string, t: TFunction) {
  return value === 1 ? t('plans.day') : t('plans.days', { number: formatNumber(value, locale) })
}
