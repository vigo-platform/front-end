import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import OtpChannelSelector from '../components/OtpChannelSelector'
import { authService } from '../services/auth.service'
import { ApiError } from '../../../lib/api/client'
import { useAuthConfig } from '../hooks/useAuthConfig'
import type { OtpChannel } from '../types/auth-config.types'

type RegisterStep = 'IDENTIFIER' | 'VERIFY' | 'COMPLETE' | 'SUCCESS'

function RegisterPage() {
  const navigate = useNavigate()

  const { config, isLoading: isConfigLoading, error: configError } =
    useAuthConfig()

  const availableChannels = config.signup.enabledChannels

  const [selectedChannel, setSelectedChannel] =
    useState<OtpChannel>('EMAIL')
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
  const [errorMessage, setErrorMessage] = useState('')

  const activeChannel = availableChannels.includes(selectedChannel)
    ? selectedChannel
    : availableChannels[0]

  const isEmail = activeChannel === 'EMAIL'

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

  async function handleIdentifierSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setErrorMessage('')

    if (!activeChannel) return

    // The current signup API contract only supports email registration.
    if (activeChannel === 'PHONE') {
      setErrorMessage(
        'Phone registration is not available yet. Please use email.',
      )
      return
    }

    try {
      setIsLoading(true)

      const response = await authService.initiateSignup({
        email: identifier.trim(),
      })

      setMfaToken(response.data.mfa_token)
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
        mfa_token: mfaToken,
        otp,
      })

      setTempToken(response.data.temp_token)
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
      setIsLoading(true)

      const response = await authService.initiateSignup({
        email: identifier.trim(),
      })

      setMfaToken(response.data.mfa_token)
      setOtp('')
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCompleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    try {
      setIsLoading(true)

      await authService.completeSignup({
        temp_token: tempToken,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password,
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
      setStep('IDENTIFIER')
      setOtp('')
    } else if (step === 'COMPLETE') {
      setStep('VERIFY')
    }
  }

  const inputClassName =
    'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'

  const labelClassName = 'text-[11px] font-medium text-ink'

  return (
    <AuthLayout>
      <div className="w-full">
        {step === 'IDENTIFIER' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Create your account
              </h1>

              <p className="text-[12px] leading-relaxed text-[#55554f]">
                Join Vigo to bring your training and coaching together.
              </p>
            </div>

            {isConfigLoading ? (
              <p className="text-[12px] text-[#77776f]">
                Loading registration options...
              </p>
            ) : availableChannels.length === 0 ? (
              <p
                role="status"
                className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] leading-relaxed text-[#55554f]"
              >
                Registration is currently unavailable. Please try again later.
              </p>
            ) : (
              <form
                onSubmit={handleIdentifierSubmit}
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

                <p className="-mt-1 text-[12px] text-[#62625c]">
                  {isEmail
                    ? "We'll send a verification code to this email address."
                    : "We'll use this phone number for your registration."}
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
                  className="flex h-10 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Please wait...' : 'Continue'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-[11px] text-[#33332f]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="ml-1 font-medium text-ink no-underline hover:underline"
              >
                Log in
              </Link>
            </p>
          </>
        )}

        {step === 'VERIFY' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Verify your email
              </h1>

              <p className="text-[12px] leading-relaxed text-[#55554f]">
                Enter the verification code sent to your email address.
              </p>
            </div>

            <form
              onSubmit={handleVerifySubmit}
              className="flex flex-col gap-4"
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

              <p className="text-[11px] text-[#55554f]">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="font-medium text-ink hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </p>

              {errorMessage && (
                <p role="alert" className="text-[12px] text-red-600">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
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

        {step === 'COMPLETE' && (
          <>
            <div className="mb-6">
              <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">
                Complete your registration
              </h1>

              <p className="text-[12px] leading-relaxed text-[#55554f]">
                Finish setting up your account with your name and password.
              </p>
            </div>

            <form
              onSubmit={handleCompleteSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className={labelClassName}>
                  First name
                </label>

                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className={labelClassName}>
                  Last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={labelClassName}>
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    maxLength={32}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}"
                    title="Password must contain 8-32 characters, including uppercase, lowercase, and a number."
                    required
                    className={`${inputClassName} pr-11`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#55554f] hover:text-ink"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p role="alert" className="text-[12px] text-red-600">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <button
                type="button"
                onClick={goBack}
                className="h-7 text-[11px] text-ink hover:underline"
              >
                Back
              </button>
            </form>
          </>
        )}

        {step === 'SUCCESS' && (
          <div>
            <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">
              Account created
            </h1>

            <p className="mb-5 text-[12px] leading-relaxed text-[#55554f]">
              Your account is ready. You can now log in to continue.
            </p>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default RegisterPage