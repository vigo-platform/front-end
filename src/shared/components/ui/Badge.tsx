import type { HTMLAttributes } from 'react'

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'brand'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-muted text-fg-secondary',
  success: 'border border-success-border bg-success-surface text-success-fg',
  warning: 'border border-warning-border bg-warning-surface text-warning-fg',
  danger: 'border border-danger-border bg-danger-surface text-danger-fg',
  brand: 'bg-brand text-on-brand',
}

function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variantClasses[variant],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
}

export default Badge
