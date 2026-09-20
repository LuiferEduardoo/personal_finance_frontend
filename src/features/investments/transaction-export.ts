import type { InvestmentTransactionType } from '@/graphql/generated/graphql'
import { BROKER_LABELS, TRANSACTION_LABELS } from './investment-ui'
import type { BrokerByAccount } from './transaction-filters'

/** Lo que el libro de Excel necesita de cada operación. */
export type ExportableTransaction = {
  occurredOn: string
  type: InvestmentTransactionType
  quantity?: number | null
  price?: number | null
  amount?: number | null
  fee?: number | null
  tax?: number | null
  currency: string
  fxRate?: number | null
  notes?: string | null
  accountId: string
  account: { name: string }
  instrument?: { symbol: string; name: string } | null
}

type Column = { header: string; width: number; numeric?: boolean }

const COLUMNS: Column[] = [
  { header: 'Fecha', width: 12 },
  { header: 'Tipo', width: 22 },
  { header: 'Broker', width: 20 },
  { header: 'Cuenta', width: 22 },
  { header: 'Símbolo', width: 12 },
  { header: 'Activo', width: 30 },
  { header: 'Cantidad', width: 14, numeric: true },
  { header: 'Precio', width: 14, numeric: true },
  { header: 'Importe bruto', width: 16, numeric: true },
  { header: 'Comisión', width: 12, numeric: true },
  { header: 'Impuesto', width: 12, numeric: true },
  { header: 'Moneda', width: 10 },
  { header: 'Tasa de cambio', width: 15, numeric: true },
  { header: 'Notas', width: 40 },
]

type Cell = string | number | null

/**
 * Los importes salen como números para que Excel pueda sumarlos, y los huecos
 * como celda vacía (`null`) en vez de 0: un dividendo sin precio unitario no
 * vale cero, simplemente no tiene precio.
 */
export function transactionRow(
  row: ExportableTransaction,
  brokers: BrokerByAccount,
): Cell[] {
  const broker = brokers.get(row.accountId)
  return [
    // `occurredOn` ya viene como YYYY-MM-DD, que ordena igual como texto que
    // como fecha; convertirlo a Date lo desplazaría un día según la zona.
    row.occurredOn,
    TRANSACTION_LABELS[row.type],
    broker ? BROKER_LABELS[broker] : null,
    row.account.name,
    row.instrument?.symbol ?? null,
    row.instrument?.name ?? null,
    row.quantity ?? null,
    row.price ?? null,
    row.amount ?? null,
    row.fee ?? null,
    row.tax ?? null,
    row.currency,
    row.fxRate ?? null,
    row.notes ?? null,
  ]
}

/** `2025-09-19` → `operaciones-2025-09-19.xlsx`. */
export function workbookFileName(today = new Date()): string {
  return `operaciones-${today.toISOString().slice(0, 10)}.xlsx`
}

export async function buildTransactionsWorkbook(
  rows: readonly ExportableTransaction[],
  brokers: BrokerByAccount,
): Promise<Blob> {
  // exceljs pesa varios cientos de kB: se carga al exportar, no al abrir la
  // pantalla, para no meterlo en el chunk de la ruta.
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.created = new Date()
  const sheet = workbook.addWorksheet('Operaciones', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })
  sheet.columns = COLUMNS.map((column) => ({
    header: column.header,
    width: column.width,
    style: column.numeric ? { numFmt: '#,##0.######' } : undefined,
  }))
  sheet.getRow(1).font = { bold: true }
  for (const row of rows) sheet.addRow(transactionRow(row, brokers))
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: COLUMNS.length },
  }
  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
