/**
 * Detección de huecos en la serie de inflación.
 *
 * El backend omite los meses sin gastos, así que la serie puede saltar de mayo
 * a julio. Dibujados a intervalos iguales, esos dos puntos parecen consecutivos
 * y el lector deduce mal la tendencia. Se detectan los huecos para poder
 * avisarlos en la interfaz.
 *
 * Ojo: el backend tampoco calcula la variación a través de un hueco. Julio,
 * después de un junio vacío, trae `monthlyRate: null` — no se compara contra
 * mayo. Verificado contra el backend.
 */

/** Número de meses entre dos periodos `YYYY-MM`. */
export function monthsBetween(from: string, to: string): number {
  const [fromYear, fromMonth] = from.split('-').map(Number)
  const [toYear, toMonth] = to.split('-').map(Number)
  if (!fromYear || !fromMonth || !toYear || !toMonth) return 0
  return (toYear - fromYear) * 12 + (toMonth - fromMonth)
}

/**
 * Periodos ausentes entre el primero y el último de la serie.
 * Devuelve lista vacía si la serie es continua.
 */
export function findGaps(periods: string[]): string[] {
  if (periods.length < 2) return []

  const gaps: string[] = []
  for (let index = 1; index < periods.length; index += 1) {
    const previous = periods[index - 1]
    const current = periods[index]
    if (!previous || !current) continue

    const distance = monthsBetween(previous, current)
    // Distancia 1 = meses consecutivos. Más, hay meses sin datos en medio.
    for (let offset = 1; offset < distance; offset += 1) {
      gaps.push(addMonths(previous, offset))
    }
  }
  return gaps
}

function addMonths(period: string, months: number): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  const date = new Date(Date.UTC(year, month - 1 + months, 1))
  const newMonth = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${date.getUTCFullYear()}-${newMonth}`
}
