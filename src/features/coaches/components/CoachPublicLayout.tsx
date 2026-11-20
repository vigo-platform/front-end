import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/auth-context'
import { useTranslation } from 'react-i18next'


interface CoachPublicLayoutProps {
  children: ReactNode
  title: string
}

function CoachPublicLayout({ children, title }: CoachPublicLayoutProps) {
  const { t } = useTranslation()
  const { isPreview, isAuthenticated, user } = useAuth()
  const homePath = isPreview
    ? '/_preview/athlete'
    : !isAuthenticated
      ? '/'
      : user?.role === 'COACH'
        ? '/coach'
        : user?.role === 'ADMIN'
          ? '/admin'
          : '/athlete'
  const coachesPath = isPreview ? '/_preview/athlete/coaches' : '/coaches'
  return (
    <div className="min-h-screen bg-page text-fg">
      <header className="border-b border-border-default bg-surface">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to={homePath} aria-label="Vigo home" className="inline-flex items-center"><img src="/vigo-logo.svg" alt="Vigo" className="h-8 w-auto max-w-[104px] object-contain vigo-logo" /></Link>
          <div className="flex items-center gap-3">
            <nav aria-label={t('navigation.main')} className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to={homePath} className="inline-flex items-center gap-2 rounded-full border border-border-default bg-page px-4 py-2.5 text-xs font-semibold text-fg transition hover:bg-surface-muted">
                <span aria-hidden="true">←</span> {t('ui.Back to dashboard')}
              </Link>
            ) : (
              <>
                <Link to={coachesPath} className="text-xs font-semibold text-fg-muted transition hover:text-fg">
                  {t("ui.Find a coach")}
                </Link>
                <Link to="/login" className="text-xs font-semibold text-fg-muted transition hover:text-fg">
                  {t("ui.Log in")}
                </Link>
                <Link to="/register" className="rounded-full bg-fg px-4 py-2.5 text-xs font-semibold text-fg-inverse transition hover:bg-fg/90">
                  {t("ui.Get started")}
                </Link>
              </>
            )}
            </nav>
          </div>
        </div>
      </header>
      <main className="px-4 py-7 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="sr-only">{title}</p>
          {children}
        </div>
      </main>
    </div>
  )
}

export default CoachPublicLayout
