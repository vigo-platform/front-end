import { useTranslation } from 'react-i18next'
import { type ThemePreference } from '../theme/ThemeContext'
import { useTheme } from '../theme/useTheme'

const options: ThemePreference[] = ['light', 'dark', 'system']

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const labels: Record<ThemePreference, string> = {
    light: t('ui.Light'),
    dark: t('ui.Dark'),
    system: t('ui.System'),
  }
  const ariaLabel = t('ui.Theme selection')

  return (
    <label className="inline-flex shrink-0 items-center">
      <span className="sr-only">{ariaLabel}</span>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemePreference)}
        aria-label={ariaLabel}
        className="h-9 max-w-[104px] rounded-lg border border-border-default bg-surface px-2 text-[11px] font-semibold text-fg outline-none transition focus:border-brand"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  )
}

export default ThemeSwitcher
