import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useConfirm } from '@/components/ConfirmDialog'
import { useSession } from '@/features/auth/SessionContext'
import { LatestTrmQuery } from '@/features/settings/trm.queries'
import { fxRateFromTrm, supportsTrm, trmFromFxRate } from '@/lib/trm'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  BrokerKind,
  InvestmentTransactionType,
  InvestmentTransactionsQuery as TransactionsData,
} from '@/graphql/generated/graphql'
import {
  BROKER_LABELS,
  compactMoney,
  INSTRUMENT_TYPES,
  TRANSACTION_LABELS,
  TRANSACTION_TYPES,
} from './investment-ui'
import {
  brokersByAccount,
  isRefining,
  paginate,
  PAGE_SIZE,
  refineTransactions,
  SERVER_WINDOW,
} from './transaction-filters'
import {
  buildTransactionsWorkbook,
  downloadBlob,
  workbookFileName,
} from './transaction-export'
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

const BROKERS = Object.entries(BROKER_LABELS) as [BrokerKind, string][]

const brokerLabel = (broker: BrokerKind | undefined) =>
  broker ? BROKER_LABELS[broker] : '—'

export function InvestmentTransactionsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isNew = location.pathname.endsWith('/nueva')
  const [accountId, setAccountId] = useState('')
  const [type, setType] = useState<InvestmentTransactionType | ''>('')
  const [broker, setBroker] = useState<BrokerKind | ''>('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const apollo = useApolloClient()
  // El broker y la etiqueta se filtran en cliente (el esquema no los acepta),
  // así que en cuanto se usan el servidor entrega una ventana única y la
  // paginación pasa a recortarse aquí.
  const refining = isRefining(broker, query)
  const serverFilter = {
    ...(accountId ? { accountId } : {}),
    ...(type ? { types: [type] } : {}),
  }
  const filter = {
    ...serverFilter,
    limit: refining ? SERVER_WINDOW : PAGE_SIZE,
    offset: refining ? 0 : page * PAGE_SIZE,
  }
  const { data, loading, error, refetch } = useQuery(InvestmentTransactionsQuery, {
    variables: { filter },
  })
  // `includeInactive` va en true porque una cuenta archivada sigue teniendo
  // operaciones, y sin ella no se podría resolver su broker.
  const accounts = useQuery(InvestmentAccountsQuery, {
    variables: { includeInactive: true },
  })
  const allAccounts = useMemo(
    () => accounts.data?.investmentAccounts ?? [],
    [accounts.data],
  )
  const brokers = useMemo(() => brokersByAccount(allAccounts), [allAccounts])
  const activeAccounts = allAccounts.filter((a) => a.isActive)
  const accountOptions = broker
    ? activeAccounts.filter((a) => a.broker === broker)
    : activeAccounts
  const rows = data?.investmentTransactions ?? []
  const refined = refining ? refineTransactions(rows, { broker, query, brokers }) : rows
  const { visible, count, saturated } = paginate(refined, {
    refining,
    page,
    total: data?.investmentTransactionsCount ?? 0,
  })
  const [remove] = useMutation(DeleteInvestmentTransactionMutation)
  const [resolveFx, resolving] = useMutation(ResolveInvestmentFxRatesMutation)
  const { confirm, dialog } = useConfirm()
  useEffect(() => {
    setPage(0)
  }, [accountId, type, broker, query])
  // Cambiar de broker puede dejar seleccionada una cuenta de otro: se limpia.
  useEffect(() => {
    if (!broker || !accountId) return
    if (!allAccounts.some((a) => a.id === accountId && a.broker === broker))
      setAccountId('')
  }, [broker, accountId, allAccounts])
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
  /**
   * Exporta todo lo que casa con los filtros, no solo la página a la vista: el
   * backend topa en 500 por consulta, así que se recorre por tandas hasta
   * cubrir el total que él mismo informa.
   */
  const exportToExcel = async () => {
    setExporting(true)
    try {
      const all: Transaction[] = []
      let total = Infinity
      while (all.length < total) {
        const chunk = await apollo.query({
          query: InvestmentTransactionsQuery,
          variables: {
            filter: { ...serverFilter, limit: SERVER_WINDOW, offset: all.length },
          },
          fetchPolicy: 'network-only',
        })
        const batch = chunk.data.investmentTransactions
        total = chunk.data.investmentTransactionsCount
        if (!batch.length) break
        all.push(...batch)
      }
      const exported = refining
        ? refineTransactions(all, { broker, query, brokers })
        : all
      if (!exported.length) {
        setNotice('No hay operaciones que exportar con estos filtros.')
        return
      }
      downloadBlob(
        await buildTransactionsWorkbook(exported, brokers),
        workbookFileName(),
      )
      setNotice(`${exported.length} operaciones exportadas a Excel.`)
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    } finally {
      setExporting(false)
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={exporting || loading}
            onClick={() => void exportToExcel()}
          >
            {exporting ? 'Exportando…' : 'Exportar a Excel'}
          </Button>
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Broker</span>
          <select
            value={broker}
            onChange={(e) => setBroker(e.target.value as BrokerKind | '')}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            <option value="">Todos</option>
            {BROKERS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Cuenta</span>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
          >
            <option value="">Todas</option>
            {accountOptions.map((a) => (
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
        <label className="text-sm">
          <span className="text-ink-secondary mb-1 block">Activo</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Símbolo o nombre"
            className="border-border bg-surface placeholder:text-ink-muted min-h-11 w-full rounded-lg border px-3"
          />
        </label>
      </div>
      {saturated && (
        <p
          role="status"
          className="border-warning/40 bg-warning/10 text-ink mt-3 rounded-lg border px-4 py-3 text-sm"
        >
          Hay más de {SERVER_WINDOW} operaciones con estos filtros. La búsqueda por
          broker y etiqueta solo recorre las {SERVER_WINDOW} más recientes: acota por
          cuenta o tipo para verlas todas. La exportación sí incluye el total.
        </p>
      )}
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
        ) : !visible.length ? (
          <EmptyState
            title={refining ? 'Sin resultados' : 'Sin operaciones'}
            description={
              refining
                ? 'Ninguna operación casa con el broker o la etiqueta que buscas.'
                : 'Registra una compra, depósito, dividendo u otro movimiento de tu cartera.'
            }
            action={
              refining ? undefined : (
                <Button onClick={() => navigate('/inversiones/operaciones/nueva')}>
                  Registrar operación
                </Button>
              )
            }
          />
        ) : (
          <div className="border-border bg-surface-raised overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-surface-sunken text-ink-muted">
                <tr>
                  <th className="p-3">Fecha</th>
                  <th>Tipo</th>
                  <th>Activo</th>
                  <th>Broker</th>
                  <th>Cuenta</th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Importe</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
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
                    <td className="text-ink-secondary">
                      {brokerLabel(brokers.get(row.accountId))}
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
      {count > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="text-ink-muted text-sm">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, count)} de {count}
          </span>
          <Button
            variant="secondary"
            disabled={(page + 1) * PAGE_SIZE >= count}
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
  const [fxRate, setFxRate] = useState(transaction?.fxRate?.toString() ?? '')
  const { user } = useSession()
  const baseCurrency = user?.baseCurrency ?? 'USD'
  const [trm, setTrm] = useState(
    trmFromFxRate(
      transaction?.fxRate,
      transaction?.currency ?? '',
      user?.baseCurrency ?? 'USD',
    )?.toString() ?? '',
  )
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
  const calculatesGrossAmount = type === 'BUY' || type === 'SELL'
  // Un depósito en pesos llega a la cartera convertido a la moneda base, y esa
  // conversión depende de la TRM del día del depósito, no de la de hoy. El
  // backend solo sabe resolver la última, así que aquí se pide explícitamente.
  const upperCurrency = currency.toUpperCase()
  const needsTrm = type === 'DEPOSIT' && supportsTrm(upperCurrency, baseCurrency)
  const latestTrm = useQuery(LatestTrmQuery, { skip: !needsTrm })
  const latestQuote = latestTrm.data?.latestTrm
  const trmRate = needsTrm
    ? fxRateFromTrm(Number(trm), upperCurrency, baseCurrency)
    : null
  const grossAmount =
    calculatesGrossAmount && num(quantity) !== undefined && num(price) !== undefined
      ? String(Math.round(num(quantity)! * num(price)! * 1_000_000) / 1_000_000)
      : amount
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (transaction)
        await update({
          variables: {
            input: {
              id: transaction.id,
              accountId,
              occurredOn: date,
              quantity: num(quantity),
              price: num(price),
              amount: num(grossAmount),
              fee: num(fee),
              tax: num(tax),
              fxRate: needsTrm ? (trmRate ?? undefined) : num(fxRate),
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
              amount: num(grossAmount),
              fee: num(fee),
              tax: num(tax),
              currency: upperCurrency,
              fxRate: needsTrm ? (trmRate ?? undefined) : num(fxRate),
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
            label={`Importe bruto${calculatesGrossAmount ? ' (automático)' : ''}`}
            type="number"
            step="any"
            min="0"
            value={grossAmount}
            readOnly={calculatesGrossAmount}
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
      {needsTrm && (
        <div>
          <Field
            label={`TRM del ${date} (USD/COP)`}
            type="number"
            step="any"
            min="0"
            value={trm}
            onChange={(e) => setTrm(e.target.value)}
            placeholder="Ej. 4150.25"
            required
            error={
              trm !== '' && trmRate == null ? 'Escribe una TRM mayor que 0.' : undefined
            }
          />
          <p className="text-ink-muted mt-1.5 text-xs">
            La TRM que regía el día del depósito, no la de hoy: es la que fija cuánto
            entró a la cartera en {baseCurrency}.
          </p>
          {latestQuote && (
            <p className="text-ink-muted mt-1 text-xs">
              Última TRM oficial: {latestQuote.value.toLocaleString('es-CO')} (desde{' '}
              {latestQuote.validFrom}).{' '}
              <button
                type="button"
                onClick={() => setTrm(String(latestQuote.value))}
                className="text-ink underline"
              >
                Usarla
              </button>
            </p>
          )}
        </div>
      )}
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
          {!needsTrm && (
            <>
              <Field
                label="Tasa a moneda base (opcional)"
                type="number"
                step="any"
                min="0"
                value={fxRate}
                onChange={(e) => setFxRate(e.target.value)}
              />
              {!transaction && (
                <p className="text-ink-muted col-span-2 text-xs">
                  Si la dejas vacía, USD y COP se convierten automáticamente con la TRM
                  oficial más reciente.
                </p>
              )}
            </>
          )}
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
        disabled={
          creating.loading ||
          updating.loading ||
          (!transaction && !accountId) ||
          (needsTrm && trmRate == null)
        }
      >
        {transaction ? 'Guardar cambios' : 'Registrar operación'}
      </Button>
    </form>
  )
}
