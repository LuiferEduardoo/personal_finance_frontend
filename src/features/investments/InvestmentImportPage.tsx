import { useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/states'
import { getApiErrorMessage } from '@/api/http'
import {
  analyzeInvestmentFile,
  commitInvestmentImport,
  discardInvestmentImport,
  getInvestmentImportBatches,
  remapInvestmentImport,
  type ImportBatch,
  type ImportDraft,
  type ImportRow,
} from './investments.api'
import {
  editImportRow,
  assignInstrument,
  importableAfterInstrumentCreation,
  missingInstruments,
  summarizeRows,
  type EditableRowField,
} from './investment-import'
import {
  CreateInstrumentMutation,
  InvestmentAccountsQuery,
} from './investments.queries'

export function InvestmentImportPage() {
  const accounts = useQuery(InvestmentAccountsQuery, {
    variables: { includeInactive: false },
  })
  const [accountId, setAccountId] = useState('')
  const [draft, setDraft] = useState<ImportDraft | null>(null)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [batches, setBatches] = useState<ImportBatch[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [createInstrument] = useMutation(CreateInstrumentMutation)
  useEffect(() => {
    if (!accountId && accounts.data?.investmentAccounts[0])
      setAccountId(accounts.data.investmentAccounts[0].id)
  }, [accountId, accounts.data])
  useEffect(() => {
    void getInvestmentImportBatches()
      .then(setBatches)
      .catch(() => undefined)
  }, [])
  const analyze = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const analyzed = await analyzeInvestmentFile(file, accountId || undefined)
      setDraft(analyzed)
      setColumnMapping(analyzed.columnMapping)
    } catch (caught) {
      setMessage(getApiErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  const remap = async () => {
    if (!draft) return
    setBusy(true)
    setMessage(null)
    try {
      const updated = await remapInvestmentImport(
        draft.batchId,
        Object.fromEntries(
          Object.entries(columnMapping).filter(([, header]) => Boolean(header)),
        ),
        draft.detectedProfile,
      )
      setDraft(updated)
      setColumnMapping(updated.columnMapping)
      setMessage('Columnas reasignadas y filas validadas nuevamente.')
    } catch (caught) {
      setMessage(getApiErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  const updateRow = (rowNumber: number, field: EditableRowField, value: string) => {
    if (!draft) return
    const rows = draft.rows.map((row) =>
      row.rowNumber === rowNumber ? editImportRow(row, field, value) : row,
    )
    setDraft({ ...draft, rows, stats: summarizeRows(rows) })
  }
  const commit = async () => {
    if (!draft || !accountId) return
    setBusy(true)
    setMessage(null)
    try {
      const accountCurrency =
        accounts.data?.investmentAccounts.find((account) => account.id === accountId)
          ?.currency ?? 'USD'
      const instruments = missingInstruments(draft.rows, accountCurrency)
      let rows = draft.rows

      for (const instrument of instruments) {
        const created = await createInstrument({
          variables: {
            input: {
              symbol: instrument.symbol,
              name: instrument.symbol,
              currency: instrument.currency,
              assetClass: 'EQUITY',
              twelveDataSymbol: instrument.symbol,
              sector: instrument.sector || undefined,
            },
          },
        })
        const instrumentId = created.data?.createInstrument.id
        if (!instrumentId)
          throw new Error(`No se pudo crear el activo ${instrument.symbol}.`)
        rows = assignInstrument(rows, instrument.symbol, instrumentId)
        setDraft((current) =>
          current ? { ...current, rows, stats: summarizeRows(rows) } : current,
        )
      }

      const result = await commitInvestmentImport(draft.batchId, accountId, rows)
      const assetsMessage = instruments.length
        ? ` y ${instruments.length} activos creados automáticamente`
        : ''
      setMessage(
        `${result.inserted} operaciones importadas${assetsMessage}; ${result.skippedDuplicates} duplicadas y ${result.skippedErrors} con errores omitidas.`,
      )
      setDraft(null)
      setBatches(await getInvestmentImportBatches())
    } catch (caught) {
      setMessage(getApiErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  const discard = async () => {
    if (!draft) return
    setBusy(true)
    try {
      await discardInvestmentImport(draft.batchId)
      setDraft(null)
    } catch (caught) {
      setMessage(getApiErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div>
        <p className="text-ink-muted text-sm">CSV, XLSX o PDF</p>
        <h1 className="text-ink text-2xl font-semibold">Importar operaciones</h1>
        <p className="text-ink-secondary mt-1 text-sm">
          Analiza primero el archivo. Al confirmar, los activos que no existan se
          crearán automáticamente junto con sus operaciones.
        </p>
      </div>
      {message && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {message}
        </p>
      )}
      {!draft && (
        <section className="border-border bg-surface-raised mt-5 rounded-xl border p-5">
          <label className="block text-sm">
            <span className="text-ink-secondary mb-1 block">Cuenta destino</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="border-border bg-surface min-h-11 w-full max-w-md rounded-lg border px-3"
            >
              <option value="">Selecciona una cuenta</option>
              {accounts.data?.investmentAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label
            className={`border-border mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center ${!accountId || busy ? 'opacity-50' : 'hover:bg-surface-sunken'}`}
          >
            <span className="text-ink font-medium">
              {busy ? 'Analizando archivo…' : 'Selecciona el extracto del bróker'}
            </span>
            <span className="text-ink-muted mt-1 text-xs">
              Hasta 10 MB · CSV, TSV, XLSX, XLS o PDF
            </span>
            <input
              type="file"
              accept=".csv,.tsv,.txt,.xlsx,.xls,.pdf"
              disabled={!accountId || busy}
              onChange={(e) => void analyze(e.target.files?.[0])}
              className="sr-only"
            />
          </label>
        </section>
      )}
      {draft && (
        <section className="border-border bg-surface-raised mt-5 rounded-xl border">
          <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <div>
              <h2 className="text-ink font-semibold">{draft.fileName ?? 'Borrador'}</h2>
              <p className="text-ink-muted text-xs">
                {draft.detectedBroker} · {draft.detectedProfile} · confianza{' '}
                {Math.round(draft.confidence * 100)}%
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void discard()}
              >
                Descartar
              </Button>
              <Button
                disabled={busy || importableAfterInstrumentCreation(draft.rows) === 0}
                onClick={() => void commit()}
              >
                Importar {importableAfterInstrumentCreation(draft.rows)}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-5">
            <Stat label="Filas" value={draft.stats.totalRows} />
            <Stat label="Importables" value={draft.stats.importable} />
            <Stat label="Duplicadas" value={draft.stats.duplicates} />
            <Stat label="Con errores" value={draft.stats.withErrors} />
            <Stat label="Sin activo" value={draft.stats.needingInstrument} />
          </div>
          {draft.headers.length > 0 && (
            <div className="border-border border-t p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-ink text-sm font-semibold">
                    Asignación de columnas
                  </h3>
                  <p className="text-ink-muted mt-1 text-xs">
                    Corrige qué columna del archivo corresponde a cada campo y vuelve a
                    validar el borrador.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  isLoading={busy}
                  onClick={() => void remap()}
                >
                  Aplicar asignación
                </Button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MAPPABLE_FIELDS.map((field) => (
                  <label key={field.key} className="text-sm">
                    <span className="text-ink-secondary mb-1 block">{field.label}</span>
                    <select
                      value={columnMapping[field.key] ?? ''}
                      onChange={(event) =>
                        setColumnMapping((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
                    >
                      <option value="">No asignar</option>
                      {draft.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-surface-sunken text-ink-muted">
                <tr>
                  <th className="p-3">Fila</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Activo</th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Precio</th>
                  <th className="text-right">Importe</th>
                  <th className="text-right">Comisión</th>
                  <th>Moneda</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {draft.rows.slice(0, 100).map((row) => (
                  <tr key={row.rowNumber} className="border-border border-t">
                    <td className="p-3">{row.rowNumber}</td>
                    <td>
                      <input
                        type="date"
                        aria-label={`Fecha de la fila ${row.rowNumber}`}
                        value={row.occurredOn ?? ''}
                        onChange={(event) =>
                          updateRow(row.rowNumber, 'occurredOn', event.target.value)
                        }
                        className="border-border bg-surface min-h-9 rounded-md border px-2"
                      />
                    </td>
                    <td>
                      <select
                        aria-label={`Tipo de la fila ${row.rowNumber}`}
                        value={row.type ?? ''}
                        onChange={(event) =>
                          updateRow(row.rowNumber, 'type', event.target.value)
                        }
                        className="border-border bg-surface min-h-9 rounded-md border px-2"
                      >
                        <option value="">Sin tipo</option>
                        {TRANSACTION_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{row.symbol ?? '—'}</td>
                    <td>
                      <EditableNumber row={row} field="quantity" onChange={updateRow} />
                    </td>
                    <td>
                      <EditableNumber row={row} field="price" onChange={updateRow} />
                    </td>
                    <td>
                      <EditableNumber row={row} field="amount" onChange={updateRow} />
                    </td>
                    <td>
                      <EditableNumber row={row} field="fee" onChange={updateRow} />
                    </td>
                    <td>
                      <input
                        aria-label={`Moneda de la fila ${row.rowNumber}`}
                        value={row.currency ?? ''}
                        maxLength={3}
                        placeholder="USD"
                        onChange={(event) =>
                          updateRow(row.rowNumber, 'currency', event.target.value)
                        }
                        className="border-border bg-surface min-h-9 w-20 rounded-md border px-2 uppercase"
                      />
                    </td>
                    <td className="p-3 text-xs">
                      {row.isDuplicate
                        ? 'Duplicada'
                        : row.errors.length
                          ? row.errors.join(', ')
                          : row.needsInstrument
                            ? 'Requiere activo'
                            : 'Lista'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section className="mt-7">
        <h2 className="text-ink font-semibold">Importaciones recientes</h2>
        <div className="mt-3">
          {!batches.length ? (
            <EmptyState
              title="Sin importaciones"
              description="Los lotes analizados aparecerán aquí."
            />
          ) : (
            <ul className="space-y-2">
              {batches.map((batch) => (
                <li
                  key={batch.id}
                  className="border-border bg-surface-raised flex justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-ink text-sm font-medium">
                      {batch.fileName ?? batch.source}
                    </p>
                    <p className="text-ink-muted text-xs">
                      {new Date(batch.createdAt).toLocaleString('es-CO')} ·{' '}
                      {batch.broker ?? 'Sin detectar'}
                    </p>
                  </div>
                  <span className="text-ink-secondary text-xs">{batch.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface-sunken rounded-lg p-3">
      <p className="text-ink-muted text-xs">{label}</p>
      <p className="tabular text-ink text-lg font-semibold">{value}</p>
    </div>
  )
}

const MAPPABLE_FIELDS = [
  { key: 'occurredOn', label: 'Fecha' },
  { key: 'type', label: 'Tipo de operación' },
  { key: 'symbol', label: 'Activo / símbolo' },
  { key: 'isin', label: 'ISIN' },
  { key: 'quantity', label: 'Cantidad' },
  { key: 'price', label: 'Precio unitario' },
  { key: 'amount', label: 'Importe bruto' },
  { key: 'fee', label: 'Comisión' },
  { key: 'tax', label: 'Impuesto' },
  { key: 'currency', label: 'Moneda' },
  { key: 'externalId', label: 'ID externo' },
  { key: 'notes', label: 'Notas' },
] as const

const TRANSACTION_TYPES = [
  { value: 'buy', label: 'Compra' },
  { value: 'sell', label: 'Venta' },
  { value: 'dividend', label: 'Dividendo' },
  { value: 'interest', label: 'Interés' },
  { value: 'deposit', label: 'Depósito' },
  { value: 'withdrawal', label: 'Retiro' },
  { value: 'fee', label: 'Comisión' },
  { value: 'tax', label: 'Impuesto' },
  { value: 'split', label: 'Split' },
  { value: 'transfer_in', label: 'Transferencia entrante' },
  { value: 'transfer_out', label: 'Transferencia saliente' },
  { value: 'currency_exchange', label: 'Cambio de moneda' },
] as const

function EditableNumber({
  row,
  field,
  onChange,
}: {
  row: ImportRow
  field: 'quantity' | 'price' | 'amount' | 'fee'
  onChange: (rowNumber: number, field: EditableRowField, value: string) => void
}) {
  return (
    <input
      type="number"
      min="0"
      step="any"
      aria-label={`${MAPPABLE_FIELDS.find((item) => item.key === field)?.label} de la fila ${row.rowNumber}`}
      value={row[field] ?? ''}
      onChange={(event) => onChange(row.rowNumber, field, event.target.value)}
      className="border-border bg-surface tabular min-h-9 w-28 rounded-md border px-2 text-right"
    />
  )
}
