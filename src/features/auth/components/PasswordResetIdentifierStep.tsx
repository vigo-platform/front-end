import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '../../../shared/components/ui'

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
  'h-11 w-full rounded-md border border-border-default bg-surface px-3 text-[13px] text-fg outline-none transition placeholder:text-fg-muted focus:border-ink'
const labelClassName = 'text-[11px] font-medium text-fg'

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
  const { t } = useTranslation()
  const isEmail = channel === 'EMAIL'

  return (
    <>
      <div className="mb-7">
        <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">
          {t("ui.Reset your password")}
        </h1>
        <p className="text-[13px] leading-[1.6] text-fg-secondary">
          {t("ui.Enter the email address or phone number linked to your account.")}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <OtpChannelSelector
          channels={channels}
          value={channel}
          onChange={onChannelChange}
        />
        <Input
          id="reset-identifier"
          label={t(isEmail ? 'ui.Email address' : 'ui.Phone number')}
          labelClassName={labelClassName}
          type={isEmail ? 'email' : 'tel'}
          inputMode={isEmail ? 'email' : 'tel'}
          autoComplete={isEmail ? 'email' : 'tel'}
          placeholder={isEmail ? 'you@example.com' : '09123456789'}
          value={identifier}
          onChange={(event) => onIdentifierChange(event.target.value)}
          required
          className={inputClassName}
        />
        {errorMessage && (
          <p
            role="alert"
            className="rounded-md bg-danger-surface px-3 py-2 text-[12px] text-danger-fg"
          >
            {errorMessage}
          </p>
        )}
        <Button type="submit" loading={isLoading} className="h-11 w-full text-[13px]">
          Send verification code
        </Button>
      </form>

      <p className="mt-7 text-center text-[11px] text-fg">
        {t('ui.Remember your password?')}{' '}
        <Link to="/login" className="ms-1 font-medium text-fg hover:underline">
          {t("ui.Log in")}
        </Link>
      </p>
    </>
  )
}

export default PasswordResetIdentifierStep
