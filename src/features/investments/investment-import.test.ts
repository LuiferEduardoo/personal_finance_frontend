import { describe, expect, it } from 'vitest'
import type { ImportRow } from './investments.api'
import {
  assignInstrument,
  editImportRow,
  importableAfterInstrumentCreation,
  missingInstruments,
  summarizeRows,
} from './investment-import'

const invalidRow: ImportRow = {
  rowNumber: 1,
  type: null,
  occurredOn: null,
  symbol: 'MELI',
  instrumentId: 'instrument-1',
  needsInstrument: false,
  quantity: 0.00884,
  price: 1922,
  amount: 16.99048,
  fee: 0.15,
  tax: 0,
  currency: null,
  isDuplicate: false,
  errors: ['No se pudo leer la fecha', 'Falta el tipo de operación'],
  raw: {},
}

describe('edición del borrador de importación', () => {
  it('elimina errores corregidos y actualiza los valores', () => {
    const withDate = editImportRow(invalidRow, 'occurredOn', '2025-02-04')
    const corrected = editImportRow(withDate, 'type', 'buy')

    expect(corrected.occurredOn).toBe('2025-02-04')
    expect(corrected.type).toBe('buy')
    expect(corrected.errors).toEqual([])
    expect(summarizeRows([corrected]).importable).toBe(1)
  })

  it('mantiene inválidos los valores que no cumplen el formato', () => {
    const row = editImportRow(invalidRow, 'currency', 'US')
    expect(row.errors).toContain('Moneda no reconocida: "US"')
    expect(summarizeRows([row]).withErrors).toBe(1)
  })

  it('agrupa los activos faltantes por símbolo y completa su moneda', () => {
    const missing = {
      ...invalidRow,
      instrumentId: null,
      needsInstrument: true,
      currency: null,
      errors: [],
    }

    expect(
      missingInstruments(
        [missing, { ...missing, rowNumber: 2, symbol: ' meli ', currency: 'usd' }],
        'COP',
      ),
    ).toEqual([{ symbol: 'MELI', currency: 'COP' }])
  })

  it('asigna el activo creado a todas sus operaciones', () => {
    const missing = {
      ...invalidRow,
      instrumentId: null,
      needsInstrument: true,
      errors: [],
    }
    const rows = assignInstrument(
      [missing, { ...missing, rowNumber: 2, symbol: 'meli' }],
      'MELI',
      'new-instrument',
    )

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          instrumentId: 'new-instrument',
          needsInstrument: false,
        }),
        expect.objectContaining({
          instrumentId: 'new-instrument',
          needsInstrument: false,
        }),
      ]),
    )
    expect(summarizeRows(rows).needingInstrument).toBe(0)
    expect(importableAfterInstrumentCreation(rows)).toBe(2)
  })

  it('no intenta crear activos para filas inválidas o duplicadas', () => {
    const missing = {
      ...invalidRow,
      instrumentId: null,
      needsInstrument: true,
      errors: [],
    }

    expect(
      missingInstruments(
        [
          { ...missing, errors: ['Fecha inválida'] },
          { ...missing, rowNumber: 2, isDuplicate: true },
        ],
        'USD',
      ),
    ).toEqual([])
    expect(importableAfterInstrumentCreation([{ ...missing, symbol: null }])).toBe(0)
  })
})
