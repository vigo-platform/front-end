import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import OtpLoginIdentifierStep from '../components/OtpLoginIdentifierStep'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../shared/api/client'
import { useAuthConfig } from '../hooks/useAuthConfig'
import type { OtpChannel } from '../types/auth-config.types'
import PasswordLoginForm from '../components/PasswordLoginForm'
import { useAuth } from '../context/auth-context'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'

type LoginStep = 'IDENTIFIER' | 'VERIFY' | 'NEW_PASSWORD'

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const { config, settings, isLoading: isConfigLoading, error: configError } =
    useAuthConfig()

  const availableChannels = config.login.enabledChannels

  const [selectedChannel, setSelectedChannel] =
    useState<OtpChannel | null>(null)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [passwordChangeToken, setPasswordChangeToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<LoginStep>('IDENTIFIER')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loginMode, setLoginMode] = useState<'OTP' | 'PASSWORD'>('OTP')

  const activeChannel = selectedChannel && availableChannels.includes(selectedChannel)
    ? selectedChannel
    : availableChannels[0] ?? 'EMAIL'

  function handleError(error: unknown) {
    if (error instanceof ApiError) {
      setErrorMessage(error.message)
    } else {
      setErrorMessage(t("ui.Unable to connect to the server. Please try again."))
    }
  }

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (!activeChannel) return

    try {
      setIsLoading(true)

      const response =
        activeChannel === 'EMAIL'
          ? await authService.loginWithEmailOtp({
              email: identifier.trim(),
            })
          : await authService.loginWithPhoneOtp({
              phone: identifier.trim(),
            })

      setMfaToken(response.data.challenge?.mfaToken ?? '')
      setStep('VERIFY')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    try {
      setIsLoading(true)

      const response = await authService.verifyOtp({
        mfaToken,
        otp,
      })

      if (response.data.step === 'SUCCESS' && response.data.tokens) {
        await signIn(response.data.tokens)
        navigate('/dashboard')
        return
      }

      if (response.data.step === 'PASSWORD_CHANGE_REQUIRED' && response.data.passwordChange) {
        setPasswordChangeToken(response.data.passwordChange.passwordChangeToken)
        setStep('NEW_PASSWORD')
        return
      }

      setErrorMessage(t("ui.Verification is not complete. Please try again."))
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExpiredPasswordSubmit(event: FormEvent<HTMLFormElement>) {
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

  function goBack() {
    setErrorMessage('')
    setOtp('')
    setStep('IDENTIFIER')
  }

  const inputClassName =
    'h-11 w-full rounded-md border border-border-default bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-fg'

  const labelClassName = 'text-[11px] font-medium text-fg'

  const isEmail = activeChannel === 'EMAIL'

  return (
    <AuthLayout>
      {loginMode === 'PASSWORD' ? (
        <PasswordLoginForm
          isConfigLoading={isConfigLoading}
          isLoginDisabled={settings?.loginEnabled !== true}
          configError={configError ?? ''}
          onUseOtp={() => setLoginMode('OTP')}
        />
      ) : (
      <div className="w-full">
        {step === 'IDENTIFIER' && (
          <OtpLoginIdentifierStep
            channels={availableChannels}
            activeChannel={activeChannel}
            isConfigLoading={isConfigLoading}
            isLoginDisabled={settings?.loginEnabled !== true}
            configError={configError ?? ''}
            errorMessage={errorMessage}
            isLoading={isLoading}
            identifier={identifier}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            onIdentifierChange={setIdentifier}
            onChannelChange={setSelectedChannel}
            onSubmit={handleRequestOtp}
            onUsePassword={() => setLoginMode('PASSWORD')}
          />
        )}

        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">
                {t('ui.Verify your {{channel}}', { channel: t(isEmail ? 'ui.Email' : 'ui.Phone') })}
              </h1>

              <p className="text-[13px] leading-relaxed text-fg-secondary">
                {t('ui.Enter the verification code sent to your {{channel}}.', { channel: t(isEmail ? 'ui.Email address' : 'ui.Phone number') })}
              </p>
            </div>

            <form
              onSubmit={handleVerifyOtp}
              className="flex flex-col gap-5"
            >
              <Input id="otp" label={t("ui.Verification code")} labelClassName={labelClassName} type="text" inputMode="numeric" autoComplete="one-time-code" placeholder={t("ui.Enter code")} value={otp} onChange={(event) => setOtp(event.target.value)} minLength={5} maxLength={6} required className={inputClassName} />

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-md bg-danger-surface px-3 py-2 text-[12px] leading-relaxed text-danger-fg"
                >
                  {errorMessage}
                </p>
              )}

              <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">{t('ui.Verify')}</Button>

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
      {step === 'NEW_PASSWORD' && (
        <>
          <div className="mb-6">
            <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">
              {t("ui.Update your password")}
            </h1>
            <p className="text-[13px] leading-relaxed text-fg-secondary">
              {t("ui.Your current password has expired. Choose a new password to continue.")}
            </p>
          </div>
          <form onSubmit={handleExpiredPasswordSubmit} className="flex flex-col gap-4">
            <Input id="login-new-password" label={t("ui.New password")} labelClassName={labelClassName} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} maxLength={72} required className={inputClassName} />
            {errorMessage && (
              <p role="alert" className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg">
                {errorMessage}
              </p>
            )}
            <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">{t('ui.Update password')}</Button>
          </form>
        </>
      )}
      </div>
      )}
    </AuthLayout>
  )
}

export default LoginPage