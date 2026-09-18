import { type ApolloCache, useMutation } from '@apollo/client'
import { evictInventory, evictMovements } from '@/graphql/cache'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { isCreditAccount, spendableAmount } from '@/features/accounts/account'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { useAccounts } from '@/features/accounts/useAccounts'
import { useCategories } from '@/features/categories/useCategories'
import { getFirstErrorMessage } from '@/graphql/errors'
import { todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { ExpenseItemsEditor } from './ExpenseItemsEditor'
import {
  buildItemsInput,
  isRowComplete,
  itemsTotal,
  rowsFromItems,
  type ItemRow,
} from './items'
import {
  CreateExpenseMutation,
  CreateIncomeMutation,
  UpdateExpenseMutation,
  UpdateIncomeMutation,
} from './transactions.queries'
import type { Transaction } from './types'

/**
 * Reglas espejadas del backend: descripción y fecha obligatorias; y un gasto
 * necesita **importe O al menos un ítem** (`amount` no se envía cuando hay
 * ítems, el backend lo calcula como la suma de subtotales). El importe manual,
 * cuando aplica, debe ser > 0.
 */
const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z.number().positive('El importe debe ser mayor que 0').optional(),
  occurredOn: z.string().min(1, 'La fecha es obligatoria'),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
  counterparty: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type TransactionFormProps = {
  kind: Transaction['kind']
  /** Presente al editar; ausente al crear. */
  transaction?: Transaction
  onDone: () => void
}

export function TransactionForm({ kind, transaction, onDone }: TransactionFormProps) {
  const isIncome = kind === 'INCOME'
  const isEditing = transaction != null
  const [formError, setFormError] = useState<string | null>(null)

  // Los ítems (solo gastos) viven fuera de RHF: son un array de objetos con su
  // propia UI de selección de artículo.
  const [rows, setRows] = useState<ItemRow[]>(() =>
    isIncome ? [] : rowsFromItems(transaction?.items ?? []),
  )

  const { tree, loading: loadingCategories } = useCategories(kind)

  // Invalidación por eviction (ver src/graphql/cache.ts): así el movimiento nuevo
  // aparece también en páginas que no estaban montadas (dashboard, inflación), no
  // solo en la lista activa. `evictMovements` cubre listas, dashboard, inflación
  // y saldos de cuenta.
  const [createExpense] = useMutation(CreateExpenseMutation)
  const [createIncome] = useMutation(CreateIncomeMutation)
  const [updateExpense] = useMutation(UpdateExpenseMutation)
  const [updateIncome] = useMutation(UpdateIncomeMutation)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: transaction?.description ?? '',
      amount: transaction?.amount,
      occurredOn: transaction?.occurredOn ?? todayIso(),
      categoryId: transaction?.categoryId ?? '',
      accountId: transaction?.accountId ?? '',
      counterparty: transaction?.counterparty ?? '',
      notes: transaction?.notes ?? '',
    },
  })

  const hasItems = !isIncome && rows.length > 0
  const currency = transaction?.currency ?? 'COP'
  const computedAmount = itemsTotal(rows)

  // Cupo: si el gasto va a una tarjeta de crédito, se valida el importe contra
  // el cupo disponible antes de enviar (el backend también lo rechaza).
  const { accounts } = useAccounts()
  const selectedAccount =
    accounts.find((account) => account.id === watch('accountId')) ?? null
  const creditAvailable =
    !isIncome && selectedAccount && isCreditAccount(selectedAccount.type)
      ? spendableAmount(selectedAccount)
      : null
  const effectiveAmount = hasItems ? computedAmount : (watch('amount') ?? 0)

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const optional = (value: string | undefined) => value?.trim() || undefined

    // Validación cruzada que zod no cubre bien: importe manual O ítems.
    if ((isIncome || !hasItems) && values.amount == null) {
      setFormError('Introduce un importe o añade al menos un ítem.')
      return
    }
    if (!isIncome && hasItems && !rows.every(isRowComplete)) {
      setFormError('Cada ítem necesita un artículo y su precio unitario.')
      return
    }
    // Cupo de tarjeta: bloquear antes de enviar (el backend también lo rechaza).
    if (creditAvailable != null && effectiveAmount > creditAvailable) {
      setFormError(
        `Excede el cupo disponible (${formatAmount(creditAvailable, selectedAccount!.currency)}).`,
      )
      return
    }

    const commonBase = {
      description: values.description,
      occurredOn: values.occurredOn,
      categoryId: optional(values.categoryId),
      accountId: optional(values.accountId),
      notes: optional(values.notes),
    }

    try {
      if (isIncome) {
        // amount está garantizado por la validación de arriba.
        const input = {
          ...commonBase,
          amount: values.amount ?? 0,
          source: optional(values.counterparty),
        }
        const update = (cache: ApolloCache<unknown>) => evictMovements(cache)
        if (isEditing) {
          await updateIncome({
            variables: { input: { id: transaction.id, ...input } },
            update,
          })
        } else {
          await createIncome({ variables: { input }, update })
        }
        onDone()
        return
      }

      // Gasto: con ítems se envía `items` y NO `amount` (lo calcula el backend).
      const expenseInput = {
        ...commonBase,
        merchant: optional(values.counterparty),
        ...(hasItems ? { items: buildItemsInput(rows) } : { amount: values.amount }),
      }
      // Si algún ítem es de tipo producto, el inventario también cambió por debajo.
      const touchedProduct = rows.some(
        (row) => row.article.mode !== 'none' && row.article.type === 'PRODUCT',
      )
      const update = (cache: ApolloCache<unknown>) => {
        evictMovements(cache)
        if (touchedProduct) evictInventory(cache)
      }

      if (isEditing) {
        await updateExpense({
          variables: { input: { id: transaction.id, ...expenseInput } },
          update,
        })
      } else {
        await createExpense({
          variables: { input: expenseInput },
          update,
        })
      }
      onDone()
    } catch (error) {
      // BAD_REQUEST llega con el mensaje del backend ya en español.
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Descripción"
        placeholder={isIncome ? 'Pago nómina julio' : 'Mercado semana'}
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Con ítems el importe es la suma de subtotales, de solo lectura. */}
      {hasItems ? (
        <div>
          <span className="text-ink-secondary block text-sm font-medium">Importe</span>
          <p className="tabular text-ink mt-1.5 text-lg font-medium">
            {formatAmount(computedAmount, currency)}
          </p>
          <p className="text-ink-muted mt-0.5 text-xs">Suma de los ítems.</p>
        </div>
      ) : (
        <Field
          label="Importe"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          error={errors.amount?.message}
          {...register('amount', {
            setValueAs: (value: string) => (value === '' ? undefined : Number(value)),
          })}
        />
      )}

      <Field
        label="Fecha"
        type="date"
        error={errors.occurredOn?.message}
        {...register('occurredOn')}
      />

      <div>
        <AccountSelect
          value={watch('accountId') ?? ''}
          onChange={(accountId) => setValue('accountId', accountId)}
          label={isIncome ? 'Cuenta destino (opcional)' : 'Cuenta (opcional)'}
        />
        {creditAvailable != null && (
          <p
            className={`mt-1 text-xs ${
              effectiveAmount > creditAvailable ? 'text-expense' : 'text-ink-muted'
            }`}
          >
            Cupo disponible: {formatAmount(creditAvailable, selectedAccount!.currency)}
          </p>
        )}
      </div>

      <Select
        label="Categoría (opcional)"
        disabled={loadingCategories}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      >
        <option value="">
          {hasItems && rows.length === 1 ? 'Se hereda del artículo' : 'Sin categoría'}
        </option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

      {/* Los ítems son exclusivos de gastos: un ingreso no compra del catálogo. */}
      {!isIncome && (
        <ExpenseItemsEditor rows={rows} onChange={setRows} currency={currency} />
      )}

      <Field
        label={isIncome ? 'Fuente (opcional)' : 'Comercio (opcional)'}
        placeholder={isIncome ? 'Empresa XYZ' : 'Éxito'}
        error={errors.counterparty?.message}
        {...register('counterparty')}
      />

      <Field
        label="Notas (opcional)"
        placeholder="compra mensual"
        error={errors.notes?.message}
        {...register('notes')}
      />

      {formError && (
        <p role="alert" className="text-expense text-sm">
          {formError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="secondary" onClick={onDone} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Guardar' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
