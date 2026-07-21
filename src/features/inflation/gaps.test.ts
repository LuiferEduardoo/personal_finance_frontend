import { describe, expect, it } from 'vitest'
import { findGaps, monthsBetween } from './gaps'

describe('monthsBetween', () => {
  it('cuenta meses consecutivos y a través del cambio de año', () => {
    expect(monthsBetween('2026-05', '2026-06')).toBe(1)
    expect(monthsBetween('2026-05', '2026-07')).toBe(2)
    expect(monthsBetween('2025-12', '2026-01')).toBe(1)
    expect(monthsBetween('2025-03', '2026-03')).toBe(12)
  })
})

describe('findGaps', () => {
  it('detecta el mes ausente de una serie con hueco', () => {
    // El caso real del backend: marzo, abril, mayo y julio, sin junio.
    expect(findGaps(['2026-03', '2026-04', '2026-05', '2026-07'])).toEqual(['2026-06'])
  })

  it('no reporta huecos en una serie continua', () => {
    expect(findGaps(['2026-03', '2026-04', '2026-05'])).toEqual([])
  })

  it('detecta varios meses seguidos ausentes', () => {
    expect(findGaps(['2026-01', '2026-05'])).toEqual(['2026-02', '2026-03', '2026-04'])
  })

  it('cruza el cambio de año', () => {
    expect(findGaps(['2025-11', '2026-02'])).toEqual(['2025-12', '2026-01'])
  })

  it('no falla con series de cero o un punto', () => {
    expect(findGaps([])).toEqual([])
    expect(findGaps(['2026-03'])).toEqual([])
  })
})
