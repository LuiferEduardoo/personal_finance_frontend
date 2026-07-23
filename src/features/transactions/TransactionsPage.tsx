import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useCategories } from '@/features/categories/useCategories'
import { evictMovements } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { endOfMonth, startOfMonth, todayIso } from '@/lib/dates'
import { TransactionForm } from './TransactionForm'
import { TransactionList } from './TransactionList'
import { RemoveExpenseMutation, RemoveIncomeMutation } from './transactions.queries'
import type { Transaction } from './types'
import { useTransactions, type TransactionsScope } from './useTransactions'

const SCOPES: { value: TransactionsScope; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'EXPENSE', label: 'Gastos' },
  { value: 'INCOME', label: 'Ingresos' },
]

export function TransactionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { confirm, dialog } = useConfirm()

  const [scope, setScope] = useState<TransactionsScope>('ALL')
  const [from, setFrom] = useState(() => startOfMonth(todayIso()))
  const [to, setTo] = useState(() => endOfMonth(todayIso()))
  const [categoryId, setCategoryId] = useState('')

  // Los botones/FAB globales navegan a estas rutas para abrir el formulario:
  // `/movimientos/nuevo` (gasto) y `/movimientos/nuevo-ingreso` (ingreso).
  const createFromRoute: Transaction['kind'] | null =
    location.pathname === '/movimientos/nuevo'
      ? 'EXPENSE'
      : location.pathname === '/movimientos/nuevo-ingreso'
        ? 'INCOME'
        : null
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [creatingKind, setCreatingKind] = useState<Transaction['kind'] | null>(
    createFromRoute,
  )
  const [removeError, setRemoveError] = useState<string | null>(null)

  // /movimientos y sus rutas hijas renderizan el MISMO componente, así que al
  // navegar entre ellas React no lo remonta y el initializer de useState no
  // vuelve a correr. Sincronizar la apertura con la ruta por efecto es lo que
  // hace que los botones globales abran el modal estando ya en la lista.
  useEffect(() => {
    if (createFromRoute) setCreatingKind(createFromRoute)
  }, [createFromRoute])

  const { tree } = useCategories()
  const { transactions, loading, error } = useTransactions(scope, {
    from,
    to,
    categoryId: categoryId || undefined,
  })

  // Eviction (ver src/graphql/cache.ts): el borrado desaparece de todas las
  // páginas, no solo de la lista activa.
  const [removeExpense] = useMutation(RemoveExpenseMutation, { update: evictMovements })
  const [removeIncome] = useMutation(RemoveIncomeMutation, { update: evictMovements })

  const closeForm = () => {
    setEditing(null)
    setCreatingKind(null)
    if (createFromRoute) void navigate('/movimientos', { replace: true })
  }

  const handleRemove = async (transaction: Transaction) => {
    // Borrar es irreversible: se confirma siempre.
    const confirmed = await confirm({
      title: `¿Eliminar "${transaction.description}"?`,
    })
    if (!confirmed) return

    setRemoveError(null)
    try {
      if (transaction.kind === 'INCOME') {
        await removeIncome({ variables: { id: transaction.id } })
      } else {
        await removeExpense({ variables: { id: transaction.id } })
      }
    } catch (caught) {
      setRemoveError(getFirstErrorMessage(caught))
    }
  }

  const isFormOpen = editing !== null || creatingKind !== null
  const formKind = editing?.kind ?? creatingKind ?? 'EXPENSE'

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Movimientos</h1>

      <Filters
        scope={scope}
        onScopeChange={setScope}
        from={from}
        onFromChange={setFrom}
        to={to}
        onToChange={setTo}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={tree}
      />

      {removeError && (
        <div className="mt-4">
          <ErrorState message={removeError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingRows rows={4} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="Sin movimientos en este periodo"
            description="Cambia las fechas o registra el primero."
            action={
              <Button onClick={() => setCreatingKind('EXPENSE')}>
                Registrar gasto
              </Button>
            }
          />
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={setEditing}
            onRemove={(transaction) => void handleRemove(transaction)}
          />
        )}
      </div>

      <Sheet
        isOpen={isFormOpen}
        onClose={closeForm}
        title={
          editing
            ? 'Editar movimiento'
            : formKind === 'INCOME'
              ? 'Registrar ingreso'
              : 'Registrar gasto'
        }
      >
        {/* La key remonta el formulario al cambiar de movimiento, para que
            react-hook-form recoja los defaultValues nuevos. */}
        {isFormOpen && (
          <TransactionForm
            key={editing?.id ?? `nuevo-${formKind}`}
            kind={formKind}
            transaction={editing ?? undefined}
            onDone={closeForm}
          />
        )}
      </Sheet>

      {dialog}
    </div>
  )
}

type FiltersProps = {
  scope: TransactionsScope
  onScopeChange: (scope: TransactionsScope) => void
  from: string
  onFromChange: (value: string) => void
  to: string
  onToChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  categories: {
    category: { id: string; name: string; icon?: string | null }
    depth: number
  }[]
}

function Filters({
  scope,
  onScopeChange,
  from,
  onFromChange,
  to,
  onToChange,
  categoryId,
  onCategoryChange,
  categories,
}: FiltersProps) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {/* Los tres ámbitos como grupo de botones: en móvil un <select> para tres
          opciones cuesta un toque de más. */}
      <div
        role="group"
        aria-label="Tipo de movimiento"
        className="border-border bg-surface-sunken flex gap-1 rounded-lg border p-1"
      >
        {SCOPES.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={scope === option.value}
            onClick={() => onScopeChange(option.value)}
            className={`min-h-10 flex-1 rounded-md text-sm font-medium ${
              scope === option.value
                ? 'bg-surface-raised text-ink shadow-sm'
                : 'text-ink-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <label className="text-ink-secondary text-sm">
          Desde
          <input
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
            className="border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
          />
        </label>
        <label className="text-ink-secondary text-sm">
          Hasta
          <input
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
            className="border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
          />
        </label>
        <label className="text-ink-secondary col-span-2 text-sm sm:col-span-1">
          Categoría
          <select
            value={categoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
          >
            <option value="">Todas</option>
            {categories.map(({ category, depth }) => (
              <option key={category.id} value={category.id}>
                {depth > 0 ? '  ' : ''}
                {category.icon ? `${category.icon} ` : ''}
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
