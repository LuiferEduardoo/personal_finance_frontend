import { describe, expect, it } from 'vitest'
import { fxRateFromTrm, supportsTrm, trmFactor, trmFromFxRate } from './trm'

describe('trmFactor', () => {
  it('convierte USD a COP con la TRM más reciente', () => {
    expect(1_000 * trmFactor('USD', 'COP', 3_192.92)).toBe(3_192_920)
  })

  it('convierte COP a USD con la inversa de la TRM', () => {
    expect(3_192_920 * trmFactor('COP', 'USD', 3_192.92)).toBeCloseTo(1_000)
  })
})

describe('TRM y tasa a moneda base', () => {
  it('un depósito en COP con base USD viaja como 1/TRM', () => {
    expect(fxRateFromTrm(4_000, 'COP', 'USD')).toBeCloseTo(0.00025, 10)
    // 4.000.000 COP a 4.000 son 1.000 USD.
    expect(4_000_000 * fxRateFromTrm(4_000, 'COP', 'USD')!).toBeCloseTo(1_000)
  })

  it('un depósito en USD con base COP viaja como la TRM tal cual', () => {
    expect(fxRateFromTrm(4_000, 'USD', 'COP')).toBe(4_000)
  })

  it('no pide TRM cuando la operación ya está en la moneda base', () => {
    expect(fxRateFromTrm(4_000, 'COP', 'COP')).toBe(1)
    expect(trmFromFxRate(1, 'COP', 'COP')).toBeNull()
  })

  it('descarta pares que la TRM no cubre y valores no positivos', () => {
    expect(supportsTrm('EUR', 'USD')).toBe(false)
    expect(fxRateFromTrm(4_000, 'EUR', 'USD')).toBeNull()
    expect(fxRateFromTrm(0, 'COP', 'USD')).toBeNull()
    expect(fxRateFromTrm(-5, 'COP', 'USD')).toBeNull()
    expect(trmFromFxRate(0, 'COP', 'USD')).toBeNull()
    expect(trmFromFxRate(null, 'COP', 'USD')).toBeNull()
  })

  it('reabre una operación guardada devolviendo la TRM original', () => {
    const rate = fxRateFromTrm(4_150.25, 'COP', 'USD')!
    expect(trmFromFxRate(rate, 'COP', 'USD')).toBeCloseTo(4_150.25, 6)
    expect(trmFromFxRate(4_150.25, 'USD', 'COP')).toBe(4_150.25)
  })
})

describe('reabrir un depósito guardado', () => {
  it('devuelve la TRM sin ruido de coma flotante', () => {
    // 1/(1/3000.5) da 3000.4999999999995 sin redondeo.
    expect(trmFromFxRate(1 / 3_000.5, 'COP', 'USD')).toBe(3_000.5)
    expect(trmFromFxRate(1 / 3_000.25, 'COP', 'USD')).toBe(3_000.25)
    expect(trmFromFxRate(1 / 4_150.25, 'COP', 'USD')).toBe(4_150.25)
  })

  it('sobrevive al ciclo editar y guardar sin mover el importe', () => {
    const original = fxRateFromTrm(3_000.5, 'COP', 'USD')!
    const reopened = trmFromFxRate(original, 'COP', 'USD')!
    const resaved = fxRateFromTrm(reopened, 'COP', 'USD')!
    expect(4_000_000 * resaved).toBeCloseTo(4_000_000 * original, 9)
  })
})
