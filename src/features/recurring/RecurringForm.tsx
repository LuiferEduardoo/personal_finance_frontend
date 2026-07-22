import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { useCategories } from '@/features/categories/useCategories'
import { ExpenseItemsEditor } from '@/features/transactions/ExpenseItemsEditor'
import {
  buildItemsInput,
  isRowComplete,
  itemsTotal,
  rowsFromItems,
  type ItemRow,
} from '@/features/transactions/items'
import { evictRecurring } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { RecurringExpensesQuery } from '@/graphql/generated/graphql'
import { todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { RECURRING_OPTIONS } from './recurrence'
import {
  CreateRecurringExpenseMutation,
  UpdateRecurringExpenseMutation,
} from './recurring.queries'

type RecurringExpense = RecurringExpensesQuery['recurringExpenses'][number]

const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z.number().positive('El importe debe ser mayor que 0').optional(),
  recurrence: z.enum([
    'DAILY',
    'WEEKLY',
    'BIWEEKLY',
    'MONTHLY',
    'BIMONTHLY',
    'QUARTERLY',
    'SEMIANNUAL',
    'ANNUAL',
  ]),
  startOn: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endOn: z.string().optional(),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
  merchant: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RecurringForm({
  recurring,
  onDone,
}: {
  recurring?: RecurringExpense
  onDone: () => void
}) {
  const isEditing = recurring != null
  const [formError, setFormError] = useState<string | null>(null)
  const [rows, setRows] = useState<ItemRow[]>(() =>
    rowsFromItems(
      (recurring?.items ?? []).map((item) => ({
        id: item.id,
        articleId: item.articleId ?? null,
        articleName: item.article?.name ?? null,
        articleType: item.article?.type ?? null,
        description: item.description ?? null,
        unitPrice: item.unitPrice ?? null,
        quantity: item.quantity,
        subtotal: 0,
      })),
    ),
  )

  const { tree } = useCategories('EXPENSE')

  const [createRecurring] = useMutation(CreateRecurringExpenseMutation, {
    update: evictRecurring,
  })
  const [updateRecurring] = useMutation(UpdateRecurringExpenseMutation, {
    update: evictRecurring,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: recurring?.description ?? '',
      amount: recurring?.amount ?? undefined,
      recurrence: (recurring?.recurrence as FormValues['recurrence']) ?? 'MONTHLY',
      startOn: recurring?.startOn ?? todayIso(),
      endOn: recurring?.endOn ?? '',
      categoryId: recurring?.categoryId ?? '',
      accountId: recurring?.accountId ?? '',
      merchant: recurring?.merchant ?? '',
      notes: recurring?.notes ?? '',
    },
  })

  const hasItems = rows.length > 0
  const currency = recurring?.currency ?? 'COP'

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const optional = (value: string | undefined) => value?.trim() || undefined

    if (!hasItems && values.amount == null) {
      setFormError('Introduce un importe o añade al menos un ítem.')
      return
    }
    if (hasItems && !rows.every(isRowComplete)) {
      setFormError('Cada ítem necesita un artículo y su precio unitario.')
      return
    }

    const input = {
      description: values.description,
      recurrence: values.recurrence,
      startOn: values.startOn,
      endOn: optional(values.endOn),
      categoryId: optional(values.categoryId),
      accountId: optional(values.accountId),
      merchant: optional(values.merchant),
      notes: optional(values.notes),
      ...(hasItems ? { items: buildItemsInput(rows) } : { amount: values.amount }),
    }

    try {
      if (isEditing) {
        await updateRecurring({ variables: { input: { id: recurring.id, ...input } } })
      } else {
        await createRecurring({ variables: { input } })
      }
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Descripción"
        placeholder="Arriendo"
        error={errors.description?.message}
        {...register('description')}
      />

      {hasItems ? (
        <div>
          <span className="text-ink-secondary block text-sm font-medium">Importe</span>
          <p className="tabular text-ink mt-1.5 text-lg font-medium">
            {formatAmount(itemsTotal(rows), currency)}
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

      <Select
        label="Frecuencia"
        error={errors.recurrence?.message}
        {...register('recurrence')}
      >
        {RECURRING_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Inicia"
          type="date"
          error={errors.startOn?.message}
          {...register('startOn')}
        />
        <Field
          label="Termina (opcional)"
          type="date"
          error={errors.endOn?.message}
          {...register('endOn')}
        />
      </div>

      <AccountSelect
        value={watch('accountId') ?? ''}
        onChange={(accountId) => setValue('accountId', accountId)}
      />

      <Select label="Categoría (opcional)" {...register('categoryId')}>
        <option value="">Sin categoría</option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

      <ExpenseItemsEditor rows={rows} onChange={setRows} currency={currency} />

      <Field
        label="Comercio (opcional)"
        placeholder="Éxito"
        {...register('merchant')}
      />
      <Field label="Notas (opcional)" {...register('notes')} />

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
          {isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
