import { type ApolloCache, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { evictLoans, evictMovements } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatDate, todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import type { LoanDetail, LoanInstallment } from './loan'
import { PayLoanInstallmentMutation } from './loans.queries'

const schema = z.object({
  accountId: z.string().min(1, 'Elige la cuenta de la que sale el pago'),
  paidOn: z.string().min(1, 'La fecha es obligatoria'),
})

type FormValues = z.infer<typeof schema>

/**
 * Pago de la cuota pendiente más antigua (la única que acepta el backend).
 * Registra un gasto "<nombre> (n/N)": cambian el crédito, el saldo de la
 * cuenta, las listas de movimientos y los presupuestos.
 */
export function PayInstallmentForm({
  loan,
  installment,
  onDone,
}: {
  loan: LoanDetail
  installment: LoanInstallment
  onDone: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const [payInstallment] = useMutation(PayLoanInstallmentMutation, {
    update: (cache: ApolloCache<unknown>) => {
      evictLoans(cache)
      evictMovements(cache)
    },
  })

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { accountId: loan.paymentAccountId ?? '', paidOn: todayIso() },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await payInstallment({
        variables: {
          input: {
            installmentId: installment.id,
            accountId: values.accountId,
            paidOn: values.paidOn,
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
      <div className="border-border bg-surface-sunken rounded-lg border px-3 py-2.5">
        <p className="text-ink text-sm font-medium">
          Cuota {installment.sequenceNumber} de {loan.installments.length} ·{' '}
          <span className="tabular">
            {formatAmount(installment.amount, loan.currency)}
          </span>
        </p>
        <p className="text-ink-muted mt-0.5 text-xs">
          Vence el {formatDate(installment.dueDate)}. Se registra como gasto.
        </p>
      </div>

      <AccountSelect
        value={watch('accountId')}
        onChange={(accountId) =>
          setValue('accountId', accountId, { shouldValidate: true })
        }
        label="Cuenta del pago"
        error={errors.accountId?.message}
      />
      <Field
        label="Fecha del pago"
        type="date"
        error={errors.paidOn?.message}
        {...register('paidOn')}
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
          Pagar cuota
        </Button>
      </div>
    </form>
  )
}
