import type { HTMLAttributes } from 'react'

type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
  muted?: boolean
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6 sm:p-7',
}

function Card({
  padding = 'md',
  muted = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        'rounded-2xl border border-border-default',
        muted ? 'bg-surface-subtle' : 'bg-surface',
        paddingClasses[padding],
        className,
      ].filter(Boolean).join(' ')}
    />
  )
}

export default Card
