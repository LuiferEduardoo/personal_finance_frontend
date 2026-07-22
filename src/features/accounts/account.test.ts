import { describe, expect, it } from 'vitest'
import { creditDebt, spendableAmount } from './account'

describe('creditDebt', () => {
  it('un balance negativo en crédito es deuda (cupo usado)', () => {
    expect(creditDebt({ type: 'CREDIT', balance: -350000 })).toBe(350000)
  })
  it('a favor o cero no hay deuda', () => {
    expect(creditDebt({ type: 'CREDIT', balance: 50000 })).toBe(0)
    expect(creditDebt({ type: 'CREDIT', balance: 0 })).toBe(0)
  })
})

describe('spendableAmount', () => {
  it('en crédito es el cupo disponible, no el balance', () => {
    // Deuda de 350k sobre un cupo de 1M → disponible 650k.
    expect(
      spendableAmount({ type: 'CREDIT', balance: -350000, availableCredit: 650000 }),
    ).toBe(650000)
  })
  it('en activo es el balance', () => {
    expect(spendableAmount({ type: 'DEBIT', balance: 500000 })).toBe(500000)
  })
  it('crédito sin availableCredit se trata como 0', () => {
    expect(spendableAmount({ type: 'CREDIT', balance: 0, availableCredit: null })).toBe(
      0,
    )
  })
})
