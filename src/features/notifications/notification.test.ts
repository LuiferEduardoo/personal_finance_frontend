import { describe, expect, it } from 'vitest'
import {
  bellLabel,
  notificationSeverity,
  relativeTime,
  unreadBadgeText,
} from './notification'

describe('unreadBadgeText', () => {
  it('oculta el badge en 0 y lo tope en 99+', () => {
    expect(unreadBadgeText(0)).toBeNull()
    expect(unreadBadgeText(-1)).toBeNull()
    expect(unreadBadgeText(3)).toBe('3')
    expect(unreadBadgeText(99)).toBe('99')
    expect(unreadBadgeText(100)).toBe('99+')
  })

  it('incluye el conteo en el nombre accesible', () => {
    expect(bellLabel(0)).toBe('Notificaciones')
    expect(bellLabel(3)).toBe('Notificaciones, 3 sin leer')
  })
})

describe('notificationSeverity', () => {
  it('agrupa los tipos por severidad', () => {
    expect(notificationSeverity('BUDGET_EXCEEDED')).toBe('danger')
    expect(notificationSeverity('LOAN_INSTALLMENT_OVERDUE')).toBe('danger')
    expect(notificationSeverity('MAIL_MESSAGE_FAILED')).toBe('danger')
    expect(notificationSeverity('BUDGET_NEAR')).toBe('warning')
    expect(notificationSeverity('LOAN_INSTALLMENT_DUE')).toBe('warning')
    expect(notificationSeverity('RECURRING_EXPENSES_GENERATED')).toBe('info')
  })
})

describe('relativeTime', () => {
  // Hora local, no UTC: "ayer" depende del día de calendario del usuario.
  const now = new Date(2026, 10, 24, 15, 0, 0)
  const at = (...parts: [number, number, number, number, number]) =>
    new Date(...parts).toISOString()

  it('usa minutos y horas dentro del mismo día', () => {
    expect(relativeTime(new Date(2026, 10, 24, 14, 59, 30).toISOString(), now)).toBe(
      'ahora',
    )
    expect(relativeTime(at(2026, 10, 24, 14, 59), now)).toBe('hace 1 min')
    expect(relativeTime(at(2026, 10, 24, 14, 55), now)).toBe('hace 5 min')
    expect(relativeTime(at(2026, 10, 24, 12, 0), now)).toBe('hace 3 h')
  })

  it('dice "ayer" por día de calendario y luego la fecha', () => {
    expect(relativeTime(at(2026, 10, 23, 8, 0), now)).toBe('ayer')
    expect(relativeTime(at(2026, 10, 20, 8, 0), now)).toMatch(/20.*nov/)
    expect(relativeTime(at(2025, 10, 20, 8, 0), now)).toMatch(/2025/)
  })

  it('tolera fechas futuras e inválidas', () => {
    expect(relativeTime(at(2026, 10, 24, 15, 5), now)).toBe('ahora')
    expect(relativeTime('sin-fecha', now)).toBe('sin-fecha')
  })
})
