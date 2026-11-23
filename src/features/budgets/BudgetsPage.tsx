import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { evictBudgets } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { subtractMonths, todayIso, toPeriod } from '@/lib/dates'
import { BudgetForm } from './BudgetForm'
import { BudgetProgress } from './BudgetProgress'
import { budgetLevel, formatMonth, type CategoryBudget } from './budget'
import { CategoryBudgetsQuery, RemoveCategoryBudgetMutation } from './budgets.queries'

const inputClass =
  'border-border bg-surface-raised text-ink focus:border-ink min-h-11 w-full rounded-lg border px-3 text-base outline-none'

/** Suma (o resta, con negativos) meses a un `YYYY-MM`. */
function shiftMonth(period: string, months: number): string {
  return toPeriod(subtractMonths(`${period}-01`, -months))
}

export function BudgetsPage() {
  const { user } = useSession()
  const currentMonth = toPeriod(todayIso())
  const baseCurrency = user?.baseCurrency ?? 'COP'
  const [month, setMonth] = useState(currentMonth)
  const [editing, setEditing] = useState<CategoryBudget | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const { confirm, dialog } = useConfirm()

  const { data, loading, error, refetch } = useQuery(CategoryBudgetsQuery, {
    variables: { month },
  })
  const budgets = useMemo(() => data?.categoryBudgets ?? [], [data?.categoryBudgets])
  const budgetedCategoryIds = useMemo(
    () => new Set(budgets.map((budget) => budget.category.id)),
    [budgets],
  )
  const counts = useMemo(() => {
    let exceeded = 0
    let near = 0
    for (const budget of budgets) {
      const level = budgetLevel(budget)
      if (level === 'exceeded') exceeded += 1
      else if (level === 'near') near += 1
    }
    return { exceeded, near }
  }, [budgets])

  const [removeBudget] = useMutation(RemoveCategoryBudgetMutation, {
    update: evictBudgets,
  })

  const handleRemove = async (budget: CategoryBudget) => {
    if (
      !(await confirm({
        title: `¿Eliminar el presupuesto de "${budget.category.name}"?`,
        message: 'Se borra el tope de todos los meses. Tus gastos no cambian.',
      }))
    )
      return
    setActionError(null)
    try {
      await removeBudget({ variables: { categoryId: budget.category.id } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const isFormOpen = isCreating || editing !== null
  const closeForm = () => {
    setIsCreating(false)
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Presupuestos</h1>
        <Button onClick={() => setIsCreating(true)}>Nuevo</Button>
      </div>

      <p className="text-ink-secondary mt-2 text-sm">
        Un tope mensual por categoría de gasto (incluye sus subcategorías). Si lo
        superas, te avisamos por correo.
      </p>

      <div className="mt-4 flex items-end gap-2">
        <MonthStep
          label="Mes anterior"
          onClick={() => setMonth((value) => shiftMonth(value, -1))}
        >
          <path d="m15 6-6 6 6 6" />
        </MonthStep>
        <label className="text-ink-secondary flex-1 text-sm sm:max-w-56 sm:flex-none">
          Mes
          <input
            type="month"
            value={month}
            max={currentMonth}
            onChange={(event) =>
              // Borrar el campo lo deja vacío: se ignora para no pedir un mes inválido.
              event.target.value && setMonth(event.target.value)
            }
            className={`${inputClass} mt-1`}
          />
        </label>
        <MonthStep
          label="Mes siguiente"
          disabled={month >= currentMonth}
          onClick={() => setMonth((value) => shiftMonth(value, 1))}
        >
          <path d="m9 6 6 6-6 6" />
        </MonthStep>
      </div>

      {budgets.length > 0 && (
        <p className="text-ink-muted mt-3 text-sm">
          {capitalize(formatMonth(month))}
          {' · '}
          {counts.exceeded === 0 && counts.near === 0
            ? 'Todo dentro del presupuesto'
            : [
                counts.exceeded > 0 &&
                  `${counts.exceeded} excedido${counts.exceeded === 1 ? '' : 's'}`,
                counts.near > 0 && `${counts.near} cerca del tope`,
              ]
                .filter(Boolean)
                .join(' · ')}
        </p>
      )}

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-6">
        {loading && !data ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState
            message={getFirstErrorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : budgets.length === 0 ? (
          <EmptyState
            title="Sin presupuestos"
            description="Ponle un tope mensual a una categoría (mercado, restaurantes…) para ver cuánto te queda."
            action={
              <Button onClick={() => setIsCreating(true)}>Crear presupuesto</Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {budgets.map((budget) => (
              <li
                key={budget.id}
                className="border-border bg-surface-raised rounded-lg border p-3"
              >
                <p className="text-ink text-sm font-medium">
                  {budget.category.icon ? `${budget.category.icon} ` : ''}
                  {budget.category.name}
                </p>
                <div className="mt-2">
                  <BudgetProgress budget={budget} />
                </div>
                {budget.currency !== baseCurrency && (
                  <p className="text-ink-muted mt-1 text-xs">
                    El tope está en {budget.currency} y lo gastado se mide en{' '}
                    {baseCurrency}: edítalo para pasarlo a {baseCurrency}.
                  </p>
                )}
                <div className="mt-2 flex gap-1">
                  <RowAction onClick={() => setEditing(budget)}>Editar</RowAction>
                  <RowAction onClick={() => void handleRemove(budget)}>
                    Eliminar
                  </RowAction>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar presupuesto' : 'Nuevo presupuesto'}
      >
        {isFormOpen && (
          <BudgetForm
            key={editing?.id ?? 'nuevo'}
            budget={editing ?? undefined}
            budgetedCategoryIds={budgetedCategoryIds}
            currency={baseCurrency}
            onDone={closeForm}
          />
        )}
      </Sheet>

      {dialog}
    </div>
  )
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function MonthStep({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="border-border bg-surface-raised text-ink hover:bg-surface-sunken flex size-11 shrink-0 items-center justify-center rounded-lg border disabled:opacity-50"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-5"
      >
        {children}
      </svg>
    </button>
  )
}

function RowAction({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg px-3 text-sm"
    >
      {children}
    </button>
  )
}
