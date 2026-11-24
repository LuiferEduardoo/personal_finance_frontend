import { describe, expect, it } from 'vitest'
import {
  buildCreateLoanInput,
  canRemoveLoan,
  chargeValueForApi,
  fractionToPercent,
  loanProgress,
  maxRatePercent,
  percentToFraction,
} from './loan'

describe('percentToFraction / fractionToPercent', () => {
  it('convierte sin ruido de float', () => {
    expect(percentToFraction(24)).toBe(0.24)
    expect(percentToFraction(1.1)).toBe(0.011)
    expect(percentToFraction(0.1)).toBe(0.001)
    expect(fractionToPercent(0.025)).toBe(2.5)
    expect(fractionToPercent(0.0180875)).toBe(1.80875)
  })

  it('es reversible', () => {
    expect(fractionToPercent(percentToFraction(26.82))).toBe(26.82)
  })
})

describe('maxRatePercent', () => {
  it('EA admite hasta 1000 % y la mensual hasta 100 %', () => {
    expect(maxRatePercent('EFFECTIVE_ANNUAL')).toBe(1000)
    expect(maxRatePercent('MONTHLY')).toBe(100)
  })
})

describe('chargeValueForApi', () => {
  it('envía el valor fijo en dinero y el porcentual como fracción', () => {
    expect(chargeValueForApi('FIXED', 15_000)).toBe(15_000)
    expect(chargeValueForApi('PERCENT_OF_BALANCE', 0.1)).toBe(0.001)
  })
})

describe('loanProgress', () => {
  it('cuenta las pagadas sobre la tabla actual', () => {
    expect(
      loanProgress({
        installments: [{ status: 'PAID' }, { status: 'PAID' }, { status: 'PENDING' }],
      }),
    ).toEqual({ paid: 2, total: 3, ratio: 2 / 3 })
  })

  it('no divide entre cero sin cuotas', () => {
    expect(loanProgress({ installments: [] })).toEqual({ paid: 0, total: 0, ratio: 0 })
  })
})

describe('canRemoveLoan', () => {
  it('solo sin cuotas pagadas ni abonos', () => {
    expect(
      canRemoveLoan({ installments: [{ status: 'PENDING' }], prepayments: [] }),
    ).toBe(true)
    expect(canRemoveLoan({ installments: [{ status: 'PAID' }], prepayments: [] })).toBe(
      false,
    )
    expect(
      canRemoveLoan({ installments: [{ status: 'PENDING' }], prepayments: [{}] }),
    ).toBe(false)
  })
})

describe('buildCreateLoanInput', () => {
  it('pasa porcentajes a fracción y omite los opcionales vacíos', () => {
    expect(
      buildCreateLoanInput({
        name: '  Libre inversión ',
        lender: '',
        principalAmount: 10_000_000,
        currency: 'cop',
        rateType: 'EFFECTIVE_ANNUAL',
        ratePercent: 24,
        installmentCount: 36,
        disbursedOn: '2026-11-01',
        firstDueDate: '',
        disbursementAccountId: 'a1',
        paymentAccountId: '',
        categoryId: undefined,
        charges: [
          {
            name: 'Seguro de vida',
            kind: 'INSURANCE',
            mode: 'PERCENT_OF_BALANCE',
            value: 0.1,
          },
          { name: 'Cuota de manejo', kind: 'FEE', mode: 'FIXED', value: 12_000 },
        ],
      }),
    ).toEqual({
      name: 'Libre inversión',
      lender: undefined,
      principalAmount: 10_000_000,
      currency: 'COP',
      rateType: 'EFFECTIVE_ANNUAL',
      rate: 0.24,
      installmentCount: 36,
      disbursedOn: '2026-11-01',
      firstDueDate: undefined,
      disbursementAccountId: 'a1',
      paymentAccountId: undefined,
      categoryId: undefined,
      charges: [
        {
          name: 'Seguro de vida',
          kind: 'INSURANCE',
          mode: 'PERCENT_OF_BALANCE',
          value: 0.001,
        },
        { name: 'Cuota de manejo', kind: 'FEE', mode: 'FIXED', value: 12_000 },
      ],
    })
  })
})
