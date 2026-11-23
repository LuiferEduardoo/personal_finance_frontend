import { formatAmount, toBaseCurrency } from '@/lib/money'
import { formatDate } from '@/lib/dates'
import type { Transaction } from './types'

/** Contexto del listado exportado: lo que el usuario tenía filtrado. */
export type ExportContext = {
  from: string
  to: string
  /** "Todos", "Gastos" o "Ingresos". */
  scopeLabel: string
  /** Nombre de la categoría filtrada, o null si son todas. */
  categoryName: string | null
  baseCurrency: string
}

type Cell = string | number | null

const KIND_LABELS: Record<Transaction['kind'], string> = {
  EXPENSE: 'Gasto',
  INCOME: 'Ingreso',
}

const MOVEMENT_COLUMNS = [
  { header: 'Fecha', width: 12 },
  { header: 'Tipo', width: 10 },
  { header: 'Descripción', width: 36 },
  { header: 'Categoría', width: 22 },
  { header: 'Cuenta', width: 22 },
  { header: 'Comercio / Origen', width: 24 },
  { header: 'Moneda', width: 9 },
  { header: 'Importe', width: 15, numeric: true },
  { header: 'Tasa de cambio', width: 14, numeric: true },
  { header: 'Importe en moneda base', width: 20, numeric: true },
  { header: 'Notas', width: 40 },
] as const

const ITEM_COLUMNS = [
  { header: 'Fecha', width: 12 },
  { header: 'Gasto', width: 36 },
  { header: 'Artículo', width: 30 },
  { header: 'Cantidad', width: 10, numeric: true },
  { header: 'Precio unitario', width: 15, numeric: true },
  { header: 'Descuento', width: 12, numeric: true },
  { header: 'Subtotal', width: 15, numeric: true },
  { header: 'Moneda', width: 9 },
] as const

/**
 * Una fila por movimiento. Los importes salen como números (positivos, como
 * los guarda el backend) para que Excel pueda sumarlos; la dirección la da la
 * columna "Tipo". La fecha se deja como texto `YYYY-MM-DD`: convertirla a Date
 * la movería un día según la zona horaria.
 */
export function movementRow(transaction: Transaction): Cell[] {
  return [
    transaction.occurredOn,
    KIND_LABELS[transaction.kind],
    transaction.description,
    transaction.categoryName,
    transaction.accountName,
    transaction.counterparty,
    transaction.currency,
    transaction.amount,
    transaction.exchangeRate,
    toBaseCurrency(transaction.amount, transaction.exchangeRate),
    transaction.notes,
  ]
}

/** Una fila por ítem de gasto. Un precio unitario desconocido queda vacío, nunca 0. */
export function itemRows(transaction: Transaction): Cell[][] {
  return transaction.items.map((item) => [
    transaction.occurredOn,
    transaction.description,
    item.articleName ?? item.description,
    item.quantity,
    item.unitPrice,
    item.discount,
    item.subtotal,
    transaction.currency,
  ])
}

export type ExportTotals = { income: number; expense: number; balance: number }

/** Totales en moneda base, igual que el resumen del Inicio. */
export function exportTotals(transactions: readonly Transaction[]): ExportTotals {
  let income = 0
  let expense = 0
  for (const transaction of transactions) {
    const value = toBaseCurrency(transaction.amount, transaction.exchangeRate)
    if (transaction.kind === 'INCOME') income += value
    else expense += value
  }
  return { income, expense, balance: income - expense }
}

/** `movimientos-2026-11-01_2026-11-30.xlsx` */
export function exportFileName(context: ExportContext, extension: 'xlsx' | 'pdf') {
  return `movimientos-${context.from}_${context.to}.${extension}`
}

function describeFilters(context: ExportContext): string {
  const parts = [
    `${formatDate(context.from)} – ${formatDate(context.to)}`,
    context.scopeLabel,
  ]
  if (context.categoryName) parts.push(`Categoría: ${context.categoryName}`)
  return parts.join(' · ')
}

export async function buildMovementsWorkbook(
  transactions: readonly Transaction[],
  context: ExportContext,
): Promise<Blob> {
  // exceljs pesa varios cientos de kB: se carga al exportar, no con la ruta.
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Movimientos', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })
  sheet.columns = MOVEMENT_COLUMNS.map((column) => ({
    header: column.header,
    width: column.width,
    style: 'numeric' in column ? { numFmt: '#,##0.##' } : undefined,
  }))
  sheet.getRow(1).font = { bold: true }
  for (const transaction of transactions) sheet.addRow(movementRow(transaction))
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: MOVEMENT_COLUMNS.length },
  }

  const items = transactions.flatMap(itemRows)
  if (items.length > 0) {
    const itemSheet = workbook.addWorksheet('Ítems', {
      views: [{ state: 'frozen', ySplit: 1 }],
    })
    itemSheet.columns = ITEM_COLUMNS.map((column) => ({
      header: column.header,
      width: column.width,
      style: 'numeric' in column ? { numFmt: '#,##0.##' } : undefined,
    }))
    itemSheet.getRow(1).font = { bold: true }
    for (const row of items) itemSheet.addRow(row)
  }

  const totals = exportTotals(transactions)
  const summary = workbook.addWorksheet('Resumen')
  summary.columns = [
    { header: 'Concepto', width: 28 },
    {
      header: `Total (${context.baseCurrency})`,
      width: 20,
      style: { numFmt: '#,##0.##' },
    },
  ]
  summary.getRow(1).font = { bold: true }
  summary.addRows([
    ['Filtros', describeFilters(context)],
    ['Movimientos', transactions.length],
    ['Ingresos', totals.income],
    ['Gastos', totals.expense],
    ['Balance', totals.balance],
  ])

  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

export async function buildMovementsPdf(
  transactions: readonly Transaction[],
  context: ExportContext,
): Promise<Blob> {
  // Igual que exceljs: jsPDF solo se descarga cuando se exporta.
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const totals = exportTotals(transactions)
  const money = (value: number) => formatAmount(value, context.baseCurrency)

  doc.setFontSize(16)
  doc.text('Movimientos', 40, 40)
  doc.setFontSize(10)
  doc.text(describeFilters(context), 40, 58)
  // Sin colores: el PDF suele imprimirse en blanco y negro, así que el signo
  // va en texto ("−" no existe en las fuentes base de jsPDF, se usa "-").
  doc.text(
    `Ingresos: ${money(totals.income)}   ·   Gastos: ${money(totals.expense)}   ·   Balance: ${totals.balance < 0 ? '-' : ''}${money(totals.balance)}`,
    40,
    74,
  )

  autoTable(doc, {
    startY: 90,
    head: [['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Cuenta', 'Importe']],
    body: transactions.map((transaction) => [
      formatDate(transaction.occurredOn),
      KIND_LABELS[transaction.kind],
      transaction.description,
      transaction.categoryName ?? '—',
      transaction.accountName ?? '—',
      `${transaction.kind === 'EXPENSE' ? '-' : '+'}${formatAmount(transaction.amount, transaction.currency)}`,
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [40, 40, 40] },
    columnStyles: { 5: { halign: 'right' } },
  })

  return doc.output('blob')
}
