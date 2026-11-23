import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { useCategories } from '@/features/categories/useCategories'
import { evictBudgets } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { CategoryBudget } from './budget'
import { SetCategoryBudgetMutation } from './budgets.queries'

const schema = z.object({
  categoryId: z.string().min(1, 'Elige una categoría'),
  amount: z
    .number({ error: 'Introduce el tope mensual' })
    .positive('El presupuesto debe ser mayor que 0'),
})

type FormValues = z.infer<typeof schema>

/**
 * Alta y edición de un presupuesto. `setCategoryBudget` es un upsert por
 * categoría, así que al editar la categoría queda fija: cambiarla crearía otro
 * presupuesto y dejaría el anterior vivo.
 */
export function BudgetForm({
  budget,
  budgetedCategoryIds,
  currency,
  onDone,
}: {
  budget?: CategoryBudget
  /** Categorías que ya tienen presupuesto: no se ofrecen al crear. */
  budgetedCategoryIds: ReadonlySet<string>
  /** Moneda base del usuario: `spent` llega en ella, así que el tope también. */
  currency: string
  onDone: () => void
}) {
  const isEditing = budget != null
  const [formError, setFormError] = useState<string | null>(null)
  const { tree, loading: loadingCategories } = useCategories('EXPENSE')
  const [setBudget] = useMutation(SetCategoryBudgetMutation, { update: evictBudgets })

  const options = tree.filter(
    ({ category }) =>
      category.id === budget?.category.id ||
      (category.isActive && !budgetedCategoryIds.has(category.id)),
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: budget?.category.id ?? '',
      amount: budget?.amount,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await setBudget({
        variables: {
          input: {
            // Al editar el select va deshabilitado: la categoría es la del presupuesto.
            categoryId: budget?.category.id ?? values.categoryId,
            amount: values.amount,
            currency,
          },
        },
      })
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Select
        label="Categoría de gasto"
        disabled={isEditing || loadingCategories}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      >
        <option value="">Elige una categoría</option>
        {options.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>
      <p className="text-ink-muted -mt-2 text-xs">
        Lo gastado incluye sus subcategorías.
      </p>

      <Field
        label={`Tope mensual (${currency})`}
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
