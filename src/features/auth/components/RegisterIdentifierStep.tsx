import type { FormEventHandler } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'
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
    'h-11 w-full rounded-md border border-border-default bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-ink'
  const labelClassName = 'text-[11px] font-medium text-fg'

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-[25px] leading-tight font-bold tracking-[-0.5px] text-fg">
          {t("ui.Create your account")}
        </h1>
        <p className="text-[12px] leading-relaxed text-fg-secondary">
          {t("ui.Join Vigo to bring your training and coaching together.")}
        </p>
      </div>

      {isConfigLoading ? (
        <AuthOptionsSkeleton />
      ) : isRegistrationDisabled ? (
        <p role="status" className="rounded-md bg-surface-muted px-3 py-3 text-[12px] text-fg-secondary">
          {configError || 'Registration is currently disabled. Please try again later.'}
        </p>
      ) : availableChannels.length === 0 ? (
        <p
          role="status"
          className="rounded-md bg-surface-muted px-3 py-3 text-[12px] leading-relaxed text-fg-secondary"
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

          <Input
            id="identifier"
            label={t(isEmail ? 'ui.Email address' : 'ui.Phone number')}
            labelClassName={labelClassName}
            type={isEmail ? 'email' : 'tel'}
            inputMode={isEmail ? 'email' : 'tel'}
            autoComplete={isEmail ? 'email' : 'tel'}
            placeholder={isEmail ? 'you@example.com' : t('ui.Enter your phone number')}
            value={identifier}
            onChange={(event) => onIdentifierChange(event.target.value)}
            required
            className={inputClassName}
          />

          <p className="-mt-1 text-[12px] text-fg-secondary">
            {isEmail ? t("ui.We'll send a verification code to this email address.") : t('ui.We\'ll use this phone number for your registration.')}
          </p>

          {configError && (
            <p role="alert" className="text-[12px] text-danger-fg">
              {configError}
            </p>
          )}

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md bg-danger-surface px-3 py-2 text-[12px] leading-relaxed text-danger-fg"
            >
              {errorMessage}
            </p>
          )}

          <Button type="submit" loading={isLoading} className="h-10 w-full text-[13px]">
            {t('ui.Continue')}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-[11px] leading-6 text-fg-secondary">
        {t('ui.Already have an account?')}{' '}
        <Link
          to="/login"
          className="ms-1 font-semibold text-fg underline-offset-4 hover:underline"
        >
          {t("ui.Log in")}
        </Link>
      </p>
    </>
  )
}

export default RegisterIdentifierStep
