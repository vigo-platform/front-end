import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import RegisterIdentifierStep from '../components/RegisterIdentifierStep'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../shared/api/client'
import { useAuthConfig } from '../hooks/useAuthConfig'
import type { OtpChannel } from '../types/auth-config.types'
import { useAuth } from '../context/auth-context'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'
import { Spinner } from '../../../shared/components/feedback'

type RegisterStep = 'IDENTIFIER' | 'VERIFY' | 'COMPLETE' | 'SUCCESS'

function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const { config, settings, isLoading: isConfigLoading, error: configError } =
    useAuthConfig()

  const availableChannels = config.signup.enabledChannels

  const [selectedChannel, setSelectedChannel] =
    useState<OtpChannel | null>(null)
  const [identifier, setIdentifier] = useState('')
  const [step, setStep] = useState<RegisterStep>('IDENTIFIER')

  const [otp, setOtp] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')

  const [mfaToken, setMfaToken] = useState('')
  const [tempToken, setTempToken] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const activeChannel = selectedChannel && availableChannels.includes(selectedChannel)
    ? selectedChannel
    : availableChannels[0] ?? 'EMAIL'

  const isEmail = activeChannel === 'EMAIL'

  function handleError(error: unknown) {
    if (error instanceof ApiError) {
      setErrorMessage(error.message)
    } else {
      setErrorMessage(t("ui.Unable to connect to the server. Please try again."))
    }
  }

  async function handleIdentifierSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setErrorMessage('')

    if (!activeChannel) return

    try {
      setIsLoading(true)

      const response = await authService.initiateSignup({
        identifier: identifier.trim(),
      })

      setMfaToken(response.data.mfaToken)
      setStep('VERIFY')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    try {
      setIsLoading(true)

      const response = await authService.verifySignup({
        mfaToken,
        otp,
      })

      setTempToken(response.data.registrationToken)
      setStep('COMPLETE')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    setErrorMessage('')

    try {
      setIsResending(true)

      const response = await authService.initiateSignup({
        identifier: identifier.trim(),
      })

      setMfaToken(response.data.mfaToken)
      setOtp('')
    } catch (error) {
      handleError(error)
    } finally {
      setIsResending(false)
    }
  }

  async function handleCompleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    try {
      setIsLoading(true)

      const response = await authService.completeSignup({
        registrationToken: tempToken,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
      })

      if (response.data.tokens) {
        await signIn(response.data.tokens)
        navigate('/dashboard')
        return
      }

      setStep('SUCCESS')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  function goBack() {
    setErrorMessage('')

    if (step === 'VERIFY') {
      setStep('IDENTIFIER')
      setOtp('')
    } else if (step === 'COMPLETE') {
      setStep('VERIFY')
    }
  }

  const inputClassName =
    'h-11 w-full rounded-md border border-border-default bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-fg'

  const labelClassName = 'text-[11px] font-medium text-fg'

  return (
    <AuthLayout>
      <div className="w-full">
        {step === 'IDENTIFIER' && (
          <RegisterIdentifierStep
            availableChannels={availableChannels}
            activeChannel={activeChannel}
            isConfigLoading={isConfigLoading}
            isRegistrationDisabled={settings?.registerEnabled !== true}
            configError={configError ?? ''}
            errorMessage={errorMessage}
            isLoading={isLoading}
            identifier={identifier}
            onIdentifierChange={setIdentifier}
            onChannelChange={setSelectedChannel}
            onSubmit={handleIdentifierSubmit}
          />
        )}

        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-fg">
                {t("ui.Verify your contact")}
              </h1>

              <p className="text-[12px] leading-relaxed text-fg-secondary">
                {t('ui.Enter the verification code sent to your {{channel}}.', { channel: t(isEmail ? 'ui.Email address' : 'ui.Phone number') })}
              </p>
            </div>

            <form
              onSubmit={handleVerifySubmit}
              className="flex flex-col gap-4"
            >
              <Input id="otp" label={t("ui.Verification code")} labelClassName={labelClassName} type="text" inputMode="numeric" autoComplete="one-time-code" placeholder={t("ui.Enter code")} value={otp} onChange={(event) => setOtp(event.target.value)} minLength={5} maxLength={6} required className={inputClassName} />

              <p className="text-[11px] text-fg-secondary">
                {t('ui.Didn\'t receive the code?')}{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading || isResending}
                  className="inline-flex items-center gap-2 font-medium text-fg hover:underline disabled:opacity-50"
                >
                  {isResending && <Spinner size="sm" />}{t("ui.Resend code")}
                </button>
              </p>

              {errorMessage && (
                <p role="alert" className="text-[12px] text-danger-fg">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" loading={isLoading} className="h-11 w-full text-[13px]">{t('ui.Verify')}</Button>

              <button
                type="button"
                onClick={goBack}
                className="h-8 text-[11px] text-fg hover:underline"
              >
                {t("ui.Back")}
              </button>
            </form>
          </>
        )}

        {step === 'COMPLETE' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-fg">
                {t("ui.Complete your registration")}
              </h1>

              <p className="text-[12px] leading-relaxed text-fg-secondary">
                {t("ui.Finish setting up your account with your name and password.")}
              </p>
            </div>

            <form
              onSubmit={handleCompleteSubmit}
              className="flex flex-col gap-4"
            >
              <Input id="firstName" label={t("ui.First name")} labelClassName={labelClassName} type="text" autoComplete="given-name" placeholder={t("ui.First name")} value={firstName} onChange={(event) => setFirstName(event.target.value)} required className={inputClassName} />

              <Input id="lastName" label={t("ui.Last name")} labelClassName={labelClassName} type="text" autoComplete="family-name" placeholder={t("ui.Last name")} value={lastName} onChange={(event) => setLastName(event.target.value)} required className={inputClassName} />

              <div className="relative">
                <Input id="password" label={t("ui.Password")} labelClassName={labelClassName} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder={t("ui.Create a password")} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={72} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}" required className={`${inputClassName} pe-11`} />
                <button type="button" onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? t('ui.Hide password') : t('ui.Show password')} className="absolute bottom-0 end-0 flex h-11 w-11 items-center justify-center text-fg-secondary hover:text-fg">{showPassword ? t('ui.Hide') : t('ui.Show')}</button>
              </div>

              {errorMessage && (
                <p role="alert" className="text-[12px] text-danger-fg">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" loading={isLoading} className="mt-1 h-10 w-full text-[13px]">{t('ui.Create account')}</Button>

              <button
                type="button"
                onClick={goBack}
                className="h-7 text-[11px] text-fg hover:underline"
              >
                {t("ui.Back")}
              </button>
            </form>
          </>
        )}

        {step === 'SUCCESS' && (
          <div>
            <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-fg">
              {t("ui.Account created")}
            </h1>

            <p className="mb-5 text-[12px] leading-relaxed text-fg-secondary">
              {t("ui.Your account is ready. You can now log in to continue.")}
            </p>

            <Button type="button" onClick={() => navigate('/login')} className="h-10 w-full text-[13px]">{t("ui.Log in")}</Button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default RegisterPage