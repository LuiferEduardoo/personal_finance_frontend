import { Money } from '@/components/Money'
import type { MoneyDirection } from '@/lib/money'

type StatTileProps = {
  label: string
  amount: number
  currency: string
  direction: MoneyDirection
  hint?: string
}

/**
 * Cifra destacada del periodo.
 *
 * No lleva gráfico: un solo número no necesita ejes, y añadirle un sparkline
 * de tres puntos sería decoración, no información.
 */
export function StatTile({ label, amount, currency, direction, hint }: StatTileProps) {
  return (
    <div className="border-border bg-surface-raised rounded-lg border p-4">
      <p className="text-ink-secondary text-sm">{label}</p>
      <div className="mt-1.5">
        <Money amount={amount} currency={currency} direction={direction} size="lg" />
      </div>
      {hint && <p className="text-ink-muted mt-1 text-xs">{hint}</p>}
    </div>
  )
}
