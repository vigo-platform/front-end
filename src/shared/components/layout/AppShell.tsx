import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
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
    <div className="flex min-h-screen flex-col bg-[#f6f6f3] text-[#171815] md:flex-row">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopBar title={title} />

        <nav
          aria-label="Main navigation"
          className="flex gap-2 overflow-x-auto border-b border-[#e8e8e1] bg-[#fbfbf9] px-4 py-3 md:hidden"
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/athlete' || item.href === '/coach'}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${isActive ? 'bg-[#c7f36b] text-[#171914]' : 'bg-[#efefe9] text-[#74756d]'}`
              }
            >
              {item.label}
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
