import { describe, expect, it } from 'vitest'
import { directionOf, expenseToTransaction, incomeToTransaction } from './types'
import type { Expense, Income } from './types'

const baseExpense = {
  __typename: 'Expense',
  id: 'e1',
  description: 'Mercado',
  amount: 185000,
  currency: 'COP',
  exchangeRate: 1,
  occurredOn: '2026-07-15',
  merchant: 'Éxito',
  notes: null,
  recurrence: 'ONCE',
  categoryId: 'c1',
  category: { __typename: 'Category', id: 'c1', name: 'Alimentación', icon: '🍽️' },
} as unknown as Expense

const baseIncome = {
  __typename: 'Income',
  id: 'i1',
  description: 'Nómina',
  amount: 4500000,
  currency: 'COP',
  exchangeRate: 1,
  occurredOn: '2026-07-01',
  source: 'Empresa XYZ',
  notes: null,
  recurrence: 'MONTHLY',
  categoryId: null,
  category: null,
} as unknown as Income

describe('conversión a Transaction', () => {
  it('mapea merchant y source al mismo campo', () => {
    // Los dos responden a "con quién fue el movimiento", así que la lista los
    // muestra en la misma columna.
    expect(expenseToTransaction(baseExpense).counterparty).toBe('Éxito')
    expect(incomeToTransaction(baseIncome).counterparty).toBe('Empresa XYZ')
  })

  it('conserva el tipo de origen', () => {
    // El signo NO se infiere del importe: el backend guarda ambos positivos.
    expect(expenseToTransaction(baseExpense).kind).toBe('EXPENSE')
    expect(incomeToTransaction(baseIncome).kind).toBe('INCOME')
    expect(expenseToTransaction(baseExpense).amount).toBeGreaterThan(0)
    expect(incomeToTransaction(baseIncome).amount).toBeGreaterThan(0)
  })

  it('traduce el tipo a dirección de dinero', () => {
    expect(directionOf('INCOME')).toBe('in')
    expect(directionOf('EXPENSE')).toBe('out')
  })

  it('normaliza la categoría ausente a null', () => {
    const transaction = incomeToTransaction(baseIncome)
    expect(transaction.categoryName).toBeNull()
    expect(transaction.categoryIcon).toBeNull()
  })
})
