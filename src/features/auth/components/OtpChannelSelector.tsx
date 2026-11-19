import type { OtpChannel } from '../types/auth-config.types'
import { useTranslation } from 'react-i18next'

interface OtpChannelSelectorProps {
  channels: OtpChannel[]
  value: OtpChannel
  onChange: (channel: OtpChannel) => void
}

function OtpChannelSelector({
  channels,
  value,
  onChange,
}: OtpChannelSelectorProps) {
  const { t } = useTranslation()
  if (channels.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-fg">
        {t('ui.Continue with')}
      </span>

      <div className="grid grid-cols-2 gap-2 rounded-lg bg-soft-gray p-1">
        {channels.map((channel) => {
          const isSelected = value === channel

          return (
            <button
              key={channel}
              type="button"
              onClick={() => onChange(channel)}
              aria-pressed={isSelected}
              className={`h-9 rounded-md text-[12px] font-medium transition ${
                isSelected
                  ? 'bg-surface text-fg shadow-sm'
                  : 'text-fg-secondary hover:text-fg'
              }`}
            >
              {channel === 'EMAIL' ? t('ui.Email') : t('ui.Phone')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OtpChannelSelector