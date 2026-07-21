import { useId, type Ref, type SelectHTMLAttributes } from 'react'

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string
  error?: string
  ref?: Ref<HTMLSelectElement>
}

export function Select({
  label,
  error,
  className = '',
  children,
  ref,
  ...props
}: SelectProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className="text-ink-secondary block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`border-border bg-surface-raised text-ink focus:border-ink mt-1.5 min-h-11 w-full rounded-lg border px-3 text-base outline-none ${
          error ? 'border-expense' : ''
        }`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-expense mt-1.5 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
