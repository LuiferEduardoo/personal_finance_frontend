import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
  children: ReactNode
}

/**
 * El chrome usa la escala neutra, no los colores semánticos: si los botones son
 * verdes, el verde deja de significar "entra dinero".
 */
const variantClasses = {
  primary: 'bg-ink text-surface hover:opacity-90 disabled:opacity-50',
  secondary:
    'border border-border bg-surface-raised text-ink hover:bg-surface-sunken disabled:opacity-50',
  ghost: 'text-ink-secondary hover:bg-surface-sunken disabled:opacity-50',
} as const

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // min-h-11 ≈ 44px: el mínimo táctil cómodo en móvil.
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-opacity disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="size-4 animate-spin"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.25"
          />
          <path
            d="M14 8a6 6 0 0 0-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
