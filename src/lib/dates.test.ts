import { describe, expect, it } from 'vitest'
import { endOfMonth, formatDate, startOfMonth, subtractMonths, toPeriod } from './dates'

describe('fechas del dominio', () => {
  it('no desplaza el día al formatear', () => {
    // La trampa clásica: new Date('2026-07-15') es UTC medianoche, y en Bogotá
    // (UTC-5) se formatearía como 14 de julio.
    expect(formatDate('2026-07-15')).toContain('15')
    expect(formatDate('2026-01-01')).toContain('1')
    expect(formatDate('2026-12-31')).toContain('31')
  })

  it('calcula el último día del mes, incluidos los bisiestos', () => {
    expect(endOfMonth('2026-07-15')).toBe('2026-07-31')
    expect(endOfMonth('2026-02-10')).toBe('2026-02-28')
    expect(endOfMonth('2028-02-10')).toBe('2028-02-29')
    expect(endOfMonth('2026-04-05')).toBe('2026-04-30')
  })

  it('resta meses cruzando el cambio de año', () => {
    expect(subtractMonths('2026-07-15', 1)).toBe('2026-06-01')
    expect(subtractMonths('2026-01-15', 1)).toBe('2025-12-01')
    expect(subtractMonths('2026-01-15', 13)).toBe('2024-12-01')
  })

  it('convierte a periodo e inicio de mes', () => {
    expect(startOfMonth('2026-07-15')).toBe('2026-07-01')
    expect(toPeriod('2026-07-15')).toBe('2026-07')
  })
})
