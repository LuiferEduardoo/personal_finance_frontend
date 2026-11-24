import type {
  NotificationFieldsFragment,
  NotificationType,
} from '@/graphql/generated/graphql'

export type AppNotification = NotificationFieldsFragment

/** Tamaño de página de la lista (el backend admite hasta 100). */
export const NOTIFICATIONS_PAGE_SIZE = 20

/** Sondeo del contador del badge. */
export const UNREAD_COUNT_POLL_MS = 60_000

export type NotificationSeverity = 'danger' | 'warning' | 'info'

const SEVERITY_BY_TYPE: Record<NotificationType, NotificationSeverity> = {
  BUDGET_EXCEEDED: 'danger',
  LOAN_INSTALLMENT_OVERDUE: 'danger',
  MAIL_MESSAGE_FAILED: 'danger',
  BUDGET_NEAR: 'warning',
  LOAN_INSTALLMENT_DUE: 'warning',
  RECURRING_EXPENSES_GENERATED: 'info',
}

export function notificationSeverity(type: NotificationType): NotificationSeverity {
  return SEVERITY_BY_TYPE[type]
}

/** Texto para lectores de pantalla: el color nunca va solo. */
export const SEVERITY_LABELS: Record<NotificationSeverity, string> = {
  danger: 'Importante',
  warning: 'Aviso',
  info: 'Información',
}

/** Clases de color por severidad (roles del tema, nunca hex). */
export const SEVERITY_CLASSES: Record<NotificationSeverity, string> = {
  danger: 'text-expense bg-expense/10',
  warning: 'text-warning bg-warning/10',
  info: 'text-neutral bg-neutral/10',
}

/** Texto del badge: nada con 0, "99+" por encima de 99. */
export function unreadBadgeText(count: number): string | null {
  if (count <= 0) return null
  return count > 99 ? '99+' : String(count)
}

/** Nombre accesible de la campana, con el conteo. */
export function bellLabel(count: number): string {
  return count > 0 ? `Notificaciones, ${count} sin leer` : 'Notificaciones'
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

/**
 * Tiempo relativo de un `DateTime` ISO: "ahora", "hace 5 min", "hace 3 h"
 * (mismo día), "ayer" y, más atrás, la fecha. Una fecha futura (reloj
 * desfasado) cuenta como "ahora".
 */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const diff = now.getTime() - date.getTime()
  if (diff < MINUTE) return 'ahora'
  if (diff < HOUR) return `hace ${Math.floor(diff / MINUTE)} min`

  const today = startOfLocalDay(now)
  const day = startOfLocalDay(date)
  if (day === today) return `hace ${Math.floor(diff / HOUR)} h`
  // "Ayer" es el día de calendario anterior, no "hace 24-48 h".
  const yesterday = startOfLocalDay(new Date(today - 1))
  if (day === yesterday) return 'ayer'

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    ...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
  }).format(date)
}
