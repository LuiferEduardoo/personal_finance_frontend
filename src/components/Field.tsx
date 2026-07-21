import { useId, type InputHTMLAttributes, type Ref } from 'react'

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string
  error?: string
  ref?: Ref<HTMLInputElement>
}

export function Field({ label, error, className = '', ref, ...props }: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <label htmlFor={id} className="text-ink-secondary block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        // El borde de error va acompañado de texto: el color por sí solo no
        // comunica el fallo a quien no lo distingue.
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`border-border bg-surface-raised text-ink placeholder:text-ink-muted focus:border-ink mt-1.5 min-h-11 w-full rounded-lg border px-3 text-base outline-none ${
          error ? 'border-expense' : ''
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-expense mt-1.5 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
