import { describe, expect, it } from 'vitest'
import { exportFileName, exportTotals, itemRows, movementRow } from './export'
import type { Transaction } from './types'

const base: Transaction = {
  id: '1',
  kind: 'EXPENSE',
  description: 'Mercado',
  amount: 50000,
  currency: 'COP',
  exchangeRate: 1,
  occurredOn: '2026-11-03',
  counterparty: 'Éxito',
  notes: null,
  categoryId: 'c1',
  categoryName: 'Comida',
  categoryIcon: null,
  accountId: 'a1',
  accountName: 'Débito',
  items: [],
  installment: null,
  loanId: null,
}

describe('exportación de movimientos', () => {
  it('deja importes como números positivos y la dirección en "Tipo"', () => {
    expect(movementRow(base)).toEqual([
      '2026-11-03',
      'Gasto',
      'Mercado',
      'Comida',
      'Débito',
      'Éxito',
      'COP',
      50000,
      1,
      50000,
      null,
    ])
  })

  it('un precio unitario desconocido queda vacío, no en 0', () => {
    const withItem: Transaction = {
      ...base,
      items: [
        {
          id: 'i1',
          articleId: null,
          articleName: null,
          articleType: null,
          description: 'Arroz',
          unitPrice: null,
          quantity: 2,
          discount: 0,
          subtotal: 8000,
        },
      ],
    }
    expect(itemRows(withItem)).toEqual([
      ['2026-11-03', 'Mercado', 'Arroz', 2, null, 0, 8000, 'COP'],
    ])
  })

  it('totaliza en moneda base usando la tasa de cambio', () => {
    const income: Transaction = {
      ...base,
      id: '2',
      kind: 'INCOME',
      amount: 100,
      currency: 'USD',
      exchangeRate: 4000,
    }
    expect(exportTotals([base, income])).toEqual({
      income: 400000,
      expense: 50000,
      balance: 350000,
    })
  })

  it('nombra el archivo con el periodo exportado', () => {
    expect(
      exportFileName(
        {
          from: '2026-11-01',
          to: '2026-11-30',
          scopeLabel: 'Todos',
          categoryName: null,
          baseCurrency: 'COP',
        },
        'pdf',
      ),
    ).toBe('movimientos-2026-11-01_2026-11-30.pdf')
  })
})
