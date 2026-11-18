import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const language = i18n.resolvedLanguage?.startsWith('fa') ? 'fa' : 'en'

  return (
    <div className="fixed end-4 top-4 z-[100]">
      <label className="inline-flex items-center gap-2 text-xs font-medium text-[#62625c]">
        <span className="sr-only">{t('language.switch')}</span>
        <select
          aria-label={t('language.switch')}
          value={language}
          onChange={(event) => void i18n.changeLanguage(event.target.value)}
          className="h-9 rounded-full border border-[#e4e4dc] bg-white/95 px-3 text-xs font-semibold text-[#292a25] shadow-sm outline-none backdrop-blur transition hover:border-[#b9c99b] focus-visible:ring-2 focus-visible:ring-[#c7f36b]"
        >
          <option value="en">{t('language.english')}</option>
          <option value="fa">{t('language.persian')}</option>
        </select>
      </label>
    </div>
  )
}

export default LanguageSwitcher
