import { useTranslation } from 'react-i18next'
import { type ThemePreference } from '../theme/ThemeContext'
import { useTheme } from '../theme/useTheme'

const options: ThemePreference[] = ['light', 'dark', 'system']

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()
  const isPersian = i18n.resolvedLanguage?.startsWith('fa')
  const labels = isPersian
    ? { light: 'روشن', dark: 'تیره', system: 'سیستم', aria: 'انتخاب پوسته' }
    : { light: 'Light', dark: 'Dark', system: 'System', aria: 'Theme selection' }

  return (
    <label className="inline-flex shrink-0 items-center">
      <span className="sr-only">{labels.aria}</span>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemePreference)}
        aria-label={labels.aria}
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
