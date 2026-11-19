import { useEffect, useState, type FormEvent } from 'react'
import AppShell from '../../../shared/components/layout/AppShell'
import { useAuth } from '../../auth/context/auth-context'
import { coachService } from '../../coaches/services/coach.service'
import { previewCoachProfile as defaultPreviewCoachProfile } from '../../auth/data/dashboard-preview'
import type { CoachProfile, CoachProfileRequest } from '../../coaches/types/coach.types'
import { userService } from '../services/user.service'
import type { Gender, UpdateProfileRequest } from '../types/user.types'
import { useTranslation } from 'react-i18next'
import { ProfileSectionSkeleton } from '../../../shared/components/feedback/LoadingStates'
import { Button } from '../../../shared/components/ui'

interface ProfilePageProps {
  isPreview?: boolean
  previewCoachProfile?: CoachProfile
}

const fieldClass = 'mt-2 w-full rounded-xl border border-border-default bg-surface-subtle px-4 py-3 text-[12px] text-fg outline-none transition placeholder:text-fg-muted focus:border-brand focus:bg-surface focus:ring-2 focus:ring-focus-ring'
const labelClass = 'text-[10px] font-semibold uppercase tracking-[1px] text-fg-secondary'

function ProfilePage({ isPreview = false, previewCoachProfile }: ProfilePageProps) {
  const { t } = useTranslation()
  const { accessToken, user, updateUser, isPreview: previewContext } = useAuth()
  const previewMode = isPreview || Boolean(previewContext)
  const initialCoachProfile = previewCoachProfile ?? (previewMode ? defaultPreviewCoachProfile : null)
  const isCoach = user?.role === 'COACH'
  const [displayName, setDisplayName] = useState(user?.display_name ?? '')
  const [birthDate, setBirthDate] = useState(user?.birth_date ?? '')
  const [gender, setGender] = useState<Gender | ''>(user?.gender ?? '')
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(initialCoachProfile)
  const [headline, setHeadline] = useState(initialCoachProfile?.headline ?? '')
  const [bio, setBio] = useState(initialCoachProfile?.bio ?? '')
  const [specialties, setSpecialties] = useState(initialCoachProfile?.specialties.join(', ') ?? '')
  const [experienceYears, setExperienceYears] = useState(String(initialCoachProfile?.experience_years ?? 0))
  const [instagram, setInstagram] = useState(initialCoachProfile?.instagram_handle ?? '')
  const [isLoadingCoach, setIsLoadingCoach] = useState(isCoach && !(isPreview || previewContext))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isCoach || previewMode || !accessToken) return
    let active = true
    coachService.getMyProfile(accessToken)
      .then((profile) => {
        if (!active) return
        setCoachProfile(profile)
        setHeadline(profile.headline ?? '')
        setBio(profile.bio ?? '')
        setSpecialties(profile.specialties.join(', '))
        setExperienceYears(String(profile.experience_years))
        setInstagram(profile.instagram_handle ?? '')
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setError(requestError instanceof Error ? requestError.message : t('ui.Could not load your coach profile.'))
      })
      .finally(() => {
        if (active) setIsLoadingCoach(false)
      })
    return () => { active = false }
  }, [accessToken, isCoach, previewMode, t])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const normalizedName = displayName.trim()
    if (normalizedName.length < 2 || normalizedName.length > 60) {
      setError(t("ui.Your name must contain between 2 and 60 characters."))
      return
    }

    const coachSpecialties = specialties.split(',').map((item) => item.trim()).filter(Boolean)
    if (isCoach) {
      if (bio.trim().length < 20 || bio.trim().length > 3000) {
        setError(t("ui.Your coach bio must contain between 20 and 3000 characters."))
        return
      }
      if (coachSpecialties.length < 1 || coachSpecialties.length > 10) {
        setError(t("ui.Enter between 1 and 10 specialties, separated by commas."))
        return
      }
      if (!Number.isInteger(Number(experienceYears)) || Number(experienceYears) < 0 || Number(experienceYears) > 60) {
        setError(t("ui.Experience must be a whole number between 0 and 60."))
        return
      }
      if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
        setError(t("ui.Enter an Instagram username without the @ symbol."))
        return
      }
    }

    setIsSaving(true)
    try {
      const userPayload: UpdateProfileRequest = {
        display_name: normalizedName,
        birth_date: birthDate || null,
        ...(gender ? { gender } : {}),
      }

      if (previewMode) {
        if (!user) throw new Error('Preview user is unavailable.')
        updateUser({
          ...user,
          display_name: normalizedName,
          birth_date: birthDate || null,
          ...(gender ? { gender } : {}),
          updated_at: new Date().toISOString(),
        })
        if (isCoach && coachProfile) {
          setCoachProfile({
            ...coachProfile,
            display_name: normalizedName,
            headline: headline.trim(),
            bio: bio.trim(),
            specialties: coachSpecialties,
            experience_years: Number(experienceYears),
            instagram_handle: instagram.trim() || null,
          })
        }
      } else {
        if (!accessToken || !user) throw new Error('Your session is not available. Please sign in again.')
        const updatedUser = await userService.updateMe(accessToken, userPayload)
        updateUser(updatedUser)

        if (isCoach) {
          const coachPayload: CoachProfileRequest = {
            display_name: normalizedName,
            headline: headline.trim(),
            bio: bio.trim(),
            specialties: coachSpecialties,
            experience_years: Number(experienceYears),
            certifications: coachProfile?.certifications ?? [],
            instagram_handle: instagram.trim() || null,
            result_image_urls: coachProfile?.result_image_urls ?? [],
          }
          const updatedCoach = await coachService.updateMyProfile(accessToken, coachPayload)
          setCoachProfile(updatedCoach)
        }
      }
      setSuccess(t("ui.Your profile has been updated."))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('ui.Could not save your profile. Please try again.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppShell title={t("ui.My profile")}>
      <div className="mx-auto w-full max-w-[1040px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-fg-secondary">{t("ui.Account settings")}</p>
            <h1 className="mt-3 text-[34px] font-bold leading-tight tracking-[-1.4px] text-fg sm:text-[40px]">{t("ui.Your profile")}</h1>
            <p className="mt-2 max-w-xl text-[12px] leading-6 text-fg-secondary">{t("ui.Keep your account details up to date. Your verified contact information is managed separately.")}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-default bg-surface px-3.5 py-2 text-[9px] font-bold uppercase tracking-[1px] text-fg-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-hover" />{t('ui.' + (user?.role ?? 'Member'))} {t('ui.account')}
          </span>
        </header>

        <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-5">
            <section className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-8">
              <div className="border-b border-border-default pb-5">
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-secondary">{t("ui.Personal information")}</p>
                <h2 className="mt-2 text-[19px] font-bold tracking-[-0.5px] text-fg">{t("ui.Basic details")}</h2>
                <p className="mt-1 text-[11px] text-fg-muted">{t("ui.These fields are shared across your Vigo account.")}</p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className={labelClass}>{t("ui.Full name")}</span>
                  <input className={fieldClass} value={displayName} onChange={(event) => setDisplayName(event.target.value)} minLength={2} maxLength={60} required />
                </label>
                <label>
                  <span className={labelClass}>{t("ui.Email address")}</span>
                  <input className={fieldClass + ' cursor-not-allowed bg-surface-muted text-fg-muted'} value={user?.email ?? ''} readOnly />
                  <span className="mt-1.5 block text-[10px] text-fg-muted">{t("ui.Email is managed by Authentication.")}</span>
                </label>
                <label>
                  <span className={labelClass}>{t("ui.Phone number")}</span>
                  <input className={fieldClass + ' cursor-not-allowed bg-surface-muted text-fg-muted'} value={user?.phone ?? 'Not provided'} readOnly />
                  <span className="mt-1.5 block text-[10px] text-fg-muted">{t("ui.Verified phone number cannot be changed here.")}</span>
                </label>
                <label>
                  <span className={labelClass}>{t("ui.Date of birth")}</span>
                  <input className={fieldClass} type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>{t("ui.Gender")}</span>
                  <select className={fieldClass} value={gender} onChange={(event) => setGender(event.target.value as Gender | '')}>
                    <option value="">{t("ui.Prefer not to say")}</option>
                    <option value="FEMALE">{t("ui.Female")}</option>
                    <option value="MALE">{t("ui.Male")}</option>
                    <option value="OTHER">{t("ui.Other")}</option>
                  </select>
                </label>
              </div>
            </section>

            {isCoach && (
              <section className="rounded-[20px] border border-border-default bg-surface p-6 sm:p-8">
                <div className="border-b border-border-default pb-5">
                  <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-fg-secondary">{t("ui.Coach profile")}</p>
                  <h2 className="mt-2 text-[19px] font-bold tracking-[-0.5px] text-fg">{t("ui.Your coaching identity")}</h2>
                  <p className="mt-1 text-[11px] text-fg-muted">{t("ui.This information is used on your public coach profile.")}</p>
                </div>
                {isLoadingCoach ? (
                  <ProfileSectionSkeleton />
                ) : (
                  <div className="mt-6 grid gap-5">
                    <label>
                      <span className={labelClass}>{t("ui.Professional headline")}</span>
                      <input className={fieldClass} value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={120} placeholder={t("ui.e.g. Strength and conditioning coach")} />
                    </label>
                    <label>
                      <span className={labelClass}>{t("ui.Biography")}</span>
                      <textarea className={fieldClass + ' min-h-[140px] resize-y'} value={bio} onChange={(event) => setBio(event.target.value)} minLength={20} maxLength={3000} required placeholder={t("ui.Tell athletes about your coaching approach and experience…")} />
                      <span className="mt-1.5 block text-right text-[10px] text-fg-muted">{bio.length}/3000</span>
                    </label>
                    <label>
                      <span className={labelClass}>{t("ui.Specialties")}</span>
                      <input className={fieldClass} value={specialties} onChange={(event) => setSpecialties(event.target.value)} required placeholder={t("ui.Strength, Mobility, Conditioning")} />
                      <span className="mt-1.5 block text-[10px] text-fg-muted">{t("ui.Separate specialties with commas (up to 10).")}</span>
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label>
                        <span className={labelClass}>{t("ui.Years of experience")}</span>
                        <input className={fieldClass} type="number" min={0} max={60} step={1} value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} required />
                      </label>
                      <label>
                        <span className={labelClass}>{t("ui.Instagram username")}</span>
                        <div className="relative">
                          <span className="absolute start-4 top-1/2 -translate-y-1/2 text-[12px] text-fg-muted">@</span>
                          <input className={fieldClass + ' ps-8'} value={instagram} onChange={(event) => setInstagram(event.target.value.replace(/^@/, ''))} maxLength={30} placeholder="your.profile" />
                        </div>
                      </label>
                    </div>
                    {coachProfile?.status && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-muted px-4 py-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[1px] text-fg-secondary">{t("ui.Profile review status")}</span>
                        <span className="rounded-full bg-surface px-3 py-1.5 text-[9px] font-bold uppercase text-success-fg">{t('ui.' + coachProfile.status)}</span>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <section className="rounded-[20px] border border-border-default bg-sidebar p-6 text-fg-inverse">
              <span className="inline-flex rounded-full bg-surface/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[1.2px] text-sidebar-active">{t("ui.Profile visibility")}</span>
              <h2 className="mt-5 text-[20px] font-bold leading-tight tracking-[-0.6px]">{isCoach ? 'Make your profile count.' : 'Your account, up to date.'}</h2>
              <p className="mt-2 text-[11px] leading-5 text-fg-inverse/60">{isCoach ? 'Your headline, bio, and specialties help athletes understand your coaching approach.' : 'Your personal details help keep your Vigo account accurate.'}</p>
            </section>
            <section className="rounded-[20px] border border-border-default bg-surface p-5">
              <p className="text-[9px] font-bold uppercase tracking-[1.2px] text-fg-muted">{t("ui.Account status")}</p>
              <p className="mt-3 text-[15px] font-bold text-fg">{t('ui.' + (user?.status ?? 'Unavailable'))}</p>
              <p className="mt-1 text-[10px] text-fg-muted">{t('ui.Your role:')} {user?.role ? t('ui.' + user.role) : '—'}</p>
            </section>
            {error && <p role="alert" className="rounded-xl border border-danger-border bg-danger-surface px-4 py-3 text-[11px] leading-5 text-danger-fg">{error}</p>}
            {success && <p role="status" className="rounded-xl border border-success-border bg-success-surface px-4 py-3 text-[11px] leading-5 text-success-fg">{success}</p>}
            <Button type="submit" loading={isSaving} disabled={isLoadingCoach} className="h-12 rounded-full bg-brand px-5 text-[11px] font-bold text-on-brand transition hover:bg-brand-hover">
              Save changes <span aria-hidden="true">→</span>
            </Button>
            <p className="text-center text-[9px] leading-4 text-fg-muted">{t("ui.Only fields supported by your current API contracts are editable here.")}</p>
          </aside>
        </form>
      </div>
    </AppShell>
  )
}

export default ProfilePage
