import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserErrorMessage } from '../../../shared/api/user-error'
import { useAuth } from '../context/auth-context'
import { authService } from '../services/auth.service'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'
import { AuthOptionsSkeleton } from '../../../shared/components/feedback/LoadingStates'

type Step = 'CREDENTIALS' | 'VERIFY' | 'NEW_PASSWORD'

interface PasswordLoginFormProps {
  isConfigLoading: boolean
  isLoginDisabled: boolean
  configError: string
  onUseOtp: () => void
}

const inputClassName =
  'h-11 w-full rounded-md border border-border-default bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-ink'
const labelClassName = 'text-[11px] font-medium text-fg'

function PasswordLoginForm({
  isConfigLoading,
  isLoginDisabled,
  configError,
  onUseOtp,
}: PasswordLoginFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [passwordChangeToken, setPasswordChangeToken] = useState('')
  const [step, setStep] = useState<Step>('CREDENTIALS')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleError(error: unknown) {
    setErrorMessage(getUserErrorMessage(error, t, 'errors.login'))
  }

  async function handleCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.loginWithPassword({
        identifier: identifier.trim(),
        password,
      })

      if (response.data.step === 'SUCCESS' && response.data.tokens) {
        await signIn(response.data.tokens)
        navigate('/dashboard')
        return
      }

      if (response.data.step === 'OTP_REQUIRED' && response.data.challenge) {
        setMfaToken(response.data.challenge.mfaToken)
        setStep('VERIFY')
        return
      }

      if (
        response.data.step === 'PASSWORD_CHANGE_REQUIRED' &&
        response.data.passwordChange
      ) {
        setPasswordChangeToken(response.data.passwordChange.passwordChangeToken)
        setStep('NEW_PASSWORD')
        return
      }

      setErrorMessage(t("ui.The server returned an unsupported login response."))
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.verifyOtp({ mfaToken, otp })

      if (response.data.step === 'SUCCESS' && response.data.tokens) {
        await signIn(response.data.tokens)
        navigate('/dashboard')
        return
      }

      if (
        response.data.step === 'PASSWORD_CHANGE_REQUIRED' &&
        response.data.passwordChange
      ) {
        setPasswordChangeToken(response.data.passwordChange.passwordChangeToken)
        setStep('NEW_PASSWORD')
        return
      }

      setErrorMessage(t("ui.The server returned an unsupported verification response."))
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    if (newPassword.trim().length === 0) {
      setErrorMessage(t("ui.Password cannot contain only whitespace."))
      return
    }

    try {
      setIsLoading(true)
      const response = await authService.completeExpiredPassword({
        passwordChangeToken,
        newPassword,
      })

      if (response.data.step === 'SUCCESS' && response.data.tokens) {
        await signIn(response.data.tokens)
        navigate('/dashboard')
        return
      }

      navigate('/login', {
        replace: true,
        state: { message: t('ui.Your password was updated. Please sign in.') },
      })
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-7">
        <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">
          {step === 'CREDENTIALS'
            ? t('ui.Log in with your password')
            : step === 'VERIFY'
              ? t('ui.Verify your identity')
              : t('ui.Update your password')}
        </h1>
        <p className="text-[13px] leading-[1.6] text-fg-secondary">
          {step === 'CREDENTIALS'
            ? t('ui.Enter your email or phone number and password.')
            : step === 'VERIFY'
              ? t('ui.Enter the six-digit verification code.')
              : t('ui.Your password has expired. Choose a new password to continue.')}
        </p>
      </div>

      {step === 'CREDENTIALS' && (
        isConfigLoading ? (
          <AuthOptionsSkeleton />
        ) : isLoginDisabled ? (
          <p role="status" className="rounded-md bg-surface-muted px-3 py-3 text-[12px] text-fg-secondary">
            {configError || t('ui.Login is currently disabled. Please try again later.')}
          </p>
        ) : (
        <form onSubmit={handleCredentials} className="flex flex-col gap-4">
          <Input id="password-login-identifier" label={t("ui.Email or phone number")} labelClassName={labelClassName} type="text" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required className={inputClassName} />
          <Input id="password-login-password" label={t("ui.Password")} labelClassName={labelClassName} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required maxLength={72} className={inputClassName} />
          {errorMessage && (
            <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">
              {errorMessage}
            </p>
          )}
          <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">{t('ui.Log in')}</Button>
        </form>
        )
      )}

      {step === 'VERIFY' && (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <Input id="password-login-otp" label={t("ui.Verification code")} labelClassName={labelClassName} type="text" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} minLength={6} maxLength={6} pattern="[0-9]{6}" required className={inputClassName} />
          {errorMessage && (
            <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">
              {errorMessage}
            </p>
          )}
          <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">{t('ui.Verify')}</Button>
          <button type="button" onClick={() => setStep('CREDENTIALS')} className="h-8 text-[11px] text-fg hover:underline">
            {t("ui.Back")}
          </button>
        </form>
      )}

      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
          <Input id="expired-new-password" label={t("ui.New password")} labelClassName={labelClassName} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} maxLength={72} required className={inputClassName} />
          {errorMessage && (
            <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">
              {errorMessage}
            </p>
          )}
          <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">{t('ui.Update password')}</Button>
        </form>
      )}

      <div className="mt-5 flex flex-col items-center gap-3 text-center text-[11px]">
        <button type="button" onClick={onUseOtp} className="font-medium text-fg hover:underline">
          {t("ui.Use a verification code instead")}
        </button>
        <Link to="/forgot-password" className="font-medium text-fg hover:underline">
          {t("ui.Forgot password?")}
        </Link>
      </div>
    </div>
  )
}

export default PasswordLoginForm
