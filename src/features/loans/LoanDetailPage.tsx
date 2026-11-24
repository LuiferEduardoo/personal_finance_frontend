import { useMutation, useQuery } from '@apollo/client'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useAccounts } from '@/features/accounts/useAccounts'
import { useCategories } from '@/features/categories/useCategories'
import { evictLoans } from '@/graphql/cache'
import { getErrorCode, getFirstErrorMessage } from '@/graphql/errors'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { AmortizationTable } from './AmortizationTable'
import {
  canRemoveLoan,
  CHARGE_KIND_LABELS,
  formatPercent,
  loanProgress,
  PREPAYMENT_MODE_LABELS,
  RATE_TYPE_SUFFIX,
  type LoanInstallment,
} from './loan'
import { LoanEditForm } from './LoanEditForm'
import { LoanQuery, RemoveLoanMutation } from './loans.queries'
import { LoanStatusBadge } from './LoanStatusBadge'
import { PayInstallmentForm } from './PayInstallmentForm'
import { PrepayLoanForm } from './PrepayLoanForm'

type OpenSheet =
  | { kind: 'pay'; installment: LoanInstallment }
  | { kind: 'prepay' }
  | { kind: 'edit' }
  | null

export function LoanDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { confirm, dialog } = useConfirm()
  const [sheet, setSheet] = useState<OpenSheet>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, loading, error, refetch } = useQuery(LoanQuery, {
    variables: { id },
    skip: !id,
  })
  const { accounts } = useAccounts(true)
  const { categories } = useCategories('EXPENSE')
  // Borrar revierte el desembolso: cambian créditos y saldos.
  const [removeLoan] = useMutation(RemoveLoanMutation, { update: evictLoans })

  const loan = data?.loan

  if ((loading && !data) || isRemoving) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <LoadingRows rows={4} />
      </div>
    )
  }
  if (error || !loan) {
    // Un crédito inexistente o ajeno es un estado vacío, no un error rojo.
    const notFound =
      !error || error.graphQLErrors.some((e) => getErrorCode(e) === 'NOT_FOUND')
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {notFound ? (
          <EmptyState title="Crédito no encontrado" />
        ) : (
          <ErrorState
            message={getFirstErrorMessage(error)}
            onRetry={() => void refetch()}
          />
        )}
        <Link
          to="/creditos"
          className="text-ink-secondary mt-4 inline-block text-sm underline"
        >
          Volver a créditos
        </Link>
      </div>
    )
  }

  const progress = loanProgress(loan)
  const removable = canRemoveLoan(loan)
  const isActive = loan.status === 'ACTIVE'
  const nextId = loan.nextInstallment?.id ?? null
  const accountName = (accountId: string | null | undefined) =>
    accountId
      ? (accounts.find((account) => account.id === accountId)?.name ?? '—')
      : '—'
  const categoryName = loan.categoryId
    ? (categories.find((category) => category.id === loan.categoryId)?.name ?? '—')
    : 'Sin categoría'
  const money = (amount: number) => formatAmount(amount, loan.currency)

  const handleRemove = async () => {
    const confirmed = await confirm({
      title: `¿Eliminar "${loan.name}"?`,
      message:
        'Se borran la tabla de cuotas y los cargos, y se retira el desembolso de la cuenta.',
    })
    if (!confirmed) return
    setActionError(null)
    setIsRemoving(true)
    try {
      await removeLoan({ variables: { id: loan.id } })
      void navigate('/creditos', { replace: true })
    } catch (caught) {
      setIsRemoving(false)
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const closeSheet = () => setSheet(null)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Link to="/creditos" className="text-ink-secondary text-sm underline">
        ← Créditos
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-ink text-2xl font-semibold break-words">{loan.name}</h1>
          {loan.lender && (
            <p className="text-ink-muted mt-0.5 text-sm">{loan.lender}</p>
          )}
        </div>
        <LoanStatusBadge status={loan.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="Saldo de capital" value={money(loan.outstandingPrincipal)} />
        <Stat label="Monto desembolsado" value={money(loan.principalAmount)} />
        <Stat label="Intereses totales" value={money(loan.totalInterest)} />
        <Stat label="Seguros y comisiones" value={money(loan.totalCharges)} />
      </div>

      <dl className="border-border bg-surface-raised mt-2 grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border p-3 text-sm sm:grid-cols-2">
        <Detail label="Tasa">
          {formatPercent(loan.rate)} {RATE_TYPE_SUFFIX[loan.rateType]}
          {loan.rateType !== 'MONTHLY' && (
            <span className="text-ink-muted">
              {' '}
              · {formatPercent(loan.monthlyRate)} mensual
            </span>
          )}
        </Detail>
        <Detail label="Avance">
          {progress.paid} de {progress.total} cuotas pagadas
        </Detail>
        <Detail label="Desembolso">
          {formatDate(loan.disbursedOn)} · {accountName(loan.disbursementAccountId)}
        </Detail>
        <Detail label="Primera cuota">{formatDate(loan.firstDueDate)}</Detail>
        <Detail label="Cuenta de pagos">{accountName(loan.paymentAccountId)}</Detail>
        <Detail label="Categoría de los pagos">{categoryName}</Detail>
        {loan.installments.length !== loan.installmentCount && (
          <Detail label="Plazo pactado">{loan.installmentCount} cuotas</Detail>
        )}
      </dl>

      {loan.charges.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {loan.charges.map((charge) => (
            <li
              key={charge.id}
              className="border-border bg-surface-sunken text-ink-secondary rounded-full border px-2.5 py-1 text-xs"
            >
              {CHARGE_KIND_LABELS[charge.kind]}: {charge.name} ·{' '}
              {charge.mode === 'FIXED'
                ? `${money(charge.value)} por cuota`
                : `${formatPercent(charge.value)} mensual del saldo`}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {isActive && (
          <Button onClick={() => setSheet({ kind: 'prepay' })}>Abonar a capital</Button>
        )}
        <Button variant="secondary" onClick={() => setSheet({ kind: 'edit' })}>
          Editar
        </Button>
        <Button
          variant="secondary"
          disabled={!removable}
          onClick={() => void handleRemove()}
          aria-describedby={removable ? undefined : 'loan-remove-hint'}
        >
          Eliminar
        </Button>
      </div>
      {!removable && (
        <p id="loan-remove-hint" className="text-ink-muted mt-1 text-xs">
          No se puede eliminar: ya tiene cuotas pagadas o abonos registrados.
        </p>
      )}
      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Tabla de amortización</h2>
        <p className="text-ink-muted mt-0.5 text-xs">
          Solo se puede pagar la cuota pendiente más antigua.
        </p>
        <div className="mt-3">
          <AmortizationTable
            installments={loan.installments}
            currency={loan.currency}
            nextInstallmentId={nextId}
            onPay={(installment) => setSheet({ kind: 'pay', installment })}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Abonos a capital</h2>
        {loan.prepayments.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Sin abonos" />
          </div>
        ) : (
          <ul className="border-border divide-border bg-surface-raised mt-3 divide-y rounded-lg border">
            {loan.prepayments.map((prepayment) => (
              <li
                key={prepayment.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-ink text-sm">{formatDate(prepayment.paidOn)}</p>
                  <p className="text-ink-muted text-xs">
                    {PREPAYMENT_MODE_LABELS[prepayment.mode]}
                  </p>
                </div>
                <span className="tabular text-ink shrink-0 text-sm font-medium">
                  {money(prepayment.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Sheet
        isOpen={sheet !== null}
        onClose={closeSheet}
        title={
          sheet?.kind === 'pay'
            ? 'Pagar cuota'
            : sheet?.kind === 'prepay'
              ? 'Abonar a capital'
              : 'Editar crédito'
        }
      >
        {sheet?.kind === 'pay' && (
          <PayInstallmentForm
            key={sheet.installment.id}
            loan={loan}
            installment={sheet.installment}
            onDone={closeSheet}
          />
        )}
        {sheet?.kind === 'prepay' && <PrepayLoanForm loan={loan} onDone={closeSheet} />}
        {sheet?.kind === 'edit' && <LoanEditForm loan={loan} onDone={closeSheet} />}
      </Sheet>

      {dialog}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-surface-raised rounded-lg border p-3">
      <p className="text-ink-muted text-xs">{label}</p>
      <p className="tabular text-ink mt-0.5 text-base font-medium break-words">
        {value}
      </p>
    </div>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-ink-muted text-xs">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  )
}
