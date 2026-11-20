import { useTranslation } from 'react-i18next'
import { useTheme } from '../theme/useTheme'

function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={t(nextTheme === 'dark' ? 'ui.Switch to dark mode' : 'ui.Switch to light mode')}
      title={t(nextTheme === 'dark' ? 'ui.Switch to dark mode' : 'ui.Switch to light mode')}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-default bg-surface text-fg transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {resolvedTheme === 'light' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export default ThemeSwitcher
