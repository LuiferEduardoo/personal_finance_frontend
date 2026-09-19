import { toBaseCurrency } from '@/lib/money'
import type { Transaction } from '@/features/transactions/types'

export type PeriodSummary = {
  income: number
  expense: number
  /** Ingresos menos gastos. Negativo significa que se gastó de más. */
  balance: number
}

/**
 * Totales del periodo, en moneda base.
 *
 * Todo pasa por `exchangeRate`: sumar `amount` a secas mezclaría pesos con
 * dólares y daría un total sin sentido.
 */
export function summarize(
  transactions: Transaction[],
  conversionFactor = 1,
): PeriodSummary {
  let income = 0
  let expense = 0

  for (const transaction of transactions) {
    const value =
      toBaseCurrency(transaction.amount, transaction.exchangeRate) * conversionFactor
    if (transaction.kind === 'INCOME') income += value
    else expense += value
  }

  return { income, expense, balance: income - expense }
}

export type CategoryTotal = {
  categoryId: string | null
  name: string
  total: number
}

/**
 * Gasto por categoría, de mayor a menor.
 *
 * Solo gastos: mezclar ingresos aquí daría un ranking donde la nómina aplasta
 * todo lo demás y el desglose deja de informar.
 */
export function totalsByCategory(
  transactions: Transaction[],
  conversionFactor = 1,
): CategoryTotal[] {
  const totals = new Map<string, CategoryTotal>()

  for (const transaction of transactions) {
    if (transaction.kind !== 'EXPENSE') continue

    // Los movimientos sin categoría se agrupan en vez de descartarse: si son
    // muchos, es justo lo que el usuario necesita ver.
    const key = transaction.categoryId ?? '__sin_categoria__'
    const existing = totals.get(key)
    const value =
      toBaseCurrency(transaction.amount, transaction.exchangeRate) * conversionFactor

    if (existing) {
      existing.total += value
    } else {
      totals.set(key, {
        categoryId: transaction.categoryId,
        name: transaction.categoryName ?? 'Sin categoría',
        total: value,
      })
    }
  }

  return [...totals.values()].sort((a, b) => b.total - a.total)
}

export type MonthlyPoint = {
  period: string
  income: number
  expense: number
}

/**
 * Serie mensual de ingresos y gastos.
 *
 * Los meses sin movimientos NO se rellenan con ceros: un cero dibujado dice
 * "ese mes no gastaste nada", que no es lo mismo que "no hay datos de ese mes".
 * Es la misma regla que aplica el backend en la serie de inflación.
 */
export function monthlySeries(
  transactions: Transaction[],
  conversionFactor = 1,
): MonthlyPoint[] {
  const months = new Map<string, MonthlyPoint>()

  for (const transaction of transactions) {
    const period = transaction.occurredOn.slice(0, 7)
    const point = months.get(period) ?? { period, income: 0, expense: 0 }
    const value =
      toBaseCurrency(transaction.amount, transaction.exchangeRate) * conversionFactor

    if (transaction.kind === 'INCOME') point.income += value
    else point.expense += value

    months.set(period, point)
  }

  // YYYY-MM ordena bien lexicográficamente.
  return [...months.values()].sort((a, b) => a.period.localeCompare(b.period))
}
