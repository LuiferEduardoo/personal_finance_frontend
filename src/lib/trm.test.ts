import { describe, expect, it } from 'vitest'
import { trmFactor } from './trm'

describe('trmFactor', () => {
  it('convierte USD a COP con la TRM más reciente', () => {
    expect(1_000 * trmFactor('USD', 'COP', 3_192.92)).toBe(3_192_920)
  })

  it('convierte COP a USD con la inversa de la TRM', () => {
    expect(3_192_920 * trmFactor('COP', 'USD', 3_192.92)).toBeCloseTo(1_000)
  })
})
