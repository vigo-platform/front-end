import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/auth-context'

interface CoachPublicLayoutProps {
  children: ReactNode
  title: string
}

function CoachPublicLayout({ children, title }: CoachPublicLayoutProps) {
  const { isPreview } = useAuth()
  const homePath = isPreview ? '/_preview/athlete' : '/'
  const coachesPath = isPreview ? '/_preview/athlete/coaches' : '/coaches'
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to={homePath} className="text-xl font-extrabold tracking-tight">
            Vigo<span className="text-[#9bcf3f]">.</span>
          </Link>
          <nav aria-label="Public navigation" className="flex items-center gap-4">
            <Link to={coachesPath} className="text-xs font-semibold text-muted transition hover:text-ink">
              Find a coach
            </Link>
            {!isPreview && (
              <>
                <Link to="/login" className="text-xs font-semibold text-muted transition hover:text-ink">
                  Log in
                </Link>
                <Link to="/register" className="rounded-full bg-ink px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#30352a]">
                  Get started
                </Link>
              </>
            )}
          </nav>
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
