import type { CategoryBudgetsQuery } from '@/graphql/generated/graphql'

export type CategoryBudget = CategoryBudgetsQuery['categoryBudgets'][number]

/** A partir de este porcentaje el presupuesto se marca como "cerca del tope". */
export const NEAR_LIMIT_PERCENTAGE = 80

export type BudgetLevel = 'ok' | 'near' | 'exceeded'

/**
 * Estado del presupuesto. `exceeded` lo decide el backend (`spent > amount`),
 * así que el 100 % justo todavía cuenta como "cerca", no como excedido.
 */
export function budgetLevel(
  budget: Pick<CategoryBudget, 'exceeded' | 'percentage'>,
): BudgetLevel {
  if (budget.exceeded) return 'exceeded'
  if (budget.percentage >= NEAR_LIMIT_PERCENTAGE) return 'near'
  return 'ok'
}

/** Ancho de la barra (0–1). Excedido se queda lleno: el texto da la cifra real. */
export function budgetRatio(percentage: number): number {
  if (!Number.isFinite(percentage) || percentage <= 0) return 0
  return Math.min(percentage / 100, 1)
}

export function formatPercentage(percentage: number, locale = 'es-CO'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(percentage / 100)
}

/** `YYYY-MM` → "noviembre de 2026". Sin pasar por la zona horaria local. */
export function formatMonth(period: string, locale = 'es-CO'): string {
  const [year, month] = period.split('-').map(Number)
  if (!year || !month) return period
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

/** Los más apretados primero: excedidos, luego por porcentaje descendente. */
export function sortByUrgency<T extends Pick<CategoryBudget, 'percentage'>>(
  budgets: readonly T[],
): T[] {
  return [...budgets].sort((a, b) => b.percentage - a.percentage)
}
