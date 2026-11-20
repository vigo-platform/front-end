import ArrowIcon from './ArrowIcon'
import { useTranslation } from 'react-i18next'

function WorkoutPreview() {
  const { t } = useTranslation()
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -right-7 -top-7 h-36 w-36 rounded-full bg-brand/50 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-success-surface blur-3xl" />

      <div className="relative rounded-[28px] border border-border-default bg-surface p-4 shadow-[0_28px_90px_rgba(24,32,15,0.13)] sm:p-6">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted text-fg">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[12px] font-bold text-fg">{t("ui.Training overview")}</p>
              <p className="mt-0.5 text-[10px] text-fg-muted">{t("ui.Your week, in one place")}</p>
            </div>
          </div>
          <span className="rounded-full bg-surface-subtle px-3 py-1.5 text-[10px] font-semibold text-fg-secondary">
            {t("ui.WEEKLY PLAN")}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 py-5">
          <div className="rounded-2xl bg-page p-3">
            <p className="text-[10px] text-fg-muted">{t("ui.Sessions")}</p>
            <p className="mt-1 text-[23px] font-bold tracking-tight text-fg">04</p>
          </div>
          <div className="rounded-2xl bg-page p-3">
            <p className="text-[10px] text-fg-muted">{t("ui.Completed")}</p>
            <p className="mt-1 text-[23px] font-bold tracking-tight text-fg">02</p>
          </div>
          <div className="rounded-2xl bg-page p-3">
            <p className="text-[10px] text-fg-muted">{t("ui.Up next")}</p>
            <p className="mt-1 text-[17px] font-bold tracking-tight text-fg">{t("ui.Today")}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pb-3">
          <p className="text-[12px] font-bold text-fg">{t("ui.Your workouts")}</p>
          <span className="text-[10px] font-medium text-fg-muted">{t("ui.THIS WEEK")}</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 rounded-2xl border border-border-default p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-[11px] font-bold text-success-fg">
              {t("ui.MON")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-fg">{t("ui.Upper body")}</p>
              <p className="mt-1 text-[10px] text-fg-muted">{t("ui.5 exercises · Strength")}</p>
            </div>
            <span className="rounded-full bg-success-surface px-2.5 py-1 text-[9px] font-semibold text-success-fg">
              {t("ui.DONE")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-subtle p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-[11px] font-bold text-fg">
              {t("ui.WED")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-fg">{t("ui.Lower body")}</p>
              <p className="mt-1 text-[10px] text-fg-muted">{t("ui.6 exercises · Strength")}</p>
            </div>
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[9px] font-semibold text-fg-secondary">
              {t("ui.NEXT")}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border-default p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-[11px] font-bold text-fg-secondary">
              {t("ui.FRI")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-fg">{t("ui.Full body")}</p>
              <p className="mt-1 text-[10px] text-fg-muted">{t("ui.4 exercises · Strength")}</p>
            </div>
            <span className="text-[9px] font-medium text-fg-muted">{t("ui.UPCOMING")}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-fg p-3.5 text-fg-inverse">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface/10 text-brand">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold">{t("ui.A connected training routine")}</p>
            <p className="mt-1 text-[9px] text-fg-inverse/55">{t("ui.Plan · Execute · Review")}</p>
          </div>
          <span className="text-brand"><ArrowIcon diagonal /></span>
        </div>
      </div>

      <div className="absolute -bottom-7 -right-3 hidden items-center gap-2 rounded-2xl border border-border-default bg-surface px-4 py-3 shadow-xl sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-fg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[10px] font-bold text-fg">{t("ui.Stay on track")}</p>
          <p className="text-[9px] text-fg-muted">{t("ui.One shared training space")}</p>
        </div>
      </div>
    </div>
  )
}

export default WorkoutPreview
