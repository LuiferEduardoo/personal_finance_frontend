import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/states'
import { getApiErrorMessage } from '@/api/http'
import {
  analyzeInvestmentFile,
  commitInvestmentImport,
  discardInvestmentImport,
  getInvestmentImportBatches,
  type ImportBatch,
  type ImportDraft,
} from './investments.api'
import { InvestmentAccountsQuery } from './investments.queries'

export function InvestmentImportPage() {
  const accounts = useQuery(InvestmentAccountsQuery, {
    variables: { includeInactive: false },
  })
  const [accountId, setAccountId] = useState('')
  const [draft, setDraft] = useState<ImportDraft | null>(null)
  const [batches, setBatches] = useState<ImportBatch[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
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
      setDraft(await analyzeInvestmentFile(file, accountId || undefined))
    } catch (caught) {
      setMessage(getApiErrorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  const commit = async () => {
    if (!draft || !accountId) return
    setBusy(true)
    try {
      const result = await commitInvestmentImport(draft.batchId, accountId, draft.rows)
      setMessage(
        `${result.inserted} operaciones importadas; ${result.skippedDuplicates} duplicadas y ${result.skippedErrors} con errores omitidas.`,
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
          Analiza primero el archivo. Nada se guarda hasta que confirmes el borrador.
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
                disabled={busy || draft.stats.importable === 0}
                onClick={() => void commit()}
              >
                Importar {draft.stats.importable}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-surface-sunken text-ink-muted">
                <tr>
                  <th className="p-3">Fila</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Activo</th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Importe</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {draft.rows.slice(0, 100).map((row) => (
                  <tr key={row.rowNumber} className="border-border border-t">
                    <td className="p-3">{row.rowNumber}</td>
                    <td>{row.occurredOn ?? '—'}</td>
                    <td>{row.type ?? '—'}</td>
                    <td>{row.symbol ?? '—'}</td>
                    <td className="tabular text-right">{row.quantity ?? '—'}</td>
                    <td className="tabular text-right">
                      {row.amount ?? '—'} {row.currency}
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
