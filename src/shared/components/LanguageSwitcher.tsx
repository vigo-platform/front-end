import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage?.startsWith('fa') ? 'fa' : 'en'

  return (
    <div
      className="inline-flex shrink-0 items-center rounded-full border border-[#e4e4dc] bg-white p-1"
      role="group"
      aria-label={language === 'fa' ? 'انتخاب زبان' : 'Language selection'}
    >
      <button
        type="button"
        lang="en"
        aria-pressed={language === 'en'}
        onClick={() => void i18n.changeLanguage('en')}
        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${language === 'en' ? 'bg-[#171815] text-white' : 'text-[#66665f] hover:bg-[#f2f2ed]'}`}
      >
        EN
      </button>
      <button
        type="button"
        lang="fa"
        aria-pressed={language === 'fa'}
        onClick={() => void i18n.changeLanguage('fa')}
        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${language === 'fa' ? 'bg-[#171815] text-white' : 'text-[#66665f] hover:bg-[#f2f2ed]'}`}
      >
        فارسی
      </button>
    </div>
  )
}

export default LanguageSwitcher
