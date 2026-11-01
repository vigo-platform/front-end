
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-6 bg-canvas p-3 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Main Section */}
      <section className="relative flex min-h-[calc(100vh-24px)] flex-col bg-white px-6 py-8 sm:px-11">
        {/* Logo */}
        <header>
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-2xl font-bold text-ink no-underline"
          >
            Vigo
            <span className="size-[7px] rounded-full bg-accent" />
          </a>
        </header>

        {/* Form Content */}
        <div className="my-auto flex w-full justify-center py-12">
          <div className="w-full max-w-[355px]">{children}</div>
        </div>

        {/* Footer */}
        <footer className="flex items-center gap-2 text-[11px] text-muted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4 shrink-0"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>A shared space for athletes and coaches.</span>
        </footer>
      </section>

      {/* Brand Section */}
      <aside className="relative flex min-h-[calc(100vh-24px)] flex-col overflow-hidden rounded-[18px] border border-border bg-canvas p-8 sm:p-10">
        {/* Label */}
        <div className="flex items-center gap-2 text-[10px] text-[#45453f]">
          <span className="h-[2px] w-5 bg-accent" />
          TRAIN WITH CLARITY
        </div>

        {/* Visual */}
        <div className="relative mx-auto mt-12 h-[370px] w-full max-w-[290px] shrink-0">
          {/* Orbits */}
          <div className="absolute left-1/2 top-1/2 h-[230px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#e5e5df]" />
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#e5e5df]" />
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#e5e5df]" />
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#e5e5df]" />

          {/* Orbit Dots */}
          <span className="absolute left-[8%] top-[28%] size-2 rounded-full bg-accent" />
          <span className="absolute bottom-[29%] right-[5%] size-2 rounded-full bg-ink" />

          {/* Center */}
          <div className="absolute left-1/2 top-1/2 flex size-[118px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[52px] font-bold text-ink">
            V
          </div>

          {/* Steps */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between text-[11px] text-muted">
            <span>Plan</span>
            <i className="h-px w-8 bg-border" />
            <strong className="font-medium text-ink">Train</strong>
            <i className="h-px w-8 bg-border" />
            <span>Progress</span>
          </div>
        </div>

        {/* Brand Message */}
        <div className="mt-auto">
          <h2 className="mb-3 text-[30px] leading-[1.25] font-bold tracking-[-1px] text-ink">
            Move with
            <br />
            purpose.
          </h2>

          <p className="text-[13px] leading-relaxed text-[#62625c]">
            Clear plans. Stronger connections.
            <br />
            One place to bring your training together.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-between text-[11px] text-muted">
          <span>Built for your next step.</span>
          <span className="size-[7px] rounded-full bg-accent" />
        </div>
      </aside>
    </main>
  )
}

export default AuthLayout
