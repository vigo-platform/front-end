import type { FormEventHandler } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'
import Spinner from '../../../shared/components/feedback/Spinner'
import { AuthOptionsSkeleton } from '../../../shared/components/feedback/LoadingStates'

interface RegisterIdentifierStepProps {
  availableChannels: OtpChannel[]
  activeChannel: OtpChannel
  isConfigLoading: boolean
  isRegistrationDisabled: boolean
  configError: string
  errorMessage: string
  isLoading: boolean
  identifier: string
  onIdentifierChange: (value: string) => void
  onChannelChange: (channel: OtpChannel) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

function RegisterIdentifierStep({
  availableChannels,
  activeChannel,
  isConfigLoading,
  isRegistrationDisabled,
  configError,
  errorMessage,
  isLoading,
  identifier,
  onIdentifierChange,
  onChannelChange,
  onSubmit,
}: RegisterIdentifierStepProps) {
  const { t } = useTranslation()
  const isEmail = activeChannel === 'EMAIL'
  const inputClassName =
    'h-11 w-full rounded-md border border-border bg-white px-3 text-[13px] text-ink outline-none transition placeholder:text-[#999991] focus:border-ink'
  const labelClassName = 'text-[11px] font-medium text-ink'

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-ink">
          {t("ui.Create your account")}
        </h1>
        <p className="text-[12px] leading-relaxed text-[#55554f]">
          {t("ui.Join Vigo to bring your training and coaching together.")}
        </p>
      </div>

      {isConfigLoading ? (
        <AuthOptionsSkeleton />
      ) : isRegistrationDisabled ? (
        <p role="status" className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] text-[#55554f]">
          {configError || 'Registration is currently disabled. Please try again later.'}
        </p>
      ) : availableChannels.length === 0 ? (
        <p
          role="status"
          className="rounded-md bg-[#f3f3ef] px-3 py-3 text-[12px] leading-relaxed text-[#55554f]"
        >
          {t("ui.Registration is currently unavailable. Please try again later.")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <OtpChannelSelector
            channels={availableChannels}
            value={activeChannel}
            onChange={onChannelChange}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="identifier" className={labelClassName}>
              {t(isEmail ? 'ui.Email address' : 'ui.Phone number')}
            </label>
            <input
              id="identifier"
              type={isEmail ? 'email' : 'tel'}
              inputMode={isEmail ? 'email' : 'tel'}
              autoComplete={isEmail ? 'email' : 'tel'}
              placeholder={isEmail ? 'you@example.com' : t('ui.Enter your phone number')}
              value={identifier}
              onChange={(event) => onIdentifierChange(event.target.value)}
              required
              className={inputClassName}
            />
          </div>

          <p className="-mt-1 text-[12px] text-[#62625c]">
            {isEmail ? t('ui.We\'ll send a verification code to this email address.') : t('ui.We\'ll use this phone number for your registration.')}
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
            {isLoading && <Spinner size="sm" />}{'Continue'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-[11px] text-[#33332f]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="ms-1 font-medium text-ink no-underline hover:underline"
        >
          {t("ui.Log in")}
        </Link>
      </p>
    </>
  )
}

export default RegisterIdentifierStep
