import type { LoanStatus } from '@/graphql/generated/graphql'
import { LOAN_STATUS_LABELS } from './loan'

/** Estado del crédito en texto: el color de fondo solo refuerza. */
export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        status === 'PAID_OFF'
          ? 'border-income/40 bg-income/10 text-ink'
          : 'border-border bg-surface-sunken text-ink-secondary'
      }`}
    >
      {LOAN_STATUS_LABELS[status]}
    </span>
  )
}
