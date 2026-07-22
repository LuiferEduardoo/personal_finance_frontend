import { useMutation, useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/Button'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { ACCOUNT_TYPE_LABELS, creditDebt, isCreditAccount } from './account'
import {
  AccountQuery,
  AccountTransfersQuery,
  RecalculateAccountBalanceMutation,
} from './accounts.queries'
import { CreditGauge } from './CreditGauge'

export function AccountDetailPage() {
  const { id = '' } = useParams()

  const { data, loading, error } = useQuery(AccountQuery, {
    variables: { id },
    skip: !id,
  })
  const { data: transfersData } = useQuery(AccountTransfersQuery, {
    variables: { accountId: id },
    skip: !id,
  })

  const [recalculate, { loading: recalculating }] = useMutation(
    RecalculateAccountBalanceMutation,
  )

  const account = data?.account
  const transfers = transfersData?.accountTransfers ?? []

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <LoadingRows rows={4} />
      </div>
    )
  }
  if (error || !account) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <ErrorState
          message={error ? getFirstErrorMessage(error) : 'Cuenta no encontrada'}
        />
        <Link
          to="/cuentas"
          className="text-ink-secondary mt-4 inline-block text-sm underline"
        >
          Volver a cuentas
        </Link>
      </div>
    )
  }

  const isCredit = isCreditAccount(account.type)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link to="/cuentas" className="text-ink-secondary text-sm underline">
        ← Cuentas
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-ink text-2xl font-semibold">{account.name}</h1>
          <p className="text-ink-muted mt-0.5 text-sm">
            {ACCOUNT_TYPE_LABELS[account.type]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-ink-muted text-xs">{isCredit ? 'Deuda' : 'Saldo'}</p>
          <p
            className={`tabular text-2xl font-medium ${
              (isCredit ? creditDebt(account) > 0 : account.balance < 0)
                ? 'text-expense'
                : 'text-ink'
            }`}
          >
            {formatAmount(
              isCredit ? creditDebt(account) : account.balance,
              account.currency,
            )}
          </p>
        </div>
      </div>

      {isCredit && account.creditLimit != null && (
        <div className="border-border bg-surface-raised mt-4 rounded-lg border p-3">
          <CreditGauge account={account} />
        </div>
      )}

      <div className="mt-4">
        <Button
          variant="secondary"
          isLoading={recalculating}
          onClick={() => void recalculate({ variables: { id: account.id } })}
        >
          Recalcular saldo
        </Button>
        <p className="text-ink-muted mt-1 text-xs">
          Corrige el saldo si algo quedó descuadrado.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Transferencias</h2>
        {transfers.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Sin transferencias" />
          </div>
        ) : (
          <ul className="border-border divide-border bg-surface-raised mt-3 divide-y rounded-lg border">
            {transfers.map((transfer) => {
              // El signo es relativo a ESTA cuenta: sale si es el origen.
              const outgoing = transfer.fromAccount.id === account.id
              const other = outgoing ? transfer.toAccount : transfer.fromAccount
              return (
                <li
                  key={transfer.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-ink truncate text-sm">
                      {outgoing ? `Hacia ${other.name}` : `Desde ${other.name}`}
                    </p>
                    <p className="text-ink-muted text-xs">
                      {formatDate(transfer.occurredOn)}
                      {transfer.note && ` · ${transfer.note}`}
                    </p>
                  </div>
                  <span
                    className={`tabular shrink-0 text-sm font-medium ${
                      outgoing ? 'text-expense' : 'text-income'
                    }`}
                  >
                    {outgoing ? '−' : '+'}
                    {formatAmount(transfer.amount, account.currency)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
