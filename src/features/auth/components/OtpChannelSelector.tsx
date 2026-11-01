import type { OtpChannel } from '../types/auth-config.types'

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
  if (channels.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium text-ink">
        Continue with
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
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-[#77776f] hover:text-ink'
              }`}
            >
              {channel === 'EMAIL' ? 'Email' : 'Phone'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OtpChannelSelector