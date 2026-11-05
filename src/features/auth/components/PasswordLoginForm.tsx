import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../../lib/api/client'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth.service'

type Step = 'CREDENTIALS' | 'VERIFY' | 'NEW_PASSWORD'

interface PasswordLoginFormProps {
  onUseOtp: () => void
}

const inputClassName =
  'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'
const labelClassName = 'text-[11px] font-medium text-ink'

function PasswordLoginForm({ onUseOtp }: PasswordLoginFormProps) {
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
    setErrorMessage(
      error instanceof ApiError
        ? error.message
        : 'Unable to connect to the server. Please try again.',
    )
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

      setErrorMessage('The server returned an unsupported login response.')
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

      setErrorMessage('The server returned an unsupported verification response.')
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

  return (
    <div className="w-full">
      <div className="mb-7">
        <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
          {step === 'CREDENTIALS'
            ? 'Log in with your password'
            : step === 'VERIFY'
              ? 'Verify your identity'
              : 'Update your password'}
        </h1>
        <p className="text-[13px] leading-[1.6] text-[#55554f]">
          {step === 'CREDENTIALS'
            ? 'Enter your email or phone number and password.'
            : step === 'VERIFY'
              ? 'Enter the six-digit verification code.'
              : 'Your password has expired. Choose a new password to continue.'}
        </p>
      </div>

      {step === 'CREDENTIALS' && (
        <form onSubmit={handleCredentials} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password-login-identifier" className={labelClassName}>
              Email or phone number
            </label>
            <input
              id="password-login-identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              className={inputClassName}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password-login-password" className={labelClassName}>
              Password
            </label>
            <input
              id="password-login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              maxLength={72}
              className={inputClassName}
            />
          </div>
          {errorMessage && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
      )}

      {step === 'VERIFY' && (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password-login-otp" className={labelClassName}>
              Verification code
            </label>
            <input
              id="password-login-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              minLength={6}
              maxLength={6}
              pattern="[0-9]{6}"
              required
              className={inputClassName}
            />
          </div>
          {errorMessage && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button type="button" onClick={() => setStep('CREDENTIALS')} className="h-8 text-[11px] text-ink hover:underline">
            Back
          </button>
        </form>
      )}

      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="expired-new-password" className={labelClassName}>
              New password
            </label>
            <input
              id="expired-new-password"
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
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60"
          >
            {isLoading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}

      <div className="mt-5 flex flex-col items-center gap-3 text-center text-[11px]">
        <button type="button" onClick={onUseOtp} className="font-medium text-ink hover:underline">
          Use a verification code instead
        </button>
        <Link to="/forgot-password" className="font-medium text-ink hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  )
}

export default PasswordLoginForm
