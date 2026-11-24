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
import { getFirstErrorMessage } from '@/graphql/errors'
import type { LoanDetail } from './loan'
import { UpdateLoanMutation } from './loans.queries'

const schema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  lender: z.string().optional(),
  categoryId: z.string().optional(),
  paymentAccountId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

/**
 * `updateLoan` solo acepta datos descriptivos: capital, tasa, plazo y cargos
 * son inmutables. Vacío se envía como `null` para que el backend lo borre.
 * La respuesta trae el crédito con su id, así que Apollo lo normaliza solo.
 */
export function LoanEditForm({
  loan,
  onDone,
}: {
  loan: LoanDetail
  onDone: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const { tree, loading: loadingCategories } = useCategories('EXPENSE')
  const [updateLoan] = useMutation(UpdateLoanMutation)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: loan.name,
      lender: loan.lender ?? '',
      categoryId: loan.categoryId ?? '',
      paymentAccountId: loan.paymentAccountId ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const nullable = (value: string | undefined) => value?.trim() || null
    try {
      await updateLoan({
        variables: {
          input: {
            id: loan.id,
            name: values.name.trim(),
            lender: nullable(values.lender),
            categoryId: nullable(values.categoryId),
            paymentAccountId: nullable(values.paymentAccountId),
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
      <p className="text-ink-muted text-xs">
        Monto, tasa, plazo y cargos no se pueden cambiar una vez creado el crédito.
      </p>
      <Field label="Nombre" error={errors.name?.message} {...register('name')} />
      <Field
        label="Entidad (opcional)"
        error={errors.lender?.message}
        {...register('lender')}
      />
      <AccountSelect
        value={watch('paymentAccountId') ?? ''}
        onChange={(accountId) => setValue('paymentAccountId', accountId)}
        label="Cuenta de pagos (opcional)"
      />
      <Select
        label="Categoría de los pagos (opcional)"
        disabled={loadingCategories}
        {...register('categoryId')}
      >
        <option value="">Sin categoría</option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

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
          Guardar
        </Button>
      </div>
    </form>
  )
}
