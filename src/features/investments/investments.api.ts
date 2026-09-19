import { apiFetch } from '@/api/http'

export type ImportRow = {
  rowNumber: number
  type: string | null
  occurredOn: string | null
  symbol: string | null
  instrumentId: string | null
  needsInstrument: boolean
  quantity: number | null
  price: number | null
  amount: number | null
  fee: number
  tax: number
  currency: string | null
  isDuplicate: boolean
  errors: string[]
  raw: Record<string, string>
}

export type ImportDraft = {
  batchId: string
  fileName: string | null
  detectedProfile: string
  detectedBroker: string
  confidence: number
  columnMapping: Record<string, string>
  headers: string[]
  sheetName: string | null
  stats: {
    totalRows: number
    importable: number
    duplicates: number
    withErrors: number
    needingInstrument: number
  }
  rows: ImportRow[]
}

export type ImportBatch = {
  id: string
  source: string
  status: string
  broker: string | null
  fileName: string | null
  parserProfile: string | null
  stats: ImportDraft['stats'] | null
  error: string | null
  createdAt: string
}

export const analyzeInvestmentFile = (file: File, accountId?: string) => {
  const form = new FormData()
  form.append('file', file)
  const query = accountId ? `?accountId=${encodeURIComponent(accountId)}` : ''
  return apiFetch<ImportDraft>(`/investments/import/analyze${query}`, { form })
}

export const commitInvestmentImport = (
  batchId: string,
  accountId: string,
  rows: ImportRow[],
) =>
  apiFetch<{
    inserted: number
    skippedDuplicates: number
    skippedErrors: number
    alreadyCommitted: boolean
  }>('/investments/import/commit', { json: { batchId, accountId, rows } })

export const discardInvestmentImport = (batchId: string) =>
  apiFetch<boolean>('/investments/import/discard', { json: { batchId } })

export const getInvestmentImportBatches = () =>
  apiFetch<ImportBatch[]>('/investments/import/batches')
