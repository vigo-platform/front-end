import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import OtpChannelSelector from '../components/OtpChannelSelector'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../lib/api/client'
import { useAuthConfig } from '../hooks/useAuthConfig'
import type { OtpChannel } from '../types/auth-config.types'
import { useAuth } from '../context/AuthContext'
import PasswordLoginForm from '../components/PasswordLoginForm'

type LoginStep = 'IDENTIFIER' | 'VERIFY' | 'NEW_PASSWORD'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const { config, isLoading: isConfigLoading, error: configError } =
    useAuthConfig()

  const availableChannels = config.login.enabledChannels

  const [selectedChannel, setSelectedChannel] =
    useState<OtpChannel>('EMAIL')
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [passwordChangeToken, setPasswordChangeToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<LoginStep>('IDENTIFIER')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loginMode, setLoginMode] = useState<'OTP' | 'PASSWORD'>('OTP')

  const activeChannel = availableChannels.includes(selectedChannel)
    ? selectedChannel
    : availableChannels[0]

  useEffect(() => {
    if (
      availableChannels.length > 0 &&
      !availableChannels.includes(selectedChannel)
    ) {
      setSelectedChannel(availableChannels[0])
    }
  }, [availableChannels, selectedChannel])

  function handleError(error: unknown) {
    if (error instanceof ApiError) {
      setErrorMessage(error.message)
    } else {
      setErrorMessage('Unable to connect to the server. Please try again.')
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

      setErrorMessage('Verification is not complete. Please try again.')
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
      setErrorMessage('Password cannot contain only whitespace.')
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
        state: { message: 'Your password was updated. Please sign in.' },
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
    'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'

  const labelClassName = 'text-[11px] font-medium text-ink'

  const isEmail = activeChannel === 'EMAIL'

  return (
    <AuthLayout>
      {loginMode === 'PASSWORD' ? (
        <PasswordLoginForm onUseOtp={() => setLoginMode('OTP')} />
      ) : (
      <div className="w-full">
        {step === 'IDENTIFIER' && (
          <>
            <div className="mb-7">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Welcome back
              </h1>

              <p className="text-[13px] leading-[1.6] text-[#55554f]">
                Log in to your Vigo workspace and pick up where you left off.
              </p>
            </div>

            {isConfigLoading ? (
              <p className="text-[12px] text-[#77776f]">
                Loading login options...
              </p>
            ) : availableChannels.length === 0 ? (
              <p
                role="status"
                className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] leading-relaxed text-[#55554f]"
              >
                Login is currently unavailable. Please try again later.
              </p>
            ) : (
              <form
                onSubmit={handleRequestOtp}
                className="flex flex-col gap-5"
              >
                <OtpChannelSelector
                  channels={availableChannels}
                  value={activeChannel}
                  onChange={setSelectedChannel}
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="identifier" className={labelClassName}>
                    {isEmail ? 'Email address' : 'Phone number'}
                  </label>

                  <input
                    id="identifier"
                    type={isEmail ? 'email' : 'tel'}
                    inputMode={isEmail ? 'email' : 'tel'}
                    autoComplete={isEmail ? 'email' : 'tel'}
                    placeholder={
                      isEmail ? 'you@example.com' : 'Enter your phone number'
                    }
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    required
                    className={inputClassName}
                  />
                </div>

                <p className="-mt-2 text-[12px] leading-relaxed text-[#62625c]">
                  We'll send a verification code to your{' '}
                  {isEmail ? 'email address' : 'phone number'}.
                </p>

                {configError && (
                  <p role="alert" className="text-[12px] text-red-600">
                    {configError}
                  </p>
                )}

                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-md bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700"
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Please wait...' : 'Continue'}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <button type="button" onClick={() => setLoginMode('PASSWORD')} className="text-[11px] font-medium text-ink hover:underline">
                Log in with password instead
              </button>
            </div>
            <div className="mt-2 text-center"><Link to="/forgot-password" className="text-[11px] font-medium text-ink hover:underline">Forgot password?</Link></div>

            <p className="mt-7 text-center text-[11px] text-[#33332f]">
              New to Vigo?{' '}
              <Link
                to="/register"
                className="ml-1 font-medium text-ink no-underline hover:underline"
              >
                Create an account
              </Link>
            </p>
          </>
        )}

        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Verify your {isEmail ? 'email' : 'phone'}
              </h1>

              <p className="text-[13px] leading-relaxed text-[#55554f]">
                Enter the verification code sent to your{' '}
                {isEmail ? 'email address' : 'phone number'}.
              </p>
            </div>

            <form
              onSubmit={handleVerifyOtp}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className={labelClassName}>
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  minLength={5}
                  maxLength={6}
                  required
                  className={inputClassName}
                />
              </div>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-md bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                onClick={goBack}
                className="h-8 text-[11px] text-ink hover:underline"
              >
                Back
              </button>
            </form>
          </>
        )}
      {step === 'NEW_PASSWORD' && (
        <>
          <div className="mb-6">
            <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
              Update your password
            </h1>
            <p className="text-[13px] leading-relaxed text-[#55554f]">
              Your current password has expired. Choose a new password to continue.
            </p>
          </div>
          <form onSubmit={handleExpiredPasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-new-password" className={labelClassName}>New password</label>
              <input
                id="login-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                maxLength={72}
                required
                className={inputClassName}
              />
            </div>
            {errorMessage && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
                {errorMessage}
              </p>
            )}
            <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60">
              {isLoading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </>
      )}
      </div>
      )}
    </AuthLayout>
  )
}

export default LoginPage