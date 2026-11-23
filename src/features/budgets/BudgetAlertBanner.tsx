import { useQuery } from '@apollo/client'
import { Link } from 'react-router'
import { todayIso, toPeriod } from '@/lib/dates'
import { budgetLevel } from './budget'
import { CategoryBudgetsQuery } from './budgets.queries'

/**
 * Aviso del Inicio: cuántos presupuestos del mes en curso están excedidos o
 * cerca del tope. Solo cuenta (sin cifras), así no choca con el periodo ni con
 * la moneda que se elijan en el dashboard. Sin nada que avisar, no se pinta.
 */
export function BudgetAlertBanner() {
  const { data } = useQuery(CategoryBudgetsQuery, {
    variables: { month: toPeriod(todayIso()) },
  })
  const budgets = data?.categoryBudgets ?? []
  const exceeded = budgets.filter((budget) => budgetLevel(budget) === 'exceeded').length
  const near = budgets.filter((budget) => budgetLevel(budget) === 'near').length
  if (exceeded === 0 && near === 0) return null

  const parts = [
    exceeded > 0 &&
      `${exceeded} presupuesto${exceeded === 1 ? '' : 's'} excedido${exceeded === 1 ? '' : 's'}`,
    near > 0 && `${near} cerca del tope`,
  ].filter(Boolean)

  return (
    <Link
      to="/presupuestos"
      className={`text-ink hover:bg-surface-sunken mt-4 flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        exceeded > 0
          ? 'border-expense/40 bg-expense/5'
          : 'border-warning/40 bg-warning/5'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`size-4 shrink-0 ${exceeded > 0 ? 'text-expense' : 'text-warning'}`}
      >
        <path d="M12 4 2.5 20h19z" />
        <path d="M12 10v4m0 3h.01" />
      </svg>
      <span className="flex-1">Este mes: {parts.join(' · ')}</span>
      <span className="text-ink-secondary underline">Ver</span>
    </Link>
  )
}
