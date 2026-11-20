import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CoachPublicLayout from '../components/CoachPublicLayout'
import { coachApplicationService } from '../services/coach-application.service'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { Button, Input } from '../../../shared/components/ui'
import { useAuth } from '../../auth/context/auth-context'

function toE164Phone(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  let digits = trimmed.replace(/\D/g, '')

  if (digits.startsWith('0098')) {
    digits = digits.slice(4)
  } else if (digits.startsWith('98')) {
    digits = digits.slice(2)
  }

  digits = digits.replace(/^0+/, '')

  return digits ? `+98${digits}` : null
}

function CoachApplicationPage() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const isPersian = i18n.resolvedLanguage?.startsWith('fa') ?? false
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [specialties, setSpecialties] = useState('')
  const [experienceYears, setExperienceYears] = useState('0')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsedSpecialties = specialties.split(',').map((item) => item.trim()).filter(Boolean)
    const years = Number(experienceYears)
    const normalizedInstagram = instagramHandle.trim().replace(/^@/, '')

    if (parsedSpecialties.length < 1 || parsedSpecialties.length > 10) {
      setError(t('ui.Enter between 1 and 10 specialties, separated by commas.'))
      return
    }

    if (!Number.isInteger(years) || years < 0 || years > 60) {
      setError(t('ui.Experience must be a whole number between 0 and 60.'))
      return
    }

    if (normalizedInstagram && !/^[A-Za-z0-9._]{1,30}$/.test(normalizedInstagram)) {
      setError(t('ui.Enter an Instagram username without the @ symbol.'))
      return
    }

    setIsSubmitting(true)
    try {
      await coachApplicationService.submit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: toE164Phone(phone),
        headline: headline.trim() || null,
        bio: bio.trim(),
        specialties: parsedSpecialties,
        experienceYears: years,
        instagramHandle: normalizedInstagram || null,
        locale: i18n.resolvedLanguage?.startsWith('fa') ? 'fa' : 'en',
      })
      setSubmitted(true)
    } catch (requestError) {
      setError(getUserErrorMessage(requestError, t, 'errors.action'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = 'min-h-11 w-full rounded-xl border border-border-default bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition placeholder:text-fg-muted focus:border-brand focus-visible:ring-2 focus-visible:ring-focus-ring'
  const labelClassName = 'text-xs font-semibold text-fg'

  return (
    <CoachPublicLayout title={t('ui.Apply to become a coach')}>
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <section className="rounded-3xl border border-border-default bg-surface-muted p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[1.6px] text-success-fg">{t('ui.Coach application')}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-fg">{t('ui.Apply to become a coach')}</h1>
          <p className="mt-4 text-sm leading-7 text-fg-secondary">{t('ui.Share your coaching background and submit an application for review. You do not need a Vigo account.')}</p>
          <div className="mt-7 space-y-3 text-sm text-fg-secondary">
            <p className="flex gap-3"><span className="text-success-fg">✓</span>{t('ui.Submit your details without signing in.')}</p>
            <p className="flex gap-3"><span className="text-success-fg">✓</span>{t('ui.Provide your experience and coaching specialties.')}</p>
            <p className="flex gap-3"><span className="text-success-fg">✓</span>{t('ui.Your application will be reviewed by the Vigo team.')}</p>
          </div>
          <Link to="/coaches" className="mt-8 inline-flex text-sm font-semibold text-success-fg hover:underline">{t('ui.Browse coaches')} →</Link>
        </section>

        <section className="rounded-3xl border border-border-default bg-surface p-5 shadow-sm sm:p-8">
          {submitted ? (
            <div role="status" className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-surface text-2xl text-success-fg">✓</div>
              <h2 className="mt-5 text-xl font-bold text-fg">{t('ui.Application submitted')}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-fg-secondary">{t('ui.Your coach application has been received. The Vigo team will review it.')}</p>
              <Link to="/" className="mt-7 inline-flex rounded-full bg-fg px-5 py-3 text-sm font-semibold text-fg-inverse">{t('ui.Back to home')}</Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h2 className="text-xl font-bold text-fg">{t('ui.Application details')}</h2>
                <p className="mt-2 text-sm leading-6 text-fg-muted">{t('ui.Fields marked with * are required.')}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input id="firstName" label={t('ui.First name') + ' *'} labelClassName={labelClassName} autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required maxLength={60} className={inputClassName} />
                  <Input id="lastName" label={t('ui.Last name') + ' *'} labelClassName={labelClassName} autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required maxLength={60} className={inputClassName} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input id="email" type="email" label={t('ui.Email address') + ' *'} labelClassName={labelClassName} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} className={inputClassName} />
                  <Input
                    id="phone"
                    type="tel"
                    label={t('ui.Phone number')}
                    labelClassName={labelClassName}
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={30}
                    placeholder={isPersian ? 'مثلاً 09121234567' : 'e.g. 09121234567'}
                    className={inputClassName}
                  />
                </div>
                <Input id="headline" label={t('ui.Professional headline')} labelClassName={labelClassName} value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={120} placeholder={t('ui.e.g. Strength and conditioning coach')} className={inputClassName} />
                <div className="flex flex-col gap-2">
                  <label htmlFor="bio" className={labelClassName}>{t('ui.Biography')} *</label>
                  <textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} required minLength={20} maxLength={3000} rows={5} placeholder={t('ui.Tell athletes about your coaching approach and experience…')} className={inputClassName + ' resize-y'} />
                  <p className="text-xs text-fg-muted">{t('ui.Your bio must contain between 20 and 3000 characters.')}</p>
                </div>
                <Input id="specialties" label={t('ui.Specialties') + ' *'} labelClassName={labelClassName} value={specialties} onChange={(event) => setSpecialties(event.target.value)} required placeholder={t('ui.Strength, Mobility, Conditioning')} hint={t('ui.Separate specialties with commas (up to 10).')} className={inputClassName} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input id="experienceYears" type="number" label={t('ui.Years of experience') + ' *'} labelClassName={labelClassName} value={experienceYears} onChange={(event) => setExperienceYears(event.target.value)} min={0} max={60} step={1} required className={inputClassName} />
                  <Input id="instagramHandle" label={t('ui.Instagram username')} labelClassName={labelClassName} value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} maxLength={31} placeholder="@username" className={inputClassName} />
                </div>

                {isAuthenticated && <p className="text-xs text-fg-muted">{t('ui.This is a public application form and is separate from your signed-in profile.')}</p>}
                {error && <p role="alert" className="rounded-xl border border-danger-border bg-danger-surface px-4 py-3 text-sm text-danger-fg">{error}</p>}

                <Button type="submit" size="lg" loading={isSubmitting} className="w-full rounded-full">{t('ui.Submit application')}</Button>
                <p className="text-center text-xs leading-6 text-fg-muted">{t('ui.By submitting, you confirm that the information is accurate.')}</p>
              </form>
            </>
          )}
        </section>
      </div>
    </CoachPublicLayout>
  )
}

export default CoachApplicationPage
