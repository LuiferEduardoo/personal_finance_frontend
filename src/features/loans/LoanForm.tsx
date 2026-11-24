import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { useCategories } from '@/features/categories/useCategories'
import { evictLoans } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import { todayIso } from '@/lib/dates'
import {
  buildCreateLoanInput,
  CHARGE_KIND_LABELS,
  CHARGE_MODE_LABELS,
  MAX_CHARGE_PERCENT,
  MAX_INSTALLMENTS,
  maxRatePercent,
  RATE_TYPE_LABELS,
  type LoanChargeValues,
} from './loan'
import { CreateLoanMutation } from './loans.queries'

const chargeSchema = z
  .object({
    name: z.string().trim().min(1, 'Ponle un nombre al cargo'),
    kind: z.enum(['INSURANCE', 'FEE']),
    mode: z.enum(['FIXED', 'PERCENT_OF_BALANCE']),
    value: z
      .number({ error: 'Introduce el valor del cargo' })
      .min(0, 'El valor no puede ser negativo'),
  })
  .refine(
    (charge) =>
      charge.mode !== 'PERCENT_OF_BALANCE' || charge.value <= MAX_CHARGE_PERCENT,
    {
      message: `El porcentaje no puede superar ${MAX_CHARGE_PERCENT} %`,
      path: ['value'],
    },
  )

/**
 * Límites espejados de `LoansService`: capital > 0, 1–600 cuotas, tasa EA hasta
 * 1000 % y mensual hasta 100 %, cargo porcentual hasta 100 %, y la primera cuota
 * no puede vencer antes del desembolso.
 */
const schema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio'),
    lender: z.string().optional(),
    principalAmount: z
      .number({ error: 'Introduce el monto desembolsado' })
      .positive('El monto debe ser mayor que 0'),
    currency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, 'Usa un código de 3 letras (COP, USD…)'),
    rateType: z.enum(['EFFECTIVE_ANNUAL', 'MONTHLY']),
    ratePercent: z
      .number({ error: 'Introduce la tasa' })
      .min(0, 'La tasa no puede ser negativa'),
    installmentCount: z
      .number({ error: 'Introduce el número de cuotas' })
      .int('Usa un número entero de cuotas')
      .min(1, 'Al menos 1 cuota')
      .max(MAX_INSTALLMENTS, `El máximo es ${MAX_INSTALLMENTS} cuotas`),
    disbursedOn: z.string().min(1, 'La fecha de desembolso es obligatoria'),
    firstDueDate: z.string().optional(),
    disbursementAccountId: z.string().optional(),
    paymentAccountId: z.string().optional(),
    categoryId: z.string().optional(),
    charges: z.array(chargeSchema),
  })
  .superRefine((values, ctx) => {
    const max = maxRatePercent(values.rateType)
    if (values.ratePercent > max) {
      ctx.addIssue({
        code: 'custom',
        path: ['ratePercent'],
        message:
          values.rateType === 'EFFECTIVE_ANNUAL'
            ? `La tasa efectiva anual no puede superar ${max} %`
            : `La tasa mensual no puede superar ${max} %`,
      })
    }
    // YYYY-MM-DD se compara bien como texto.
    if (values.firstDueDate && values.firstDueDate < values.disbursedOn) {
      ctx.addIssue({
        code: 'custom',
        path: ['firstDueDate'],
        message: 'La primera cuota no puede vencer antes del desembolso',
      })
    }
  })

type FormValues = z.infer<typeof schema>

const NEW_CHARGE: LoanChargeValues = {
  name: '',
  kind: 'INSURANCE',
  mode: 'PERCENT_OF_BALANCE',
  value: 0,
}

const toNumber = (value: string) => (value === '' ? undefined : Number(value))

/**
 * Alta de un crédito. Las condiciones financieras no se pueden editar después
 * (solo nombre, entidad, categoría y cuenta de pagos), así que todo lo que
 * define la tabla se pide aquí. Tasas y cargos porcentuales se escriben en %
 * y viajan como fracción.
 */
