import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const language = i18n.resolvedLanguage?.startsWith('fa') ? 'fa' : 'en'

  return (
    <div
      className="inline-flex shrink-0 items-center rounded-full border border-border-default bg-surface p-1"
      role="group"
      aria-label={t('ui.Language selection')}
    >
      <button
        type="button"
        lang="en"
        aria-pressed={language === 'en'}
        onClick={() => void i18n.changeLanguage('en')}
        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${language === 'en' ? 'bg-fg text-fg-inverse' : 'text-fg-secondary hover:bg-surface-muted'}`}
      >
        EN
      </button>
      <button
        type="button"
        lang="fa"
        aria-pressed={language === 'fa'}
        onClick={() => void i18n.changeLanguage('fa')}
        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${language === 'fa' ? 'bg-fg text-fg-inverse' : 'text-fg-secondary hover:bg-surface-muted'}`}
      >
        فارسی
      </button>
    </div>
  )
}

export default LanguageSwitcher
