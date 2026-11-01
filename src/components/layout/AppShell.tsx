import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface AppShellProps {
  children: ReactNode
  title: string
}

function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell