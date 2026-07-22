import { formatAmount } from '@/lib/money'
import { creditDebt, type Account } from './account'

/**
 * Barra de cupo de una tarjeta: usado / límite, con el disponible.
 *
 * El color pasa a `warning` cuando queda poco cupo. El texto siempre lleva las
 * cifras, así que el color solo refuerza.
 */
export function CreditGauge({ account }: { account: Account }) {
  const limit = account.creditLimit ?? 0
  const used = creditDebt(account)
  const available = account.availableCredit ?? Math.max(limit - used, 0)
  const ratio = limit > 0 ? Math.min(used / limit, 1) : 0
  const tight = ratio >= 0.9

  return (
    <div className="mt-2">
      <div className="bg-surface-sunken h-2 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full ${tight ? 'bg-warning' : 'bg-neutral'}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="text-ink-muted mt-1 text-xs">
        Usado {formatAmount(used, account.currency)} de{' '}
        {formatAmount(limit, account.currency)} · disponible{' '}
        <span className={tight ? 'text-warning font-medium' : 'text-ink-secondary'}>
          {formatAmount(available, account.currency)}
        </span>
      </p>
    </div>
  )
}
