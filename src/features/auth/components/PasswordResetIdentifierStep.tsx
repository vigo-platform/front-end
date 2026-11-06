import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'

interface PasswordResetIdentifierStepProps {
  channels: OtpChannel[]
  channel: OtpChannel
  onChannelChange: (channel: OtpChannel) => void
  identifier: string
  onIdentifierChange: (value: string) => void
  errorMessage: string
  isLoading: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const inputClassName =
  'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'
const labelClassName = 'text-[11px] font-medium text-ink'

function PasswordResetIdentifierStep({
  channels,
  channel,
  onChannelChange,
  identifier,
  onIdentifierChange,
  errorMessage,
  isLoading,
  onSubmit,
}: PasswordResetIdentifierStepProps) {
  const isEmail = channel === 'EMAIL'

  return (
    <>
      <div className="mb-7">
        <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-ink">
          Reset your password
        </h1>
        <p className="text-[13px] leading-[1.6] text-[#55554f]">
          Enter the email address or phone number linked to your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <OtpChannelSelector
          channels={channels}
          value={channel}
          onChange={onChannelChange}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="reset-identifier" className={labelClassName}>
            {isEmail ? 'Email address' : 'Phone number'}
          </label>
          <input
            id="reset-identifier"
            type={isEmail ? 'email' : 'tel'}
            inputMode={isEmail ? 'email' : 'tel'}
            autoComplete={isEmail ? 'email' : 'tel'}
            placeholder={isEmail ? 'you@example.com' : '09123456789'}
            value={identifier}
            onChange={(event) => onIdentifierChange(event.target.value)}
            required
            className={inputClassName}
          />
        </div>
        {errorMessage && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700"
          >
            {errorMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full items-center justify-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition hover:bg-accent-deep disabled:opacity-60"
        >
          {isLoading ? 'Sending code...' : 'Send verification code'}
        </button>
      </form>

      <p className="mt-7 text-center text-[11px] text-[#33332f]">
        Remember your password?{' '}
        <Link to="/login" className="ml-1 font-medium text-ink hover:underline">
          Log in
        </Link>
      </p>
    </>
  )
}

export default PasswordResetIdentifierStep
