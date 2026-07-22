import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { Money } from '@/components/Money'
import { evictMovements, evictRecurring } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatDate } from '@/lib/dates'
import { RECURRENCE_LABELS } from './recurrence'
import { RecurringForm } from './RecurringForm'
import {
  RecurringExpensesQuery,
  RemoveRecurringExpenseMutation,
  RunDueRecurringExpensesMutation,
} from './recurring.queries'
import type { RecurringExpensesQuery as RecurringQueryType } from '@/graphql/generated/graphql'

type RecurringExpense = RecurringQueryType['recurringExpenses'][number]

export function RecurringPage() {
  const [editing, setEditing] = useState<RecurringExpense | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [runMessage, setRunMessage] = useState<string | null>(null)

  const { data, loading, error } = useQuery(RecurringExpensesQuery, {
    variables: { includeInactive: true },
  })
  const recurring = data?.recurringExpenses ?? []

  const [removeRecurring] = useMutation(RemoveRecurringExpenseMutation, {
    update: evictRecurring,
  })
  const [runDue, { loading: running }] = useMutation(RunDueRecurringExpensesMutation, {
    // Genera gastos reales que mueven saldos → invalidar movimientos, cuentas e
    // inflación (evictMovements) además de la propia lista de recurrentes.
    update: (cache) => {
      evictMovements(cache)
      evictRecurring(cache)
    },
  })

  const handleRemove = async (item: RecurringExpense) => {
    if (!window.confirm(`¿Eliminar "${item.description}"?`)) return
    setActionError(null)
    try {
      await removeRecurring({ variables: { id: item.id } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const handleRunDue = async () => {
    setActionError(null)
    setRunMessage(null)
    try {
      const { data: result } = await runDue()
      const count = result?.runDueRecurringExpenses ?? 0
      setRunMessage(
        count === 0
          ? 'No había recurrentes vencidos.'
          : `Se generaron ${count} gasto(s).`,
      )
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
        <h1 className="text-ink text-2xl font-semibold">Recurrentes</h1>
        <Button onClick={() => setIsCreating(true)}>Nuevo</Button>
      </div>

      <p className="text-ink-secondary mt-2 text-sm">
        Plantillas que generan gastos automáticamente. Normalmente lo hace un proceso
        diario; también puedes forzarlo.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Button
          variant="secondary"
          isLoading={running}
          onClick={() => void handleRunDue()}
        >
          Generar vencidos
        </Button>
        {runMessage && <span className="text-ink-secondary text-sm">{runMessage}</span>}
      </div>

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : recurring.length === 0 ? (
          <EmptyState
            title="Sin recurrentes"
            description="Crea una plantilla para un gasto que se repite (arriendo, suscripciones…)."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {recurring.map((item) => (
              <li
                key={item.id}
                className="border-border bg-surface-raised rounded-lg border p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-medium">
                      {item.description}
                      {!item.isActive && (
                        <span className="text-ink-muted font-normal"> · inactiva</span>
                      )}
                    </p>
                    <p className="text-ink-muted mt-0.5 text-xs">
                      {RECURRENCE_LABELS[item.recurrence]}
                      {item.nextRunOn && ` · próximo ${formatDate(item.nextRunOn)}`}
                    </p>
                  </div>
                  <Money
                    amount={item.amount ?? 0}
                    currency={item.currency}
                    direction="out"
                    size="sm"
                  />
                </div>
                <div className="mt-2 flex gap-1">
                  <RowAction onClick={() => setEditing(item)}>Editar</RowAction>
                  <RowAction onClick={() => void handleRemove(item)}>
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
        title={editing ? 'Editar recurrente' : 'Nuevo recurrente'}
      >
        {isFormOpen && (
          <RecurringForm
            key={editing?.id ?? 'nuevo'}
            recurring={editing ?? undefined}
            onDone={closeForm}
          />
        )}
      </Sheet>
    </div>
  )
}

function RowAction({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
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
