import { describe, expect, it } from 'vitest'
import type { Transaction } from '@/features/transactions/types'
import { monthlySeries, summarize, totalsByCategory } from './summary'

function transaction(overrides: Partial<Transaction>): Transaction {
  return {
    id: 'x',
    kind: 'EXPENSE',
    description: 'x',
    amount: 100,
    currency: 'COP',
    exchangeRate: 1,
    occurredOn: '2026-07-15',
    counterparty: null,
    notes: null,
    categoryId: null,
    categoryName: null,
    categoryIcon: null,
    ...overrides,
  }
}

describe('summarize', () => {
  it('separa ingresos de gastos y calcula el balance', () => {
    const result = summarize([
      transaction({ kind: 'INCOME', amount: 4_500_000 }),
      transaction({ kind: 'EXPENSE', amount: 185_000 }),
      transaction({ kind: 'EXPENSE', amount: 1_200_000 }),
    ])

    expect(result.income).toBe(4_500_000)
    expect(result.expense).toBe(1_385_000)
    expect(result.balance).toBe(3_115_000)
  })

  it('convierte a moneda base con exchangeRate', () => {
    // Sin aplicar la tasa, 100 USD sumarían como 100 COP.
    const result = summarize([
      transaction({
        kind: 'EXPENSE',
        amount: 100,
        currency: 'USD',
        exchangeRate: 4000,
      }),
    ])

    expect(result.expense).toBe(400_000)
  })

  it('da balance negativo cuando se gasta de más', () => {
    const result = summarize([
      transaction({ kind: 'INCOME', amount: 100 }),
      transaction({ kind: 'EXPENSE', amount: 250 }),
    ])

    expect(result.balance).toBe(-150)
  })
})

describe('totalsByCategory', () => {
  it('ordena de mayor a menor y excluye ingresos', () => {
    const result = totalsByCategory([
      transaction({ categoryId: 'c1', categoryName: 'Comida', amount: 100 }),
      transaction({ categoryId: 'c2', categoryName: 'Transporte', amount: 300 }),
      transaction({ categoryId: 'c1', categoryName: 'Comida', amount: 150 }),
      // Un ingreso enorme no debe aparecer en el desglose de gasto.
      transaction({
        kind: 'INCOME',
        categoryId: 'c3',
        categoryName: 'Nómina',
        amount: 9_000,
      }),
    ])

    expect(result.map((entry) => entry.name)).toEqual(['Transporte', 'Comida'])
    expect(result[0]?.total).toBe(300)
    expect(result[1]?.total).toBe(250)
  })

  it('agrupa los movimientos sin categoría en vez de descartarlos', () => {
    const result = totalsByCategory([
      transaction({ categoryId: null, amount: 50 }),
      transaction({ categoryId: null, amount: 70 }),
    ])

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe('Sin categoría')
    expect(result[0]?.total).toBe(120)
  })
})

describe('monthlySeries', () => {
  it('agrupa por mes en orden cronológico', () => {
    const result = monthlySeries([
      transaction({ occurredOn: '2026-07-15', amount: 100 }),
      transaction({ occurredOn: '2026-05-02', amount: 200 }),
      transaction({ occurredOn: '2026-07-20', kind: 'INCOME', amount: 500 }),
    ])

    expect(result.map((point) => point.period)).toEqual(['2026-05', '2026-07'])
    expect(result[1]).toEqual({ period: '2026-07', income: 500, expense: 100 })
  })

  it('no inventa meses vacíos entre dos con datos', () => {
    // Junio no aparece: no hay dato, y un cero diría "no gastaste nada".
    const result = monthlySeries([
      transaction({ occurredOn: '2026-05-02' }),
      transaction({ occurredOn: '2026-07-15' }),
    ])

    expect(result.map((point) => point.period)).toEqual(['2026-05', '2026-07'])
  })
})
