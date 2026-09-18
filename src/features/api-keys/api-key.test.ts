import { describe, expect, it } from 'vitest'
import {
  expirationInputValue,
  expirationPayload,
  formatDateTime,
  scopeLabel,
  toggleScope,
} from './api-key'

describe('toggleScope', () => {
  it('hace ALL exclusivo', () => {
    expect(toggleScope(['EXPENSES_READ'], 'ALL')).toEqual(['ALL'])
    expect(toggleScope(['ALL'], 'EXPENSES_READ')).toEqual(['EXPENSES_READ'])
  })

  it('activa y desactiva permisos individuales', () => {
    expect(toggleScope([], 'EXPENSES_READ')).toEqual(['EXPENSES_READ'])
    expect(toggleScope(['EXPENSES_READ'], 'EXPENSES_READ')).toEqual([])
  })
})

describe('API key presentation', () => {
  it('traduce scopes y fechas de expiración', () => {
    expect(scopeLabel('INVOICES_WRITE')).toBe('Procesar facturas')
    expect(expirationInputValue('2026-12-31T23:59:59.999Z')).toBe('2026-12-31')
    expect(expirationPayload('2026-12-31')).toBe('2026-12-31T23:59:59.999Z')
    expect(expirationPayload('')).toBeNull()
  })

  it('tolera fechas vacías o inválidas', () => {
    expect(formatDateTime(null)).toBe('Nunca')
    expect(formatDateTime('sin-fecha')).toBe('sin-fecha')
  })
})
