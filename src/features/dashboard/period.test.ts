import { describe, expect, it } from 'vitest'
import { periodRange } from './period'

const today = '2026-11-23'

describe('periodRange', () => {
  it('este mes va del día 1 al último día del mes actual', () => {
    expect(periodRange({ mode: 'recent', months: 0 }, today)).toEqual({
      from: '2026-11-01',
      to: '2026-11-30',
    })
  })

  it('6 meses incluye el mes actual y los cinco anteriores', () => {
    expect(periodRange({ mode: 'recent', months: 5 }, today)).toEqual({
      from: '2026-06-01',
      to: '2026-11-30',
    })
  })

  it('un mes concreto cubre ese mes completo, con bisiestos', () => {
    expect(periodRange({ mode: 'month', month: '2024-02' }, today)).toEqual({
      from: '2024-02-01',
      to: '2024-02-29',
    })
  })

  it('un rango se respeta tal cual', () => {
    expect(
      periodRange({ mode: 'range', from: '2026-01-15', to: '2026-03-10' }, today),
    ).toEqual({ from: '2026-01-15', to: '2026-03-10' })
  })

  it('un rango invertido se ordena', () => {
    expect(
      periodRange({ mode: 'range', from: '2026-03-10', to: '2026-01-15' }, today),
    ).toEqual({ from: '2026-01-15', to: '2026-03-10' })
  })
})
