import { describe, expect, it } from 'vitest'
import { dateRangeVariables, filterPointsByRange } from './date-range'

describe('rangos de evolución', () => {
  it('ancla el último año a la fecha real más reciente', () => {
    expect(dateRangeVariables('1A', '2025-06-15')).toEqual({
      from: '2024-06-15',
      to: '2025-06-15',
    })
  })

  it('muestra un día exacto y conserva todo en Max', () => {
    expect(dateRangeVariables('1D', '2025-06-15')).toEqual({
      from: '2025-06-15',
      to: '2025-06-15',
    })
    expect(dateRangeVariables('MAX', '2025-06-15')).toEqual({
      from: undefined,
      to: undefined,
    })
  })

  it('filtra inclusivamente sin alterar el orden', () => {
    const points = [{ date: '2024-01-01' }, { date: '2025-01-01' }]
    expect(filterPointsByRange(points, '2025-01-01')).toEqual([points[1]])
  })
})
