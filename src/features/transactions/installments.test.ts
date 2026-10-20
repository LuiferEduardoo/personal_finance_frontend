import { describe, expect, it } from 'vitest'
import { installmentPreview } from './installments'

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
