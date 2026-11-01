
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authService } from '../services/auth.service'
import type { LoginPasswordRequest } from '../types/auth.types'
import { ApiError } from '../../../lib/api/client'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    const credentials: LoginPasswordRequest = {
      identifier: email.trim(),
      password,
    }

    try {
      setIsLoading(true)

      const response = await authService.loginWithPassword(credentials)

      if (response.data.step === 'SUCCESS') {
        navigate('/dashboard')
        return
      }

      setErrorMessage(
        'Additional verification is required. Two-factor authentication is not implemented yet.',
      )
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to connect to the server. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="mb-7">
          <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
            Welcome back
          </h1>

          <p className="text-[13px] leading-[1.6] text-[#55554f]">
            Log in to your Vigo workspace and pick up where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[11px] font-medium text-ink"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[11px] font-medium text-ink"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11 w-full rounded-md border border-border bg-white px-3 pr-11 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#55554f] transition hover:text-ink"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-[17px]"
                    aria-hidden="true"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.2M6.2 6.2C3.9 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.5 0 2.8-.4 4-1" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-[17px]"
                    aria-hidden="true"
                  >
                    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="-mt-0.5 flex items-center justify-between text-[11px]">
            <label className="flex cursor-pointer items-center gap-2 text-[#33332f]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-[15px] cursor-pointer accent-[#c7f36b]"
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-ink no-underline hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Error */}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Register link */}
        <p className="mt-7 text-center text-[11px] text-[#33332f]">
          New to Vigo?{' '}
          <Link
            to="/register"
            className="ml-1 font-medium text-ink no-underline hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
