import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { loadWorkoutDraft } from '../services/workout-draft.service'
import { useTranslation } from 'react-i18next'

function CoachWorkoutsPage() {
  const { t } = useTranslation()
  const { isPreview } = useAuth()
  const coachPath = isPreview ? '/_preview/coach' : '/coach'
  const draft = loadWorkoutDraft()
  const hasSavedDraft = Boolean(draft.updated_at)

  return (
    <AppShell title={t("ui.My workouts")}>
      <div className="mx-auto w-full max-w-6xl space-y-7">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Link to={coachPath} className="text-sm font-medium text-fg-secondary hover:text-fg">
              {t("ui.← Coach workspace")}
            </Link>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              {t("ui.My workouts")}
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              {t("ui.Review the workout draft saved in this browser.")}
            </p>
          </div>
          <Link
            to={coachPath + '/workouts/new'}
            className="inline-flex h-11 items-center justify-center rounded-full bg-fg px-5 text-sm font-semibold text-fg-inverse transition hover:bg-sidebar-hover"
          >
            {t("ui.Create workout")}
          </Link>
        </section>

        {hasSavedDraft ? (
          <article className="rounded-2xl border border-border-default bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-fg-secondary">
                {t("ui.Draft")}
              </span>
              <span className="text-xs text-fg-secondary">
                {t('ui.Updated')} {new Date(draft.updated_at as string).toLocaleString()}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold">
              {draft.title || t('ui.Untitled workout')}
            </h3>
            {draft.description && (
              <p className="mt-2 text-sm leading-6 text-fg-secondary">
                {draft.description}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-fg-secondary">
              <span>{t('ui.{{count}} exercises', { count: draft.exercises.length })}</span>
              <span>
                {t('ui.{{count}} total sets', { count: draft.exercises.reduce((total, item) => total + item.sets, 0) })}
              </span>
            </div>
            <Link
              to={coachPath + '/workouts/new'}
              className="mt-6 inline-flex text-sm font-semibold text-ink hover:text-success-fg"
            >
              {t('ui.Continue editing')} →
            </Link>
          </article>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default bg-surface px-6 py-14 text-center">
            <h3 className="font-semibold">{t("ui.No saved workouts yet")}</h3>
            <p className="mt-2 text-sm text-fg-secondary">
              {t("ui.Create a workout and save it as a draft to see it here.")}
            </p>
            <Link
              to={coachPath + '/workouts/new'}
              className="mt-5 inline-flex rounded-full bg-fg px-5 py-3 text-sm font-semibold text-fg-inverse"
            >
              {t("ui.Start building")}
            </Link>
          </div>
        )}

        <p className="rounded-xl border border-border-default bg-surface-muted p-4 text-xs leading-5 text-fg-secondary">
          {t('ui.Drafts are stored in this browser only. Publishing and sharing workouts with athletes require the backend Workout API, which is not included in the current contracts.')}
        </p>
      </div>
    </AppShell>
  )
}

export default CoachWorkoutsPage
