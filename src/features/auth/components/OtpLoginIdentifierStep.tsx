import type { FormEventHandler } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'

interface OtpLoginIdentifierStepProps {
  channels: OtpChannel[]
  activeChannel: OtpChannel
  isConfigLoading: boolean
  isLoginDisabled: boolean
  configError: string
  errorMessage: string
  isLoading: boolean
  identifier: string
  inputClassName: string
  labelClassName: string
  onIdentifierChange: (value: string) => void
  onChannelChange: (channel: OtpChannel) => void
  onSubmit: FormEventHandler<HTMLFormElement>
  onUsePassword: () => void
}

function OtpLoginIdentifierStep({
  channels,
  activeChannel,
  isConfigLoading,
  isLoginDisabled,
  configError,
  errorMessage,
  isLoading,
  identifier,
  inputClassName,
  labelClassName,
  onIdentifierChange,
  onChannelChange,
  onSubmit,
  onUsePassword,
}: OtpLoginIdentifierStepProps) {
  const isEmail = activeChannel === 'EMAIL'

  return (
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
      ) : isLoginDisabled ? (
        <p role="status" className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] text-[#55554f]">
          Login is currently disabled. Please try again later.
        </p>
      ) : channels.length === 0 ? (
        <p
          role="status"
          className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] leading-relaxed text-[#55554f]"
        >
          Login is currently unavailable. Please try again later.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <OtpChannelSelector
            channels={channels}
            value={activeChannel}
            onChange={onChannelChange}
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
              placeholder={isEmail ? 'you@example.com' : 'Enter your phone number'}
              value={identifier}
              onChange={(event) => onIdentifierChange(event.target.value)}
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
        <button
          type="button"
          onClick={onUsePassword}
          className="text-[11px] font-medium text-ink hover:underline"
        >
          Log in with password instead
        </button>
      </div>
      <div className="mt-2 text-center">
        <Link to="/forgot-password" className="text-[11px] font-medium text-ink hover:underline">
          Forgot password?
        </Link>
      </div>

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
  )
}

export default OtpLoginIdentifierStep
