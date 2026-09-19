import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useConfirm } from '@/components/ConfirmDialog'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  InvestmentTransactionType,
  InvestmentTransactionsQuery as TransactionsData,
} from '@/graphql/generated/graphql'
import {
  compactMoney,
  INSTRUMENT_TYPES,
  TRANSACTION_LABELS,
  TRANSACTION_TYPES,
} from './investment-ui'
import {
  CreateInvestmentTransactionMutation,
  DeleteInvestmentTransactionMutation,
  InstrumentSearchQuery,
  InvestmentAccountsQuery,
  InvestmentTransactionsQuery,
  ResolveInvestmentFxRatesMutation,
  UpdateInvestmentTransactionMutation,
} from './investments.queries'

type Transaction = TransactionsData['investmentTransactions'][number]

export function InvestmentTransactionsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nueva')
  const [accountId, setAccountId] = useState('')
  const [type, setType] = useState<InvestmentTransactionType | ''>('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const limit = 50
  const filter = {
    limit,
    offset: page * limit,
    ...(accountId ? { accountId } : {}),
    ...(type ? { types: [type] } : {}),
  }
  const { data, loading, error, refetch } = useQuery(InvestmentTransactionsQuery, {
    variables: { filter },
  })
  const accounts = useQuery(InvestmentAccountsQuery, {
    variables: { includeInactive: false },
  })
  const [remove] = useMutation(DeleteInvestmentTransactionMutation)
  const [resolveFx, resolving] = useMutation(ResolveInvestmentFxRatesMutation)
  const { confirm, dialog } = useConfirm()
  useEffect(() => {
    setPage(0)
  }, [accountId, type])
  const close = () => {
    setEditing(null)
    if (isNew) navigate('/inversiones/operaciones', { replace: true })
  }
  const deleteRow = async (row: Transaction) => {
    if (!(await confirm({ title: `¿Eliminar la operación del ${row.occurredOn}?` })))
      return
    try {
      await remove({ variables: { id: row.id } })
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }
  const fixFx = async () => {
    try {
      const result = await resolveFx()
      setNotice(
        `${result.data?.resolveInvestmentFxRates ?? 0} tasas de cambio corregidas.`,
      )
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink-muted text-sm">Libro de inversión</p>
          <h1 className="text-ink text-2xl font-semibold">Operaciones</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={resolving.loading}
            onClick={() => void fixFx()}
          >
            Resolver tasas
          </Button>
          <Button onClick={() => navigate('/inversiones/operaciones/nueva')}>
            Nueva operación
          </Button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Cuenta</span>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            <option value="">Todas</option>
            {accounts.data?.investmentAccounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Tipo</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as InvestmentTransactionType | '')}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            <option value="">Todos</option>
            {TRANSACTION_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {notice && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {notice}
        </p>
      )}
      <div className="mt-4">
        {loading ? (
          <LoadingRows rows={7} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : !data?.investmentTransactions.length ? (
          <EmptyState
            title="Sin operaciones"
            description="Registra una compra, depósito, dividendo u otro movimiento de tu cartera."
            action={
              <Button onClick={() => navigate('/inversiones/operaciones/nueva')}>
                Registrar operación
              </Button>
            }
          />
        ) : (
          <div className="border-border bg-surface-raised overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-surface-sunken text-ink-muted">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th>Tipo</th>
                  <th>Activo</th>
                  <th>Cuenta</th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Importe</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.investmentTransactions.map((row) => (
                  <tr key={row.id} className="border-border border-t">
                    <td className="p-3">{row.occurredOn}</td>
                    <td>{TRANSACTION_LABELS[row.type]}</td>
                    <td>
                      {row.instrument ? (
                        <>
                          <p className="text-ink font-medium">
                            {row.instrument.symbol}
                          </p>
                          <p className="text-ink-muted text-xs">
                            {row.instrument.name}
                          </p>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{row.account.name}</td>
                    <td className="tabular text-right">
                      {row.quantity?.toLocaleString('es-CO') ?? '—'}
                    </td>
                    <td className="tabular text-right">
                      {compactMoney(row.amount, row.currency)}
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => setEditing(row)}
                        className="text-ink-secondary min-h-10 px-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => void deleteRow(row)}
                        className="text-expense min-h-10 px-2"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data && data.investmentTransactionsCount > limit && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-ink-muted text-sm">
            {page * limit + 1}–
            {Math.min((page + 1) * limit, data.investmentTransactionsCount)} de{' '}
            {data.investmentTransactionsCount}
          </span>
          <Button
            variant="secondary"
            disabled={(page + 1) * limit >= data.investmentTransactionsCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
      <Sheet
        isOpen={isNew || !!editing}
        onClose={close}
        title={editing ? 'Editar operación' : 'Nueva operación'}
      >
        {(isNew || editing) && (
          <TransactionForm
            transaction={editing ?? undefined}
            accounts={accounts.data?.investmentAccounts ?? []}
            onDone={async () => {
              close()
              await refetch()
            }}
          />
        )}
      </Sheet>
      {dialog}
    </div>
  )
}

function TransactionForm({
  transaction,
  accounts,
  onDone,
}: {
  transaction?: Transaction
  accounts: readonly { id: string; name: string; currency: string }[]
  onDone: () => Promise<void>
}) {
  const [accountId, setAccountId] = useState(
    transaction?.accountId ?? accounts[0]?.id ?? '',
  )
  const [type, setType] = useState<InvestmentTransactionType>(
    transaction?.type ?? 'BUY',
  )
  const [date, setDate] = useState(
    transaction?.occurredOn ?? new Date().toISOString().slice(0, 10),
  )
  const [instrumentQuery, setInstrumentQuery] = useState(
    transaction?.instrument?.symbol ?? '',
  )
  const [instrumentId, setInstrumentId] = useState(transaction?.instrumentId ?? '')
  const [quantity, setQuantity] = useState(transaction?.quantity?.toString() ?? '')
  const [price, setPrice] = useState(transaction?.price?.toString() ?? '')
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? '')
  const [fee, setFee] = useState(transaction?.fee?.toString() ?? '0')
  const [tax, setTax] = useState(transaction?.tax?.toString() ?? '0')
  const [currency, setCurrency] = useState(
    transaction?.currency ??
      accounts.find((a) => a.id === accountId)?.currency ??
      'USD',
  )
  const [fxRate, setFxRate] = useState(transaction?.fxRate?.toString() ?? '1')
  const [notes, setNotes] = useState(transaction?.notes ?? '')
  const [settlementCurrency, setSettlementCurrency] = useState(
    transaction?.settlementCurrency ?? '',
  )
  const [settlementAmount, setSettlementAmount] = useState(
    transaction?.settlementAmount?.toString() ?? '',
  )
  const [ratioN, setRatioN] = useState(
    transaction?.splitRatioNumerator?.toString() ?? '',
  )
  const [ratioD, setRatioD] = useState(
    transaction?.splitRatioDenominator?.toString() ?? '',
  )
  const [counterparty, setCounterparty] = useState(
    transaction?.counterpartyAccountId ?? '',
  )
  const [message, setMessage] = useState<string | null>(null)
  const search = useQuery(InstrumentSearchQuery, {
    variables: { query: instrumentQuery, limit: 8 },
    skip: !INSTRUMENT_TYPES.includes(type) || instrumentQuery.trim().length < 1,
  })
  const [create, creating] = useMutation(CreateInvestmentTransactionMutation)
  const [update, updating] = useMutation(UpdateInvestmentTransactionMutation)
  const num = (value: string) => (value === '' ? undefined : Number(value))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (transaction)
        await update({
          variables: {
            input: {
              id: transaction.id,
              occurredOn: date,
              quantity: num(quantity),
              price: num(price),
              amount: num(amount),
              fee: num(fee),
              tax: num(tax),
              fxRate: num(fxRate),
              splitRatioNumerator: num(ratioN),
              splitRatioDenominator: num(ratioD),
              notes: notes || undefined,
            },
          },
        })
      else
        await create({
          variables: {
            input: {
              accountId,
              type,
              occurredOn: date,
              instrumentId: instrumentId || undefined,
              quantity: num(quantity),
              price: num(price),
              amount: num(amount),
              fee: num(fee),
              tax: num(tax),
              currency: currency.toUpperCase(),
              fxRate: num(fxRate),
              settlementCurrency: settlementCurrency || undefined,
              settlementAmount: num(settlementAmount),
              splitRatioNumerator: num(ratioN),
              splitRatioDenominator: num(ratioD),
              counterpartyAccountId: counterparty || undefined,
              notes: notes || undefined,
            },
          },
        })
      await onDone()
    } catch (caught) {
      setMessage(getFirstErrorMessage(caught))
    }
  }
  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Cuenta</span>
          <select
            disabled={!!transaction}
            required
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Tipo</span>
          <select
            disabled={!!transaction}
            value={type}
            onChange={(e) => setType(e.target.value as InvestmentTransactionType)}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            {TRANSACTION_TYPES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Field
        label="Fecha"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      {INSTRUMENT_TYPES.includes(type) && (
        <div>
          <Field
            label="Buscar activo"
            value={instrumentQuery}
            onChange={(e) => {
              setInstrumentQuery(e.target.value)
              setInstrumentId('')
            }}
            required={!instrumentId}
          />
          {search.data?.instrumentSearch.length ? (
            <ul className="border-border mt-1 rounded-lg border p-1">
              {search.data.instrumentSearch.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setInstrumentId(item.id)
                      setInstrumentQuery(`${item.symbol} · ${item.name}`)
                      setCurrency(item.currency)
                    }}
                    className={`hover:bg-surface-sunken w-full rounded p-2 text-left text-sm ${instrumentId === item.id ? 'bg-surface-sunken' : ''}`}
                  >
                    <b>{item.symbol}</b> · {item.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {![
          'DEPOSIT',
          'WITHDRAWAL',
          'FEE',
          'TAX',
          'DIVIDEND',
          'INTEREST',
          'CURRENCY_EXCHANGE',
        ].includes(type) && (
          <Field
            label="Cantidad"
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        )}{' '}
        {['BUY', 'SELL', 'TRANSFER_IN', 'TRANSFER_OUT'].includes(type) && (
          <Field
            label="Precio unitario"
            type="number"
            step="any"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        )}{' '}
        {type !== 'SPLIT' && (
          <Field
            label="Importe bruto"
            type="number"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}
        <Field
          label="Moneda"
          value={currency}
          maxLength={3}
          onChange={(e) => setCurrency(e.target.value)}
          required
        />
      </div>
      {type === 'SPLIT' && (
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Ratio nuevo"
            type="number"
            min="1"
            value={ratioN}
            onChange={(e) => setRatioN(e.target.value)}
            required
          />
          <Field
            label="Ratio anterior"
            type="number"
            min="1"
            value={ratioD}
            onChange={(e) => setRatioD(e.target.value)}
            required
          />
        </div>
      )}
      {type === 'CURRENCY_EXCHANGE' && (
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Moneda recibida"
            value={settlementCurrency}
            maxLength={3}
            onChange={(e) => setSettlementCurrency(e.target.value)}
            required
          />
          <Field
            label="Importe recibido"
            type="number"
            step="any"
            min="0"
            value={settlementAmount}
            onChange={(e) => setSettlementAmount(e.target.value)}
            required
          />
        </div>
      )}
      {type === 'TRANSFER_OUT' && (
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">
            Cuenta destino (opcional)
          </span>
          <select
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            <option value="">Externa</option>
            {accounts
              .filter((a) => a.id !== accountId)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </select>
        </label>
      )}
      <details>
        <summary className="text-ink-secondary cursor-pointer text-sm">
          Costos y detalles
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field
            label="Comisión"
            type="number"
            step="any"
            min="0"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
          <Field
            label="Impuesto"
            type="number"
            step="any"
            min="0"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
          <Field
            label="Tasa a moneda base"
            type="number"
            step="any"
            min="0"
            value={fxRate}
            onChange={(e) => setFxRate(e.target.value)}
          />
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-ink-secondary mb-1 block">Notas</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-border bg-surface min-h-20 w-full rounded-lg border p-3"
          />
        </label>
      </details>
      {message && <ErrorState message={message} />}
      <Button
        type="submit"
        disabled={creating.loading || updating.loading || (!transaction && !accountId)}
      >
        {transaction ? 'Guardar cambios' : 'Registrar operación'}
      </Button>
    </form>
  )
}
