import { describe, expect, it } from 'vitest'
import {
  installmentEditCredit,
  installmentPreview,
  installmentPurchaseDefaults,
} from './installments'

describe('installmentPreview', () => {
  it('reparte sin perder centavos cuando no hay interés', () => {
    expect(installmentPreview(100, 3, 0)).toEqual({
      regularPayment: 33.33,
      totalAmount: 100,
      totalInterest: 0,
    })
  })

  it('calcula el mismo total financiado que el backend', () => {
    expect(installmentPreview(1_000, 3, 0.02)).toEqual({
      regularPayment: 346.75,
      totalAmount: 1_040.27,
      totalInterest: 40.27,
    })
  })
})

describe('installmentPurchaseDefaults', () => {
  it('parte del plan completo, no de la cuota', () => {
    expect(
      installmentPurchaseDefaults({
        planDescription: 'Televisor',
        planPrincipalAmount: 1_200_000,
        purchaseDate: '2026-07-10',
        installmentCount: 6,
        monthlyRate: 0.025,
      }),
    ).toEqual({
      description: 'Televisor',
      amount: 1_200_000,
      occurredOn: '2026-07-10',
      installmentCount: 6,
      monthlyInterestRatePercent: 2.5,
    })
  })
})

describe('installmentEditCredit', () => {
  it('devuelve el total actual al cupo si la cuenta no cambia', () => {
    expect(installmentEditCredit(500, true, 1_000)).toBe(1_500)
  })

  it('usa solo el cupo de la cuenta nueva si cambia', () => {
    expect(installmentEditCredit(500, false, 1_000)).toBe(500)
  })
})
