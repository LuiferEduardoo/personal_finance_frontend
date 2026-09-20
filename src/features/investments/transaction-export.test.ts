import { describe, expect, it } from 'vitest'
import { brokersByAccount } from './transaction-filters'
import {
  buildTransactionsWorkbook,
  transactionRow,
  workbookFileName,
} from './transaction-export'

const brokers = brokersByAccount([{ id: 'a1', broker: 'ETORO' }])

const buy = {
  occurredOn: '2025-03-04',
  type: 'BUY' as const,
  quantity: 3,
  price: 12.5,
  amount: 37.5,
  fee: 0.4,
  tax: 0,
  currency: 'USD',
  fxRate: 4100,
  notes: null,
  accountId: 'a1',
  account: { name: 'eToro USD' },
  instrument: { symbol: 'AAPL', name: 'Apple Inc.' },
}

describe('exportación a Excel', () => {
  it('traduce tipo y broker, y deja los importes como números', () => {
    expect(transactionRow(buy, brokers)).toEqual([
      '2025-03-04',
      'Compra',
      'eToro',
      'eToro USD',
      'AAPL',
      'Apple Inc.',
      3,
      12.5,
      37.5,
      0.4,
      0,
      'USD',
      4100,
      null,
    ])
  })

  it('deja la celda vacía —no 0— cuando el dato no existe', () => {
    const dividend = {
      ...buy,
      type: 'DIVIDEND' as const,
      quantity: null,
      price: null,
      fxRate: null,
      instrument: null,
    }
    const cells = transactionRow(dividend, brokers)
    expect(cells[4]).toBeNull()
    expect(cells[6]).toBeNull()
    expect(cells[7]).toBeNull()
    expect(cells[12]).toBeNull()
  })

  it('deja el broker vacío si la cuenta no está en el mapa', () => {
    expect(transactionRow(buy, new Map())[2]).toBeNull()
  })

  it('nombra el archivo con la fecha del día', () => {
    expect(workbookFileName(new Date('2025-09-19T10:00:00Z'))).toBe(
      'operaciones-2025-09-19.xlsx',
    )
  })

  it('genera un libro xlsx no vacío', async () => {
    const blob = await buildTransactionsWorkbook([buy], brokers)
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toContain('spreadsheetml')
  })
})
