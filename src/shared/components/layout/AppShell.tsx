import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../features/auth/context/auth-context'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { getNavigationItems } from '../../../app/config/navigation'
import { useTranslation } from 'react-i18next'

interface AppShellProps {
  children: ReactNode
  title: string
}

function AppShell({ children, title }: AppShellProps) {
  const { user, isPreview } = useAuth()
  const { t } = useTranslation()
  const navigationItems = getNavigationItems(user?.role, isPreview)

  return (
    <div className="flex min-h-screen flex-col bg-page text-fg md:flex-row">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar title={title} />

        <nav
          aria-label={t('navigation.main')}
          className="flex gap-2 overflow-x-auto border-b border-border-default bg-surface-subtle px-4 py-3 md:hidden"
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/athlete' || item.href === '/coach' || item.href === '/_preview/athlete' || item.href === '/_preview/coach' || item.href === '/admin' || item.href === '/_preview/admin'}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${isActive ? 'bg-brand text-on-brand' : 'bg-surface-muted text-fg-secondary'}`
              }
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