export function LoanForm({
  defaultCurrency,
  onCreated,
  onCancel,
}: {
  defaultCurrency: string
  onCreated: (loanId: string) => void
  onCancel: () => void
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const { tree, loading: loadingCategories } = useCategories('EXPENSE')
  // El desembolso suma al saldo de la cuenta: se evictan créditos y cuentas.
  const [createLoan] = useMutation(CreateLoanMutation, { update: evictLoans })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      lender: '',
      currency: defaultCurrency,
      rateType: 'EFFECTIVE_ANNUAL',
      disbursedOn: todayIso(),
      firstDueDate: '',
      disbursementAccountId: '',
      paymentAccountId: '',
      categoryId: '',
      charges: [],
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'charges' })
  const rateType = watch('rateType')
  const currency = watch('currency')

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const result = await createLoan({
        variables: { input: buildCreateLoanInput(values) },
      })
      const id = result.data?.createLoan.id
      if (id) onCreated(id)
    } catch (error) {
      // BAD_REQUEST llega con el mensaje del backend ya en español.
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Nombre"
        placeholder="Libre inversión"
        error={errors.name?.message}
        {...register('name')}
      />
      <Field
        label="Entidad (opcional)"
        placeholder="Banco"
        error={errors.lender?.message}
        {...register('lender')}
      />

      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <Field
          label="Monto desembolsado"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          error={errors.principalAmount?.message}
          {...register('principalAmount', { setValueAs: toNumber })}
        />
        <Field
          label="Moneda"
          maxLength={3}
          autoCapitalize="characters"
          error={errors.currency?.message}
          {...register('currency')}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select label="Tipo de tasa" {...register('rateType')}>
          {Object.entries(RATE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Field
          label="Tasa (%)"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          max={maxRatePercent(rateType)}
          placeholder={rateType === 'EFFECTIVE_ANNUAL' ? '24' : '1.8'}
          error={errors.ratePercent?.message}
          {...register('ratePercent', { setValueAs: toNumber })}
        />
      </div>

      <Field
        label="Número de cuotas mensuales"
        type="number"
        inputMode="numeric"
        min="1"
        max={MAX_INSTALLMENTS}
        step="1"
        placeholder="36"
        error={errors.installmentCount?.message}
        {...register('installmentCount', { setValueAs: toNumber })}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Fecha de desembolso"
          type="date"
          error={errors.disbursedOn?.message}
          {...register('disbursedOn')}
        />
        <div>
          <Field
            label="Primera cuota (opcional)"
            type="date"
            error={errors.firstDueDate?.message}
            {...register('firstDueDate')}
          />
          {!errors.firstDueDate && (
            <p className="text-ink-muted mt-1 text-xs">
              Por defecto, un mes después del desembolso.
            </p>
          )}
        </div>
      </div>

      <div>
        <AccountSelect
          value={watch('disbursementAccountId') ?? ''}
          onChange={(accountId) => setValue('disbursementAccountId', accountId)}
          label="Cuenta del desembolso (opcional)"
        />
        <p className="text-ink-muted mt-1 text-xs">
          El monto se suma a su saldo; no cuenta como ingreso.
        </p>
      </div>

      <div>
        <AccountSelect
          value={watch('paymentAccountId') ?? ''}
          onChange={(accountId) => setValue('paymentAccountId', accountId)}
          label="Cuenta de pagos (opcional)"
        />
        <p className="text-ink-muted mt-1 text-xs">
          Cuenta por defecto de la que salen las cuotas.
        </p>
      </div>

      <Select
        label="Categoría de los pagos (opcional)"
        disabled={loadingCategories}
        error={errors.categoryId?.message}
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

      <section className="border-border bg-surface-sunken rounded-xl border p-3 sm:p-4">
        <p className="text-ink text-sm font-medium">Seguros y comisiones</p>
        <p className="text-ink-muted mt-0.5 text-xs">
          Se suman a cada cuota. No se pueden cambiar después.
        </p>

        {fields.length > 0 && (
          <ul className="mt-3 flex flex-col gap-3">
            {fields.map((field, index) => {
              const mode = watch(`charges.${index}.mode`)
              const chargeErrors = errors.charges?.[index]
              return (
                <li
                  key={field.id}
                  className="border-border bg-surface-raised flex flex-col gap-3 rounded-lg border p-3"
                >
                  <Field
                    label="Nombre del cargo"
                    placeholder="Seguro de vida"
                    error={chargeErrors?.name?.message}
                    {...register(`charges.${index}.name`)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Tipo" {...register(`charges.${index}.kind`)}>
                      {Object.entries(CHARGE_KIND_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                    <Select label="Cálculo" {...register(`charges.${index}.mode`)}>
                      {Object.entries(CHARGE_MODE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Field
                    label={
                      mode === 'PERCENT_OF_BALANCE'
                        ? 'Porcentaje mensual sobre el saldo (%)'
                        : `Valor por cuota (${currency || defaultCurrency})`
                    }
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    placeholder={mode === 'PERCENT_OF_BALANCE' ? '0.1' : '0'}
                    error={chargeErrors?.value?.message}
                    {...register(`charges.${index}.value`, { setValueAs: toNumber })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="self-start"
                  >
                    Quitar cargo
                  </Button>
                </li>
              )
            })}
          </ul>
        )}

        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ ...NEW_CHARGE })}
          className="mt-3 w-full"
        >
          Añadir seguro o comisión
        </Button>
      </section>

      {formError && (
        <p role="alert" className="text-expense text-sm">
          {formError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          Crear crédito
        </Button>
      </div>
    </form>
  )
}
