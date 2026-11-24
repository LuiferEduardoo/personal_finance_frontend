import type { ReactNode } from 'react'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import type { LoanInstallment } from './loan'

type AmortizationTableProps = {
  installments: LoanInstallment[]
  currency: string
  /** Única cuota que se puede pagar (la pendiente más antigua). */
  nextInstallmentId: string | null
  onPay: (installment: LoanInstallment) => void
}

/**
 * Tabla de amortización: tarjetas en móvil y tabla real desde `md:` (siete
 * columnas en 375 px no caben). Las pagadas llevan texto "Pagada", no solo un
 * tono distinto; "Pagar" solo aparece en la próxima cuota pendiente.
 */
export function AmortizationTable({
  installments,
  currency,
  nextInstallmentId,
  onPay,
}: AmortizationTableProps) {
  const money = (amount: number) => formatAmount(amount, currency)

  return (
    <>
      <ul className="flex flex-col gap-2 md:hidden">
        {installments.map((installment) => {
          const isPaid = installment.status === 'PAID'
          const isNext = installment.id === nextInstallmentId
          return (
            <li
              key={installment.id}
              className={`rounded-lg border p-3 ${
                isNext
                  ? 'border-ink bg-surface-raised'
                  : 'border-border bg-surface-raised'
              } ${isPaid ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-ink text-sm font-medium">
                    Cuota {installment.sequenceNumber}
                  </p>
                  <p className="text-ink-muted mt-0.5 text-xs">
                    Vence {formatDate(installment.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular text-ink text-sm font-medium">
                    {money(installment.amount)}
                  </p>
                  <InstallmentStatus installment={installment} />
                </div>
              </div>
              <dl className="text-ink-secondary mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <dt className="text-ink-muted">Capital</dt>
                  <dd className="tabular">{money(installment.principalAmount)}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Interés</dt>
                  <dd className="tabular">{money(installment.interestAmount)}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Cargos</dt>
                  <dd className="tabular">{money(installment.chargesAmount)}</dd>
                </div>
              </dl>
              {isNext && (
                <button
                  type="button"
                  onClick={() => onPay(installment)}
                  className="bg-ink text-surface mt-3 min-h-11 w-full rounded-lg px-4 text-sm font-medium hover:opacity-90"
                >
                  Pagar cuota
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <div className="border-border hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-border text-ink-secondary border-b">
            <tr>
              <Th>#</Th>
              <Th>Vence</Th>
              <Th className="text-right">Saldo inicial</Th>
              <Th className="text-right">Capital</Th>
              <Th className="text-right">Interés</Th>
              <Th className="text-right">Cargos</Th>
              <Th className="text-right">Cuota</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {installments.map((installment) => {
              const isPaid = installment.status === 'PAID'
              const isNext = installment.id === nextInstallmentId
              return (
                <tr
                  key={installment.id}
                  className={`${isPaid ? 'text-ink-muted' : 'text-ink'} ${
                    isNext ? 'bg-surface-sunken' : ''
                  }`}
                >
                  <Td>{installment.sequenceNumber}</Td>
                  <Td className="whitespace-nowrap">
                    {formatDate(installment.dueDate)}
                  </Td>
                  <Td className="tabular text-right">
                    {money(installment.openingBalance)}
                  </Td>
                  <Td className="tabular text-right">
                    {money(installment.principalAmount)}
                  </Td>
                  <Td className="tabular text-right">
                    {money(installment.interestAmount)}
                  </Td>
                  <Td className="tabular text-right">
                    {money(installment.chargesAmount)}
                  </Td>
                  <Td className="tabular text-right font-medium">
                    {money(installment.amount)}
                  </Td>
                  <Td>
                    {isNext ? (
                      <button
                        type="button"
                        onClick={() => onPay(installment)}
                        className="bg-ink text-surface min-h-9 rounded-lg px-3 text-xs font-medium whitespace-nowrap hover:opacity-90"
                      >
                        Pagar cuota
                      </button>
                    ) : (
                      <InstallmentStatus installment={installment} />
                    )}
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

function InstallmentStatus({ installment }: { installment: LoanInstallment }) {
  if (installment.status === 'PAID') {
    return (
      <span className="text-ink-secondary inline-flex flex-col text-xs">
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-income size-3.5 shrink-0"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
          Pagada
        </span>
        {/* la fecha en su propia línea: en una sola desbordaba la columna */}
        {installment.paidOn && (
          <span className="text-ink-muted whitespace-nowrap">
            {formatDate(installment.paidOn)}
          </span>
        )}
      </span>
    )
  }
  return <span className="text-ink-muted text-xs">Pendiente</span>
}

function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 text-xs font-medium ${className}`}>{children}</th>
}

function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-3 py-2.5 ${className}`}>{children}</td>
}
