import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
  spinnerClassName?: string
}

function LoadingButton({
  loading = false,
  disabled,
  children,
  className = '',
  spinnerClassName = '',
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {loading && <Spinner size="sm" className={spinnerClassName} />}
      {children}
    </button>
  )
}

export default LoadingButton
