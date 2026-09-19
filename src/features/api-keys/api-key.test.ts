import { describe, expect, it } from 'vitest'
import {
  allowedScopes,
  expirationInputValue,
  expirationPayload,
  formatDateTime,
  scopeLabel,
  toggleScope,
} from './api-key'

describe('toggleScope', () => {
  it('activa y desactiva permisos individuales', () => {
    expect(toggleScope([], 'INVESTMENTS_READ')).toEqual(['INVESTMENTS_READ'])
    expect(toggleScope(['INVESTMENTS_READ'], 'INVESTMENTS_READ')).toEqual([])
  })

  it('conserva permisos de finanzas e inversiones y descarta acceso total', () => {
    expect(allowedScopes(['EXPENSES_READ', 'MARKET_DATA_READ'])).toEqual([
      'EXPENSES_READ',
      'MARKET_DATA_READ',
    ])
    expect(allowedScopes(['ALL'])).toEqual([])
  })
})

describe('API key presentation', () => {
  it('traduce scopes y fechas de expiración', () => {
    expect(scopeLabel('INVESTMENTS_WRITE')).toBe(
      'Gestionar operaciones e importaciones',
    )
    expect(expirationInputValue('2026-12-31T23:59:59.999Z')).toBe('2026-12-31')
    expect(expirationPayload('2026-12-31')).toBe('2026-12-31T23:59:59.999Z')
    expect(expirationPayload('')).toBeNull()
  })

  it('tolera fechas vacías o inválidas', () => {
    expect(formatDateTime(null)).toBe('Nunca')
    expect(formatDateTime('sin-fecha')).toBe('sin-fecha')
  })
})
