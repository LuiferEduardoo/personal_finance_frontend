/**
 * Fechas del dominio.
 *
 * El backend usa strings `YYYY-MM-DD` para movimientos y `YYYY-MM` para
 * periodos de inflación. NO se convierten a `Date`: construir un Date desde
 * "2026-07-15" lo interpreta como UTC medianoche, y al formatearlo en una zona
 * horaria al oeste de Greenwich sale el día 14. Un gasto no debe cambiar de día
 * por vivir en Bogotá.
 */

/** Fecha de hoy en formato `YYYY-MM-DD`, según la zona horaria local. */
export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Primer día del mes de una fecha `YYYY-MM-DD`. */
export function startOfMonth(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`
}

/** Último día del mes de una fecha `YYYY-MM-DD`. */
export function endOfMonth(isoDate: string): string {
  const [year, month] = isoDate.split('-').map(Number)
  if (!year || !month) return isoDate
  // Día 0 del mes siguiente = último día de este mes, con bisiestos resueltos.
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return `${isoDate.slice(0, 7)}-${String(last).padStart(2, '0')}`
}

/** Resta meses a un `YYYY-MM-DD` conservando el día 1. */
export function subtractMonths(isoDate: string, months: number): string {
  const [year, month] = isoDate.split('-').map(Number)
  if (!year || !month) return isoDate
  const date = new Date(Date.UTC(year, month - 1 - months, 1))
  const newMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${date.getUTCFullYear()}-${newMonth}-01`
}

/** `YYYY-MM-DD` → `YYYY-MM`, el formato que pide el filtro de inflación. */
export function toPeriod(isoDate: string): string {
  return isoDate.slice(0, 7)
}

const LOCALE = 'es-CO'

/** Formatea una fecha del backend para mostrarla, sin pasar por Date. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  // Se construye en UTC y se formatea en UTC: el string entra y sale igual.
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** Formatea un periodo `YYYY-MM` como "jul 2026". */
export function formatPeriod(period: string): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

/** Formatea un periodo `YYYY-MM` en corto ("jul"), para ejes de gráficos. */
export function formatPeriodShort(period: string): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}
