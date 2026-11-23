import { Money } from '@/components/Money'
import { formatAmount } from '@/lib/money'
import {
  budgetLevel,
  budgetRatio,
  formatPercentage,
  type CategoryBudget,
} from './budget'

const BAR_CLASSES = {
  ok: 'bg-neutral',
  near: 'bg-warning',
  exceeded: 'bg-expense',
} as const

/**
 * Barra gastado / tope de un presupuesto, con el patrón de `CreditGauge`.
 *
 * El color solo refuerza: el estado va siempre en texto (y con icono cuando
 * está cerca del tope o excedido), y las cifras se leen sin mirar la barra.
 * El tope y lo que queda no son movimientos, así que van con `formatAmount`;
 * lo gastado y el exceso sí son dinero que salió y llevan `<Money>`.
 */
export function BudgetProgress({ budget }: { budget: CategoryBudget }) {
  const level = budgetLevel(budget)
  const ratio = budgetRatio(budget.percentage)
  const percentage = formatPercentage(budget.percentage)

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-ink-secondary text-sm">
          <Money
            amount={budget.spent}
            currency={budget.currency}
            direction="out"
            size="sm"
          />{' '}
          de{' '}
          <span className="tabular">
            {formatAmount(budget.amount, budget.currency)}
          </span>
        </p>
        <span className="tabular text-ink-secondary text-sm">{percentage}</span>
      </div>

      <div
        role="progressbar"
        aria-label={`Gastado ${percentage} del presupuesto`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(Math.min(budget.percentage, 100))}
        aria-valuetext={percentage}
        className="bg-surface-sunken mt-2 h-2 overflow-hidden rounded-full"
      >
        <div
          className={`h-full rounded-full ${BAR_CLASSES[level]}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      <p className="mt-1.5 flex items-center gap-1.5 text-xs">
        {level === 'exceeded' ? (
          <>
            <AlertIcon className="text-expense" />
            <span className="text-ink font-medium">Excedido por</span>
            <Money
              amount={-budget.remaining}
              currency={budget.currency}
              direction="out"
              size="sm"
              className="text-xs"
            />
          </>
        ) : (
          <>
            {level === 'near' && <AlertIcon className="text-warning" />}
            <span
              className={level === 'near' ? 'text-ink font-medium' : 'text-ink-muted'}
            >
              {level === 'near' ? 'Cerca del tope · quedan ' : 'Quedan '}
              <span className="tabular">
                {formatAmount(budget.remaining, budget.currency)}
              </span>
            </span>
          </>
        )}
      </p>
    </div>
  )
}

function AlertIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-4 shrink-0 ${className}`}
    >
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4m0 3h.01" />
    </svg>
  )
}
