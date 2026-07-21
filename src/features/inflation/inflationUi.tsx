// oxlint-disable react/only-export-components -- este módulo agrupa los
// helpers de presentación de tasas (tiles, celdas y su color) que comparten
// las dos vistas de inflación; rateColor va junto a los componentes que lo usan.
import { formatRate } from '@/lib/money'

/**
 * Aquí el rojo/verde va invertido respecto a los importes, y es correcto: que
 * un precio o un gasto SUBA es malo, que baje es bueno. El texto siempre lleva
 * el signo (formatRate usa signDisplay), así que el color solo refuerza.
 */
export function rateColor(rate?: number | null): string {
  if (rate == null) return 'text-ink-muted'
  if (rate > 0) return 'text-expense'
  if (rate < 0) return 'text-income'
  return 'text-ink-secondary'
}

export function RateTile({
  label,
  rate,
  hint,
}: {
  label: string
  rate?: number | null
  hint: string
}) {
  return (
    <div className="border-border bg-surface-raised rounded-lg border p-4">
      <p className="text-ink-secondary text-sm">{label}</p>
      <p className={`tabular mt-1.5 text-2xl font-medium ${rateColor(rate)}`}>
        {formatRate(rate)}
      </p>
      <p className="text-ink-muted mt-1 text-xs">
        {rate == null ? 'Sin periodo con el que comparar' : hint}
      </p>
    </div>
  )
}

export function RateCell({ rate }: { rate?: number | null }) {
  return (
    <td className={`tabular px-4 py-2.5 text-right ${rateColor(rate)}`}>
      {formatRate(rate)}
    </td>
  )
}
