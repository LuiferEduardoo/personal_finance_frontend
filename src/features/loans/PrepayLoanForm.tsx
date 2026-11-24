import { type ApolloCache, useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import type { LoanPrepaymentMode } from '@/graphql/generated/graphql'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { evictLoans, evictMovements } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { PREPAYMENT_MODE_HINTS, PREPAYMENT_MODE_LABELS, type LoanDetail } from './loan'
import { PrepayLoanMutation } from './loans.queries'

const MODES = Object.keys(PREPAYMENT_MODE_LABELS) as LoanPrepaymentMode[]

/**
 * Abono extraordinario a capital. Registra un gasto "Abono a capital <nombre>"
 * y regenera las cuotas pendientes según el modo. Un abono igual al saldo
 * salda el crédito.
 */
export function PrepayLoanForm({
  loan,
  onDone,
}: {
  loan: LoanDetail
  onDone: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const [prepay] = useMutation(PrepayLoanMutation, {
    update: (cache: ApolloCache<unknown>) => {
      evictLoans(cache)
      evictMovements(cache)
    },
  })

  // El tope depende del saldo actual del crédito, así que el esquema se arma aquí.
  const schema = z.object({
    amount: z
      .number({ error: 'Introduce el monto del abono' })
      .positive('El abono debe ser mayor que 0')
      .max(
        loan.outstandingPrincipal,
        `No puede superar el saldo de capital (${formatAmount(loan.outstandingPrincipal, loan.currency)})`,
      ),
    accountId: z.string().min(1, 'Elige la cuenta de la que sale el abono'),
    paidOn: z.string().min(1, 'La fecha es obligatoria'),
    mode: z.enum(['REDUCE_TERM', 'REDUCE_PAYMENT']),
  })
  type FormValues = z.infer<typeof schema>

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountId: loan.paymentAccountId ?? '',
      paidOn: todayIso(),
      mode: 'REDUCE_TERM',
    },
  })
  const amount = watch('amount')
  const paysOff = amount != null && amount === loan.outstandingPrincipal

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await prepay({ variables: { input: { loanId: loan.id, ...values } } })
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <Field
          label={`Monto del abono (${loan.currency})`}
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          max={loan.outstandingPrincipal}
          placeholder="0"
          error={errors.amount?.message}
          {...register('amount', {
            setValueAs: (value: string) => (value === '' ? undefined : Number(value)),
          })}
        />
        <p className="text-ink-muted mt-1 text-xs">
          Saldo de capital: {formatAmount(loan.outstandingPrincipal, loan.currency)}
          {paysOff && ' · Este abono salda el crédito.'}
        </p>
      </div>

      <AccountSelect
        value={watch('accountId')}
        onChange={(accountId) =>
          setValue('accountId', accountId, { shouldValidate: true })
        }
        label="Cuenta del abono"
        error={errors.accountId?.message}
      />
      <Field
        label="Fecha del abono"
        type="date"
        error={errors.paidOn?.message}
        {...register('paidOn')}
      />

      <fieldset>
        <legend className="text-ink-secondary text-sm font-medium">
          ¿Qué quieres reducir?
        </legend>
        <div className="mt-1.5 flex flex-col gap-2">
          {MODES.map((mode) => (
            <label
              key={mode}
              className="border-border bg-surface-raised has-checked:border-ink flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5"
            >
              <input
                type="radio"
                value={mode}
                className="accent-ink mt-0.5 size-4 shrink-0"
                {...register('mode')}
              />
              <span>
                <span className="text-ink block text-sm font-medium">
                  {PREPAYMENT_MODE_LABELS[mode]}
                </span>
                <span className="text-ink-muted block text-xs">
                  {PREPAYMENT_MODE_HINTS[mode]}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

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
          Abonar
        </Button>
      </div>
    </form>
  )
}
