import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useTranslation } from 'react-i18next'

function AthleteWorkoutsPage() {
  const { t } = useTranslation()
  return (
    <AppShell title={t("ui.My workouts")}>
      <div className="mx-auto w-full max-w-4xl space-y-7">
        <section>
          <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-secondary">{t("ui.Athlete space")}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{t("ui.My workouts")}</h1>
          <p className="mt-2 text-sm text-fg-secondary">{t("ui.Assigned sessions and training results will appear here when the workout backend is available.")}</p>
        </section>

        <section className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-fg-secondary">{t("ui.Backend integration pending")}</p>
          <h2 className="mt-3 text-xl font-semibold text-fg">{t("ui.Workout endpoints are not available yet")}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-fg-secondary">
            {t("ui.The current Vigo backend does not expose endpoints for assigned workouts, workout details, or submitting execution results. No sample workouts or browser-only results are shown here.")}
          </p>
          <Link to="/coaches" className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-fg px-5 text-xs font-semibold text-fg-inverse transition hover:bg-[#30352a]">
            {t("ui.Explore coaches")}
          </Link>
        </section>
      </div>
    </AppShell>
  )
}

export default AthleteWorkoutsPage
