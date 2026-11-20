import type { FormEventHandler } from 'react'
import { Link } from 'react-router-dom'
import OtpChannelSelector from './OtpChannelSelector'
import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'
import { AuthOptionsSkeleton } from '../../../shared/components/feedback/LoadingStates'
import { Button, Input } from '../../../shared/components/ui'

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
  const { t } = useTranslation()
  const isEmail = activeChannel === 'EMAIL'

  return (
    <>
      <div className="mb-7">
        <h1 className="mb-2 text-[26px] leading-tight font-bold tracking-[-0.5px] text-fg">
          {t("ui.Welcome back")}
        </h1>
        <p className="text-[13px] leading-[1.6] text-fg-secondary">
          {t("ui.Log in to your Vigo workspace and pick up where you left off.")}
        </p>
      </div>

      {isConfigLoading ? (
        <AuthOptionsSkeleton />
      ) : isLoginDisabled ? (
        <p role="status" className="rounded-md bg-surface-muted px-3 py-3 text-[12px] text-fg-secondary">
          {configError || 'Login is currently disabled. Please try again later.'}
        </p>
      ) : channels.length === 0 ? (
        <p
          role="status"
          className="rounded-md bg-surface-muted px-3 py-3 text-[12px] leading-relaxed text-fg-secondary"
        >
          {t("ui.Login is currently unavailable. Please try again later.")}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <OtpChannelSelector
            channels={channels}
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

          <p className="-mt-2 text-[12px] leading-relaxed text-fg-secondary">
            {t('ui.We\'ll send a verification code to your {{channel}}.', { channel: t(isEmail ? 'ui.Email address' : 'ui.Phone number') })}
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

          <Button type="submit" loading={isLoading} size="md" className="h-11 w-full text-[13px]">
            {t('ui.Continue')}
          </Button>
        </form>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onUsePassword}
          className="text-[11px] font-medium text-fg hover:underline"
        >
          {t("ui.Log in with password instead")}
        </button>
      </div>
      <div className="mt-2 text-center">
        <Link to="/forgot-password" className="text-[11px] font-medium text-fg hover:underline">
          {t("ui.Forgot password?")}
        </Link>
      </div>

      <p className="mt-7 text-center text-[11px] text-fg">
        {t('ui.New to Vigo?')}{' '}
        <Link
          to="/register"
          className="ms-1 font-medium text-fg no-underline hover:underline"
        >
          {t("ui.Create an account")}
        </Link>
      </p>
    </>
  )
}

export default OtpLoginIdentifierStep
