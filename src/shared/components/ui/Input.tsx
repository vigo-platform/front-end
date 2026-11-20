import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  wrapperClassName?: string
  labelClassName?: string
}

function Input({
  id,
  label,
  hint,
  error,
  className = '',
  wrapperClassName = '',
  labelClassName = '',
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium text-fg ${labelClassName}`.trim()}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          'min-h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-fg',
          'placeholder:text-fg-muted outline-none transition-colors',
          'focus:border-brand focus-visible:ring-2 focus-visible:ring-focus-ring',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60',
          error ? 'border-danger-border' : 'border-border-default',
          className,
        ].filter(Boolean).join(' ')}
      />

      {hint && <p id={hintId} className="text-xs text-fg-muted">{hint}</p>}
      {error && <p id={errorId} role="alert" className="text-xs text-danger-fg">{error}</p>}
    </div>
  )
}

export default Input
