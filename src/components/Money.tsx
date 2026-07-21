import { formatSignedAmount, type MoneyDirection } from '@/lib/money'

type MoneyProps = {
  amount: number
  currency: string
  direction: MoneyDirection
  /** `lg` para los KPI del dashboard, `sm` para listas densas. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl sm:text-3xl',
} as const

/**
 * Muestra un importe con su dirección.
 *
 * El color es el TERCER portador del significado, nunca el único: el signo (+/−)
 * y la flecha van siempre. Verde y coral quedan a ΔE 8.3 / 6.2 bajo daltonismo,
 * así que sin ellos un usuario con protanopia no distingue un ingreso de un
 * gasto. Si alguna vez hay que ahorrar espacio, se recorta el icono — nunca el
 * signo.
 */
export function Money({
  amount,
  currency,
  direction,
  size = 'md',
  className = '',
}: MoneyProps) {
  const isIncome = direction === 'in'
  const label = isIncome ? 'Ingreso' : 'Gasto'

  return (
    <span
      className={`tabular inline-flex items-center gap-1 font-medium ${
        isIncome ? 'text-income' : 'text-expense'
      } ${sizeClasses[size]} ${className}`}
    >
      <svg
        viewBox="0 0 12 12"
        aria-hidden="true"
        className="size-[0.85em] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isIncome ? (
          <path d="M6 10V2m0 0L2.5 5.5M6 2l3.5 3.5" />
        ) : (
          <path d="M6 2v8m0 0l3.5-3.5M6 10L2.5 6.5" />
        )}
      </svg>
      {/* El lector de pantalla no ve ni el color ni la flecha. */}
      <span className="sr-only">{label}: </span>
      {formatSignedAmount(amount, currency, direction)}
    </span>
  )
}
