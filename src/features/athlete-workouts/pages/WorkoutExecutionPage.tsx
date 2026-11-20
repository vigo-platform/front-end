import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useTranslation } from 'react-i18next'

function WorkoutExecutionPage() {
  const { t } = useTranslation()
  return (
    <AppShell title={t("ui.Workout unavailable")}>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border-default bg-surface p-8">
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-success-fg">{t("ui.Athlete space")}</p>
        <h1 className="mt-3 text-xl font-semibold text-fg">{t("ui.Workout execution is not available yet")}</h1>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          {t("ui.The backend does not currently provide workout detail or result-submission endpoints. This route is kept for the future integration, but it does not load demo data or save local results.")}
        </p>
        <Link to="/athlete/workouts" className="mt-5 inline-flex text-sm font-semibold text-success-fg hover:underline">
          {t("ui.← Back to my workouts")}
        </Link>
      </div>
    </AppShell>
  )
}

export default WorkoutExecutionPage
