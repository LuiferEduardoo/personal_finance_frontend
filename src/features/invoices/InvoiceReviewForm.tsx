import { useApolloClient } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getApiErrorMessage } from '@/api/http'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { isCreditAccount, spendableAmount } from '@/features/accounts/account'
import { AccountSelect } from '@/features/accounts/AccountSelect'
import { useAccounts } from '@/features/accounts/useAccounts'
import { useCategories } from '@/features/categories/useCategories'
import { evictInventory, evictMovements } from '@/graphql/cache'
import { todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { InvoiceItemsEditor } from './InvoiceItemsEditor'
import {
  buildExpensePayload,
  invoiceItemsTotal,
  isInvoiceRowComplete,
  matchCategory,
  rowsFromDraft,
  type ExpenseDraft,
  type InvoiceItemRow,
} from './invoice'
import { createInvoiceExpense, type CreatedExpense } from './invoices.api'

/**
 * La cuenta es OBLIGATORIA aquí, al revés que en el gasto manual: el borrador
 * la trae siempre a `null` y sin ella el gasto no descontaría de ningún saldo.
 * El resto de reglas son las del backend: descripción y fecha obligatorias, e
 * importe manual solo cuando la factura no trae líneas.
 */
const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  occurredOn: z.string().min(1, 'La fecha es obligatoria'),
  currency: z.string().regex(/^[A-Za-z]{3}$/, 'Usa el código de 3 letras (COP, USD…)'),
  amount: z.number().positive('El importe debe ser mayor que 0').optional(),
  accountId: z.string().min(1, 'Elige la cuenta de la que salió el gasto'),
  categoryId: z.string().optional(),
  merchant: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type InvoiceReviewFormProps = {
  draft: ExpenseDraft
  onCancel: () => void
  onCreated: (expense: CreatedExpense) => void
}

export function InvoiceReviewForm({
  draft,
  onCancel,
  onCreated,
}: InvoiceReviewFormProps) {
  const apollo = useApolloClient()
  const [rows, setRows] = useState<InvoiceItemRow[]>(() => rowsFromDraft(draft))
  const [formError, setFormError] = useState<string | null>(null)

  const { categories, tree, loading: loadingCategories } = useCategories('EXPENSE')
  const { accounts } = useAccounts()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: draft.description || draft.merchant || 'Factura',
      // Una factura sin fecha legible es de hoy: es lo que el usuario acaba de
      // gastar, y la alternativa es dejar el campo vacío y bloquear el envío.
      occurredOn: draft.occurredOn ?? todayIso(),
      currency: draft.currency || 'COP',
      amount: draft.amount ?? undefined,
      accountId: '',
      categoryId: '',
      merchant: draft.merchant ?? '',
      notes: '',
    },
  })

  // La sugerencia es texto libre ("mercado"), no un id: se traduce a una
  // categoría real en cuanto llegan las del usuario, y solo la primera vez para
  // no pisar lo que el usuario haya elegido después.
  const suggestionApplied = useRef(false)
  const suggestedId = matchCategory(draft.categorySuggestion, categories)
  useEffect(() => {
    if (suggestionApplied.current || !suggestedId) return
    suggestionApplied.current = true
    setValue('categoryId', suggestedId)
  }, [suggestedId, setValue])

  const hasItems = rows.length > 0
  const rawCurrency = watch('currency')
  // Intl lanza con un código inválido: mientras se escribe, se formatea en COP.
  const currency = /^[A-Za-z]{3}$/.test(rawCurrency) ? rawCurrency.toUpperCase() : 'COP'
  const computedAmount = invoiceItemsTotal(rows)
  const effectiveAmount = hasItems ? computedAmount : (watch('amount') ?? 0)

  const selectedAccount =
    accounts.find((account) => account.id === watch('accountId')) ?? null
  const creditAvailable =
    selectedAccount && isCreditAccount(selectedAccount.type)
      ? spendableAmount(selectedAccount)
      : null

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)

    if (!hasItems && values.amount == null) {
      setFormError('Escribe el importe total: la factura no trae líneas.')
      return
    }
    if (hasItems && !rows.every(isInvoiceRowComplete)) {
      setFormError('Cada ítem necesita nombre de artículo y precio unitario.')
      return
    }
    if (creditAvailable != null && effectiveAmount > creditAvailable) {
      setFormError(
        `Excede el cupo disponible (${formatAmount(creditAvailable, selectedAccount!.currency)}).`,
      )
      return
    }

    try {
      const expense = await createInvoiceExpense(
        buildExpensePayload({ ...values, currency }, rows),
      )
      // El gasto se creó por REST, así que la caché de Apollo no se entera sola:
      // se invalida a mano lo mismo que evicta el formulario manual (listas,
      // dashboard, inflación y saldos; más el inventario si hubo productos).
      evictMovements(apollo.cache)
      if (rows.some((row) => row.article.mode !== 'existing')) {
        evictInventory(apollo.cache)
      }
      onCreated(expense)
    } catch (caught) {
      setFormError(getApiErrorMessage(caught))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Descripción"
        error={errors.description?.message}
        {...register('description')}
      />

      {hasItems ? (
        <div>
          <span className="text-ink-secondary block text-sm font-medium">Importe</span>
          <p className="tabular text-ink mt-1.5 text-lg font-medium">
            {formatAmount(computedAmount, currency)}
          </p>
          <p className="text-ink-muted mt-0.5 text-xs">
            Suma de los ítems; lo recalcula el servidor al guardar.
          </p>
        </div>
      ) : (
        <Field
          label="Importe total"
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

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Fecha"
          type="date"
          error={errors.occurredOn?.message}
          {...register('occurredOn')}
        />
        <Field
          label="Moneda"
          maxLength={3}
          error={errors.currency?.message}
          {...register('currency')}
        />
      </div>

      <div>
        <AccountSelect
          value={watch('accountId')}
          onChange={(accountId) =>
            setValue('accountId', accountId, { shouldValidate: true })
          }
          label="Cuenta"
          error={errors.accountId?.message}
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

      <div>
        <Select
          label="Categoría (opcional)"
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
        {draft.categorySuggestion && (
          <p className="text-ink-muted mt-1 text-xs">
            La factura sugiere «{draft.categorySuggestion}»
            {suggestedId ? '.' : ', pero no coincide con ninguna categoría tuya.'}
          </p>
        )}
      </div>

      <InvoiceItemsEditor rows={rows} onChange={setRows} currency={currency} />

      <Field
        label="Comercio (opcional)"
        placeholder="Éxito"
        error={errors.merchant?.message}
        {...register('merchant')}
      />

      <Field
        label="Notas (opcional)"
        error={errors.notes?.message}
        {...register('notes')}
      />

      {formError && (
        <p role="alert" className="text-expense text-sm">
          {formError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Descartar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          Registrar gasto
        </Button>
      </div>
    </form>
  )
}
