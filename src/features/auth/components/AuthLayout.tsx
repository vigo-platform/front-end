import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <main className="grid min-h-screen grid-cols-1 gap-4 bg-page p-3 sm:gap-5 sm:p-5 lg:grid-cols-[minmax(0,1fr)_440px]">
      <section className="relative flex min-h-[calc(100vh-24px)] flex-col rounded-2xl border border-border-default bg-surface px-5 py-6 shadow-sm sm:min-h-[calc(100vh-40px)] sm:px-8 sm:py-8 lg:px-11">
        <header className="flex items-center justify-between gap-4">
          <a href="/" aria-label="Vigo" className="inline-flex items-center">
            <img src="/vigo-logo.svg" alt="Vigo" className="vigo-logo h-9 w-auto max-w-[112px] object-contain" />
          </a>
        </header>

        <div className="my-auto flex w-full justify-center py-8 sm:py-12">
          <div className="w-full max-w-[440px] rounded-2xl border border-border-default bg-page/60 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:p-9">
            {children}
          </div>
        </div>

        <footer className="flex items-center gap-2 text-[11px] text-fg-secondary">
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
          <span>{t("ui.A shared space for athletes and coaches.")}</span>
        </footer>
      </section>

      <aside className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[18px] border border-border-default bg-page p-7 sm:min-h-[calc(100vh-40px)] sm:p-10">
        <div className="flex items-center gap-2 text-[10px] text-fg-secondary">
          <span className="h-[2px] w-5 bg-brand" />
          {t("ui.TRAIN WITH CLARITY")}
        </div>

        <div className="relative mx-auto mt-8 h-[300px] w-full max-w-[290px] shrink-0 sm:mt-12 sm:h-[370px]">
          <div className="absolute left-1/2 top-1/2 h-[230px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-border-default" />
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-border-default" />
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-border-default" />
          <div className="absolute left-1/2 top-1/2 h-[320px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-border-default" />
          <span className="absolute left-[8%] top-[28%] size-2 rounded-full bg-brand" />
          <span className="absolute bottom-[29%] right-[5%] size-2 rounded-full bg-fg" />
          <div className="absolute left-1/2 top-1/2 flex size-[118px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-[52px] font-bold text-on-brand">
            V
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between text-[11px] text-fg-secondary">
            <span>{t("ui.Plan")}</span>
            <i className="h-px w-8 bg-border-default" />
            <strong className="font-medium text-fg">{t("ui.Train")}</strong>
            <i className="h-px w-8 bg-border-default" />
            <span>{t('ui.Progress')}</span>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <h2 className="mb-3 text-[30px] leading-[1.25] font-bold tracking-[-1px] text-fg">
            {t("ui.Move with")}
            <br />
            {t("ui.purpose.")}
          </h2>
          <p className="text-[13px] leading-relaxed text-fg-secondary">
            {t("ui.Clear plans. Stronger connections.")}
            <br />
            {t("ui.One place to bring your training together.")}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between text-[11px] text-fg-secondary sm:mt-16">
          <span>{t("ui.Built for your next step.")}</span>
          <span className="size-[7px] rounded-full bg-brand" />
        </div>
      </aside>
    </main>
  )
}

export default AuthLayout
