import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { useCurrentUserId } from '@/features/auth/SessionContext'
import { useCategories } from '@/features/categories/useCategories'
import { getFirstErrorMessage } from '@/graphql/errors'
import { todayIso } from '@/lib/dates'
import {
  CreateExpenseMutation,
  CreateIncomeMutation,
  ExpensesQuery,
  IncomesQuery,
  UpdateExpenseMutation,
  UpdateIncomeMutation,
} from './transactions.queries'
import type { Transaction } from './types'

/**
 * Las reglas replican las del backend: descripción y fecha obligatorias,
 * importe mayor que 0. Validar aquí evita un viaje al servidor para saber algo
 * que ya sabemos.
 */
const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z
    .number({ error: 'Introduce un importe' })
    .positive('El importe debe ser mayor que 0'),
  occurredOn: z.string().min(1, 'La fecha es obligatoria'),
  categoryId: z.string().optional(),
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
  const userId = useCurrentUserId()
  const isIncome = kind === 'INCOME'
  const isEditing = transaction != null
  const [formError, setFormError] = useState<string | null>(null)

  const { tree, loading: loadingCategories } = useCategories(kind)

  // Tras crear o editar hay que refrescar las listas: la caché no puede saber
  // en qué filtros encaja un movimiento nuevo.
  const refetchQueries = [ExpensesQuery, IncomesQuery].map((query) => ({
    query,
    variables: { userId, filter: {} },
  }))

  const [createExpense] = useMutation(CreateExpenseMutation, { refetchQueries })
  const [createIncome] = useMutation(CreateIncomeMutation, { refetchQueries })
  const [updateExpense] = useMutation(UpdateExpenseMutation, { refetchQueries })
  const [updateIncome] = useMutation(UpdateIncomeMutation, { refetchQueries })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: transaction?.description ?? '',
      amount: transaction?.amount,
      occurredOn: transaction?.occurredOn ?? todayIso(),
      categoryId: transaction?.categoryId ?? '',
      counterparty: transaction?.counterparty ?? '',
      notes: transaction?.notes ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    // Un campo opcional vacío es "no informado", no cadena vacía.
    const optional = (value: string | undefined) => value?.trim() || undefined

    try {
      if (isEditing) {
        const base = {
          id: transaction.id,
          description: values.description,
          amount: values.amount,
          occurredOn: values.occurredOn,
          categoryId: optional(values.categoryId),
          notes: optional(values.notes),
        }
        if (isIncome) {
          await updateIncome({
            variables: { input: { ...base, source: optional(values.counterparty) } },
          })
        } else {
          await updateExpense({
            variables: { input: { ...base, merchant: optional(values.counterparty) } },
          })
        }
      } else {
        const base = {
          userId,
          description: values.description,
          amount: values.amount,
          occurredOn: values.occurredOn,
          categoryId: optional(values.categoryId),
          notes: optional(values.notes),
        }
        if (isIncome) {
          await createIncome({
            variables: { input: { ...base, source: optional(values.counterparty) } },
          })
        } else {
          await createExpense({
            variables: { input: { ...base, merchant: optional(values.counterparty) } },
          })
        }
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

      <Field
        label="Importe"
        type="number"
        // `inputMode decimal` abre el teclado numérico en móvil.
        inputMode="decimal"
        step="any"
        min="0"
        placeholder="0"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />

      <Field
        label="Fecha"
        type="date"
        error={errors.occurredOn?.message}
        {...register('occurredOn')}
      />

      <Select
        label="Categoría (opcional)"
        disabled={loadingCategories}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      >
        <option value="">Sin categoría</option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {/* Sangría con espacios finos: un <select> nativo no anida. */}
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

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
