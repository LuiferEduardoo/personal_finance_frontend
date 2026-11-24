import { Link } from 'react-router'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { loanProgress, type LoanSummary } from './loan'
import { LoanStatusBadge } from './LoanStatusBadge'

/**
 * Tarjeta de la lista: saldo de capital, próxima cuota y avance. El saldo no
 * es un movimiento, así que va con `formatAmount` y no con `<Money>`.
 */
export function LoanCard({ loan }: { loan: LoanSummary }) {
  const progress = loanProgress(loan)
  const next = loan.nextInstallment

  return (
    <li>
      <Link
        to={`/creditos/${loan.id}`}
        className="border-border bg-surface-raised hover:bg-surface-sunken block rounded-lg border p-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-ink truncate text-sm font-medium">{loan.name}</p>
            {loan.lender && (
              <p className="text-ink-muted mt-0.5 truncate text-xs">{loan.lender}</p>
            )}
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-ink-muted text-xs">Saldo de capital</p>
            <p className="tabular text-ink mt-0.5 text-sm font-medium">
              {formatAmount(loan.outstandingPrincipal, loan.currency)}
            </p>
          </div>
          <div>
            <p className="text-ink-muted text-xs">Próxima cuota</p>
            {next ? (
              <p className="text-ink mt-0.5 text-sm">
                <span className="tabular font-medium">
                  {formatAmount(next.amount, loan.currency)}
                </span>
                <span className="text-ink-muted block text-xs">
                  {formatDate(next.dueDate)}
                </span>
              </p>
            ) : (
              <p className="text-ink-muted mt-0.5 text-sm">—</p>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="text-ink-secondary">
              {progress.paid} de {progress.total} cuotas pagadas
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Cuotas pagadas"
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.paid}
            aria-valuetext={`${progress.paid} de ${progress.total}`}
            className="bg-surface-sunken mt-1.5 h-2 overflow-hidden rounded-full"
          >
            <div
              className="bg-neutral h-full rounded-full"
              style={{ width: `${progress.ratio * 100}%` }}
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
