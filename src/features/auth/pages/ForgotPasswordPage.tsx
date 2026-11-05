import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../lib/api/client'

type ResetStep = 'EMAIL' | 'VERIFY' | 'NEW_PASSWORD' | 'SUCCESS'

const inputClassName =
  'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'
const labelClassName = 'text-[11px] font-medium text-ink'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ResetStep>('EMAIL')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [mfaToken, setMfaToken] = useState('')
  const [passwordResetToken, setPasswordResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function handleError(error: unknown) {
    setErrorMessage(
      error instanceof ApiError
        ? error.message
        : 'Unable to connect to the server. Please try again.',
    )
  }

  async function handleRequestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.initiatePasswordReset({
        email: email.trim(),
      })
      setMfaToken(response.data.mfaToken)
      setStep('VERIFY')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    try {
      setIsLoading(true)
      const response = await authService.verifyPasswordReset({
        mfaToken,
        otp,
      })
      if (response.data.step !== 'PASSWORD_RESET_REQUIRED') {
        setErrorMessage('Password reset could not be verified. Please try again.')
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

  async function handleSetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }
    try {
      setIsLoading(true)
      await authService.completePasswordReset({
        passwordResetToken,
        newPassword: password,
      })
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
      setStep('EMAIL')
    } else if (step === 'NEW_PASSWORD') {
      setOtp('')
      setStep('VERIFY')
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        {step === 'EMAIL' && (
          <>
            <div className="mb-7">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Forgot your password?
              </h1>
              <p className="text-[13px] leading-[1.6] text-[#55554f]">
                Enter the email address associated with your account. We'll send you a verification code.
              </p>
            </div>
            <form onSubmit={handleRequestCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="reset-email" className={labelClassName}>Email address</label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={inputClassName}
                />
              </div>
              {errorMessage && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{errorMessage}</p>}
              <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60">
                {isLoading ? 'Sending code...' : 'Send verification code'}
              </button>
            </form>
            <p className="mt-7 text-center text-[11px] text-[#33332f]">
              Remember your password? <Link to="/login" className="ml-1 font-medium text-ink hover:underline">Log in</Link>
            </p>
          </>
        )}

        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">Verify your email</h1>
              <p className="text-[13px] leading-relaxed text-[#55554f]">Enter the verification code sent to <strong className="font-medium text-ink">{email}</strong>.</p>
            </div>
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="reset-otp" className={labelClassName}>Verification code</label>
                <input id="reset-otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Enter code" value={otp} onChange={(event) => setOtp(event.target.value)} minLength={5} maxLength={6} required className={inputClassName} />
              </div>
              {errorMessage && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{errorMessage}</p>}
              <button type="submit" disabled={isLoading} className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60">{isLoading ? 'Verifying...' : 'Verify email'}</button>
              <button type="button" onClick={goBack} className="h-8 text-[11px] text-ink hover:underline">Back</button>
            </form>
          </>
        )}

        {step === 'NEW_PASSWORD' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">Create a new password</h1>
              <p className="text-[13px] leading-relaxed text-[#55554f]">Choose a new password for your Vigo account.</p>
            </div>
            <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="new-password" className={labelClassName}>New password</label>
                <div className="relative">
                  <input id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={72} required className={`${inputClassName} pr-14`} />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[11px] text-[#55554f] hover:text-ink">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="confirm-password" className={labelClassName}>Confirm password</label>
                <input id="confirm-password" type="password" autoComplete="new-password" placeholder="Enter your password again" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} maxLength={72} required className={inputClassName} />
              </div>
              {errorMessage && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700">{errorMessage}</p>}
              <button type="submit" disabled={isLoading} className="mt-1 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60">{isLoading ? 'Updating password...' : 'Reset password'}</button>
              <button type="button" onClick={goBack} className="h-8 text-[11px] text-ink hover:underline">Back</button>
            </form>
          </>
        )}

        {step === 'SUCCESS' && (
          <div>
            <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">Password updated</h1>
            <p className="mb-5 text-[12px] leading-relaxed text-[#55554f]">Your password has been changed. Log in with your new password to continue.</p>
            <button type="button" onClick={() => navigate('/login')} className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep">Log in</button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
