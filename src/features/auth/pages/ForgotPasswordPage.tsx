import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import PasswordResetIdentifierStep from '../components/PasswordResetIdentifierStep'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../shared/api/client'
import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'

type ResetStep = 'IDENTIFIER' | 'VERIFY' | 'NEW_PASSWORD' | 'SUCCESS'
const channels: OtpChannel[] = ['EMAIL', 'PHONE']
const inputClassName = 'h-11 w-full rounded-md border border-border bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-fg'
const labelClassName = 'text-[11px] font-medium text-fg'

function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<ResetStep>('IDENTIFIER')
  const [channel, setChannel] = useState<OtpChannel>('EMAIL')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [passwordResetToken, setPasswordResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const isEmail = channel === 'EMAIL'

  function handleError(error: unknown) {
    setErrorMessage(error instanceof ApiError ? error.message : t('ui.Unable to connect to the server. Please try again.'))
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.initiatePasswordReset({ identifier: identifier.trim() })
      setMfaToken(response.data.challenge.mfaToken)
      setStep('VERIFY')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.verifyPasswordReset({ mfaToken, otp })
      if (response.data.step === 'OTP_REQUIRED') {
        setMfaToken(response.data.challenge.mfaToken)
        setChannel(response.data.challenge.channel === 'SMS' ? 'PHONE' : 'EMAIL')
        setOtp('')
        setErrorMessage(t('ui.A second verification code is required. Check your other verification channel.'))
        return
      }
      setPasswordResetToken(response.data.passwordReset.passwordResetToken)
      setStep('NEW_PASSWORD')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    if (password !== confirmPassword) {
      setErrorMessage(t('ui.Passwords do not match.'))
      return
    }
    try {
      setIsLoading(true)
      await authService.completePasswordReset({ passwordResetToken, newPassword: password })
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
      setOtp('')
      setStep('IDENTIFIER')
    } else if (step === 'NEW_PASSWORD') {
      setStep('VERIFY')
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {step === 'IDENTIFIER' && (
          <PasswordResetIdentifierStep
            channels={channels}
            channel={channel}
            onChannelChange={setChannel}
            identifier={identifier}
            onIdentifierChange={setIdentifier}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onSubmit={requestCode}
          />
        )}
        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">{t('ui.Verify your {{channel}}', { channel: t(isEmail ? 'ui.Email' : 'ui.Phone') })}</h1>
              <p className="text-[13px] leading-relaxed text-fg-secondary">{t('ui.Enter the verification code sent to {{identifier}}.', { identifier })}</p>
            </div>
            <form onSubmit={verifyCode} className="flex flex-col gap-5">
              <Input id="reset-otp" label={t("ui.Verification code")} labelClassName={labelClassName} type="text" inputMode="numeric" autoComplete="one-time-code" placeholder={t("ui.Enter code")} value={otp} onChange={(event) => setOtp(event.target.value)} minLength={6} maxLength={6} pattern="[0-9]{6}" required className={inputClassName} />
              {errorMessage && <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">{errorMessage}</p>}
              <Button type="submit" loading={isLoading} className="h-11 w-full text-[13px]">{t('ui.Verify code')}</Button>
              <button type="button" onClick={goBack} className="h-8 text-[11px] text-fg hover:underline">{t("ui.Back")}</button>
            </form>
          </>
        )}
        {step === 'NEW_PASSWORD' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">{t("ui.Create a new password")}</h1>
              <p className="text-[13px] leading-relaxed text-fg-secondary">{t("ui.Choose a new password for your Vigo account.")}</p>
            </div>
            <form onSubmit={resetPassword} className="flex flex-col gap-4">
              <div className="relative">
                <Input id="new-password" label={t("ui.New password")} labelClassName={labelClassName} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder={t("ui.Create a password")} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={72} required className={`${inputClassName} pe-14`} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t('ui.Hide password') : t('ui.Show password')} className="absolute bottom-0 end-0 flex h-11 w-12 items-center justify-center text-[11px] text-fg-secondary hover:text-fg">{showPassword ? t('ui.Hide') : t('ui.Show')}</button>
              </div>
              <Input id="confirm-password" label={t("ui.Confirm password")} labelClassName={labelClassName} type="password" autoComplete="new-password" placeholder={t("ui.Enter your password again")} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} maxLength={72} required className={inputClassName} />
              {errorMessage && <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">{errorMessage}</p>}
              <Button type="submit" loading={isLoading} className="mt-1 h-11 w-full text-[13px]">{t('ui.Reset password')}</Button>
              <button type="button" onClick={goBack} className="h-8 text-[11px] text-fg hover:underline">{t("ui.Back")}</button>
            </form>
          </>
        )}
        {step === 'SUCCESS' && (
          <div>
            <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-fg">{t("ui.Password updated")}</h1>
            <p className="mb-5 text-[12px] leading-relaxed text-fg-secondary">{t("ui.Your password has been changed. Log in with your new password to continue.")}</p>
            <Button type="button" onClick={() => navigate('/login')} className="h-11 w-full text-[13px]">{t("ui.Log in")}</Button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
export default ForgotPasswordPage
