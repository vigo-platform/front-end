import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/context/auth-context'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { getNavigationItems } from '../../../app/config/navigation'

interface AppShellProps {
  children: ReactNode
  title: string
}

function AppShell({ children, title }: AppShellProps) {
  const { user } = useAuth()
  const navigationItems = getNavigationItems(user?.role)

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />

        <nav
          aria-label="Main navigation"
          className="flex gap-2 overflow-x-auto border-b border-border bg-white px-4 py-3 md:hidden"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="shrink-0 rounded-full bg-canvas px-4 py-2 text-xs font-semibold text-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
