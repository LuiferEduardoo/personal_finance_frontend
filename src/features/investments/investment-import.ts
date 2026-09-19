import type { ImportDraft, ImportRow } from './investments.api'

export type EditableRowField =
  'occurredOn' | 'type' | 'quantity' | 'price' | 'amount' | 'fee' | 'currency'

export type MissingInstrument = {
  symbol: string
  currency: string
}

const INSTRUMENT_REQUIRED_TYPES = new Set([
  'buy',
  'sell',
  'split',
  'transfer_in',
  'transfer_out',
])

export function editImportRow(
  row: ImportRow,
  field: EditableRowField,
  rawValue: string,
): ImportRow {
  const next = { ...row, errors: [...row.errors] }
  if (field === 'occurredOn') {
    next.occurredOn = rawValue || null
    next.errors = next.errors.filter((error) => !error.toLowerCase().includes('fecha'))
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue))
      next.errors.push('No se pudo leer la fecha')
  } else if (field === 'type') {
    next.type = rawValue || null
    next.errors = next.errors.filter(
      (error) =>
        !error.startsWith('Tipo de operación') &&
        error !== 'Falta el tipo de operación' &&
        !error.includes('cantidad mayor que 0'),
    )
    if (!rawValue) next.errors.push('Falta el tipo de operación')
    next.needsInstrument = Boolean(
      rawValue && INSTRUMENT_REQUIRED_TYPES.has(rawValue) && !next.instrumentId,
    )
    if (
      rawValue &&
      INSTRUMENT_REQUIRED_TYPES.has(rawValue) &&
      (!next.quantity || next.quantity <= 0)
    )
      next.errors.push('La operación necesita una cantidad mayor que 0')
  } else if (field === 'currency') {
    const currency = rawValue.trim().toUpperCase()
    next.currency = currency || null
    next.errors = next.errors.filter((error) => !error.startsWith('Moneda'))
    if (currency && !/^[A-Z]{3}$/.test(currency))
      next.errors.push(`Moneda no reconocida: "${currency}"`)
  } else {
    const value = rawValue === '' ? null : Number(rawValue)
    if (field === 'fee') next.fee = Number.isFinite(value) ? Math.abs(value!) : 0
    else next[field] = Number.isFinite(value) ? Math.abs(value!) : null
    if (field === 'quantity') {
      next.errors = next.errors.filter(
        (error) => !error.includes('cantidad mayor que 0'),
      )
      if (
        next.type &&
        INSTRUMENT_REQUIRED_TYPES.has(next.type) &&
        (!next.quantity || next.quantity <= 0)
      )
        next.errors.push('La operación necesita una cantidad mayor que 0')
    }
  }
  return next
}

export function summarizeRows(rows: ImportRow[]): ImportDraft['stats'] {
  return {
    totalRows: rows.length,
    importable: rows.filter(
      (row) => !row.isDuplicate && !row.needsInstrument && row.errors.length === 0,
    ).length,
    duplicates: rows.filter((row) => row.isDuplicate).length,
    withErrors: rows.filter((row) => row.errors.length > 0).length,
    needingInstrument: rows.filter((row) => row.needsInstrument).length,
  }
}

export function missingInstruments(
  rows: ImportRow[],
  fallbackCurrency: string,
): MissingInstrument[] {
  const bySymbol = new Map<string, MissingInstrument>()

  for (const row of rows) {
    const symbol = row.symbol?.trim().toUpperCase()
    if (
      !row.needsInstrument ||
      row.isDuplicate ||
      row.errors.length > 0 ||
      !symbol ||
      bySymbol.has(symbol)
    )
      continue

    bySymbol.set(symbol, {
      symbol,
      currency: row.currency?.trim().toUpperCase() || fallbackCurrency.toUpperCase(),
    })
  }

  return [...bySymbol.values()]
}

export function importableAfterInstrumentCreation(rows: ImportRow[]): number {
  return rows.filter(
    (row) =>
      !row.isDuplicate &&
      row.errors.length === 0 &&
      (!row.needsInstrument || Boolean(row.symbol?.trim())),
  ).length
}

export function assignInstrument(
  rows: ImportRow[],
  symbol: string,
  instrumentId: string,
): ImportRow[] {
  const normalizedSymbol = symbol.trim().toUpperCase()

  return rows.map((row) =>
    row.needsInstrument && row.symbol?.trim().toUpperCase() === normalizedSymbol
      ? { ...row, instrumentId, needsInstrument: false }
      : row,
  )
}
