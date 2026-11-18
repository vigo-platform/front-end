import { Link } from 'react-router-dom'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { previewCoachPlans, previewCoachRelations } from '../../auth/data/dashboard-preview'
import { loadWorkoutDraft } from '../services/workout-draft.service'
import { useTranslation } from 'react-i18next'

interface CoachDashboardPageProps {
  isPreview?: boolean
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
}

function CoachDashboardPage({ isPreview = false }: CoachDashboardPageProps) {
  const { t, i18n } = useTranslation()
  const { user, isPreview: previewContext } = useAuth()
  const preview = isPreview || previewContext
  const coachPath = preview ? '/_preview/coach' : '/coach'
  const firstName = user?.display_name?.trim().split(/\s+/)[0] || t('ui.Coach')
  const draft = loadWorkoutDraft()
  const activeAthletes = preview ? previewCoachRelations.filter((item) => item.status === 'ACTIVE') : []
  const activePlans = preview ? previewCoachPlans.filter((item) => item.status === 'ACTIVE') : []

  return (
    <AppShell title={t("ui.Overview")}>
      <div className="mx-auto w-full max-w-[1240px] space-y-8">
        <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#82975e]">{t("ui.Coach workspace")}</p>
            <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1.5px] text-[#171815] sm:text-[42px]">
              {t('ui.Welcome back, {{name}}.', { name: firstName })}
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-[#77786f]">{t("ui.Your athletes, coaching plans, and content workspace.")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dce8c8] bg-[#f2f8e8] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-[#526a2e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9bcf43]" />{t('ui.' + (user?.status || 'Status unavailable'))}
            </span>
            <span className="rounded-full border border-[#e2e2db] bg-white px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[1px] text-[#77786f]">
              {t('ui.Member since')} {formatDate(user?.created_at)}
            </span>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">{t("ui.Active athletes")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{preview ? String(activeAthletes.length).padStart(2, '0') : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">{t("ui.Coach relationships")}</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">{t("ui.Active plans")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{preview ? String(activePlans.length).padStart(2, '0') : '—'}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">{t("ui.Published coaching plans")}</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">{t("ui.Workout draft")}</p>
            <p className="mt-4 text-[30px] font-bold tracking-[-1px] text-[#20211d]">{draft.exercises.length.toString().padStart(2, '0')}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">{t("ui.Exercises in this browser")}</p>
          </article>
          <article className="rounded-[18px] border border-[#e1e1da] bg-white p-5">
            <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-[#888980]">{t("ui.Account role")}</p>
            <p className="mt-4 text-[25px] font-bold tracking-[-0.8px] text-[#20211d]">{t("ui.Coach")}</p>
            <p className="mt-1 text-[10px] text-[#898a81]">{t("ui.Your current Vigo role")}</p>
          </article>
        </section>

        <section className="relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#171916] p-7 text-white sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-[330px] w-[330px] rounded-full border-[48px] border-white/[0.04]" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1.2px] text-[#d8e9bc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />{t("ui.Your coaching workspace")}
            </span>
            <h2 className="mt-6 max-w-lg text-[29px] font-bold leading-[1.12] tracking-[-1.1px] sm:text-[36px]">{t("ui.Build a better plan for every athlete.")}</h2>
            <p className="mt-3 max-w-md text-[12px] leading-6 text-white/60">{t("ui.Organize your exercise resources and prepare structured workout drafts for your coaching workflow.")}</p>
          </div>
          <Link to={coachPath + '/workouts/new'} className="relative mt-8 inline-flex h-11 w-fit items-center gap-3 rounded-full bg-[#c7f36b] px-5 text-[11px] font-bold text-[#171914] transition hover:bg-[#d4fa83]">
            {t("ui.Create workout draft")} <span aria-hidden="true">→</span>
          </Link>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-8 text-[150px] font-black leading-none tracking-[-16px] text-white/[0.045]">V</span>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">{t("ui.Relationships")}</p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t("ui.Your athletes")}</h2>
              </div>
              <span className="text-[9px] font-semibold text-[#92938a]">{preview ? activeAthletes.length + ' ' + t('ui.active') : t('ui.Not connected')}</span>
            </div>
            {preview ? (
              <div className="mt-5 divide-y divide-[#edede8]">
                {activeAthletes.map((relation) => (
                  <div key={relation.relation_id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff2e9] text-[11px] font-bold text-[#60783a]">
                      {relation.athlete_name.split(/\s+/).map((part: string) => part[0]).slice(0, 2).join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-[#34352f]">{relation.athlete_name}</p>
                      <p className="mt-1 truncate text-[10px] text-[#888980]">{relation.plan_title}</p>
                    </div>
                    <span className="rounded-full bg-[#f0f5e8] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.8px] text-[#60783a]">{t('ui.ACTIVE')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[#d9dacf] bg-[#fbfbf8] px-5 py-7 text-center">
                <p className="text-[12px] font-semibold text-[#34352f]">{t("ui.Athlete relationships will appear here")}</p>
                <p className="mt-1 text-[10px] text-[#85867d]">{t("ui.The current backend does not expose coach–athlete relationship endpoints.")}</p>
              </div>
            )}
          </article>

          <article className="rounded-[20px] border border-[#e1e1da] bg-white p-6 sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">{t("ui.Published content")}</p>
                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.7px]">{t("ui.Your plans")}</h2>
              </div>
              <span className="text-[9px] font-semibold text-[#92938a]">{preview ? activePlans.length + ' ' + t('ui.active') : t('ui.Not connected')}</span>
            </div>
            {preview ? (
              <div className="mt-5 space-y-3">
                {activePlans.map((plan) => (
                  <div key={plan.plan_id} className="rounded-xl bg-[#f7f8f3] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[12px] font-bold text-[#34352f]">{plan.title}</h3>
                      <span className="rounded-full bg-white px-2 py-1 text-[8px] font-bold uppercase text-[#60783a]">{t('ui.' + plan.status)}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-5 text-[#85867d]">{plan.description}</p>
                    <p className="mt-3 text-[10px] font-semibold text-[#526a2e]">{plan.duration_days} {t('ui.days')} · {new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US').format(plan.price)} تومان</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-[#d9dacf] bg-[#fbfbf8] px-5 py-7 text-center">
                <p className="text-[12px] font-semibold text-[#34352f]">{t("ui.Your published plans will appear here")}</p>
                <p className="mt-1 text-[10px] text-[#85867d]">{t("ui.The current backend does not expose coach plan endpoints.")}</p>
              </div>
            )}
          </article>
        </section>

        <section>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#888980]">{t("ui.Workspace tools")}</p>
            <h2 className="mt-2 text-[22px] font-bold tracking-[-0.8px] text-[#20211d]">{t("ui.Create and organize")}</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link to={coachPath + '/exercises'} className="group rounded-[18px] border border-[#e1e1da] bg-white p-5 transition hover:-translate-y-1 hover:border-[#cbd9b3] hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-[#96978d]">01 / LIBRARY</span>
              <h3 className="mt-5 text-[15px] font-bold text-[#20211d]">{t("ui.Exercise library")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-[#77786f]">{t("ui.Browse the current exercise interface and sample movement catalog.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-[#526a2e] group-hover:gap-3">Open library →</span>
            </Link>
            <Link to={coachPath + '/workouts/new'} className="group rounded-[18px] border border-[#e1e1da] bg-white p-5 transition hover:-translate-y-1 hover:border-[#cbd9b3] hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-[#96978d]">02 / BUILDER</span>
              <h3 className="mt-5 text-[15px] font-bold text-[#20211d]">{t("ui.Workout builder")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-[#77786f]">{t("ui.Arrange exercises, sets, reps, and rest periods in a local draft.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-[#526a2e] group-hover:gap-3">Build a workout →</span>
            </Link>
            <Link to={coachPath + '/workouts'} className="group rounded-[18px] border border-[#e1e1da] bg-white p-5 transition hover:-translate-y-1 hover:border-[#cbd9b3] hover:shadow-[0_14px_32px_rgba(35,42,23,0.06)]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-[#96978d]">03 / DRAFTS</span>
              <h3 className="mt-5 text-[15px] font-bold text-[#20211d]">{t("ui.My workouts")}</h3>
              <p className="mt-2 text-[10px] leading-5 text-[#77786f]">{t("ui.Continue editing workout drafts saved in this browser.")}</p>
              <span className="mt-5 inline-flex gap-2 text-[10px] font-bold text-[#526a2e] group-hover:gap-3">View drafts →</span>
            </Link>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e1e1da] bg-[#eff2e9] p-6 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#71864c]">Account</p>
              <h2 className="mt-2 text-[17px] font-bold text-[#20231b]">{user?.display_name || 'Coach profile'}</h2>
              <p className="mt-1 text-[11px] text-[#73786a]">{user?.email || 'Email not available'} · {user?.phone || 'No phone number'}</p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-[#d7dfcb] bg-white/70 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[1px] text-[#71864c]">{t('ui.' + (user?.status || 'Status unavailable'))}</span>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

export default CoachDashboardPage
