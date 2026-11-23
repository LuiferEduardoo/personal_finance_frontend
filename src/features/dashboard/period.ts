import { endOfMonth, subtractMonths } from '@/lib/dates'

/**
 * Periodo del Inicio:
 *   - `recent`: los últimos N meses completos hasta el mes actual (0 = este mes);
 *   - `month`: un mes concreto (`YYYY-MM`);
 *   - `range`: de una fecha a otra (`YYYY-MM-DD`), ambas incluidas.
 */
export type DashboardPeriod =
  | { mode: 'recent'; months: number }
  | { mode: 'month'; month: string }
  | { mode: 'range'; from: string; to: string }

export type PeriodRange = { from: string; to: string }

/**
 * Traduce el periodo al filtro `from`/`to` del backend.
 *
 * Un rango con las fechas invertidas se ordena en vez de mandarse tal cual: el
 * backend devolvería una lista vacía y parecería que no hay movimientos.
 */
export function periodRange(period: DashboardPeriod, today: string): PeriodRange {
  switch (period.mode) {
    case 'recent':
      return { from: subtractMonths(today, period.months), to: endOfMonth(today) }
    case 'month':
      return { from: `${period.month}-01`, to: endOfMonth(`${period.month}-01`) }
    case 'range':
      return period.from <= period.to
        ? { from: period.from, to: period.to }
        : { from: period.to, to: period.from }
  }
}
