import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { PaymentMethodType } from '@/graphql/generated/graphql'
import { formatAmount } from '@/lib/money'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_OPTIONS,
  isCreditAccount,
  type Account,
} from './account'
import {
  AccountsQuery,
  CreateAccountMutation,
  RemoveAccountMutation,
  UpdateAccountMutation,
} from './accounts.queries'
import { useAccounts } from './useAccounts'

export function AccountsPage() {
  const { accounts, loading, error } = useAccounts(true)
  const [editing, setEditing] = useState<Account | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [removeAccount] = useMutation(RemoveAccountMutation, {
    refetchQueries: ['Accounts'],
  })

  const handleRemove = async (account: Account) => {
    if (!window.confirm(`¿Eliminar la cuenta "${account.name}"?`)) return
    setActionError(null)
    try {
      await removeAccount({ variables: { id: account.id } })
    } catch (caught) {
      // p.ej. "la cuenta tiene planes de cuotas" llega como BAD_REQUEST.
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const isFormOpen = isCreating || editing !== null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Cuentas</h1>
        <Button onClick={() => setIsCreating(true)}>Nueva</Button>
      </div>

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : accounts.length === 0 ? (
          <EmptyState
            title="Sin cuentas"
            description="Crea tu banco, efectivo o tarjeta para asociarlos a tus movimientos."
            action={<Button onClick={() => setIsCreating(true)}>Nueva cuenta</Button>}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="border-border bg-surface-raised flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="text-ink text-sm font-medium">
                    {account.name}
                    {!account.isActive && (
                      <span className="text-ink-muted font-normal"> · inactiva</span>
                    )}
                  </p>
                  <p className="text-ink-muted mt-0.5 text-xs">
                    {ACCOUNT_TYPE_LABELS[account.type]} ·{' '}
                    {formatAmount(account.openingBalance, account.currency)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <RowAction onClick={() => setEditing(account)}>Editar</RowAction>
                  <RowAction onClick={() => void handleRemove(account)}>
                    Eliminar
                  </RowAction>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsCreating(false)
          setEditing(null)
        }}
        title={editing ? 'Editar cuenta' : 'Nueva cuenta'}
      >
        {isFormOpen && (
          <AccountForm
            key={editing?.id ?? 'nueva'}
            account={editing ?? undefined}
            onDone={() => {
              setIsCreating(false)
              setEditing(null)
            }}
          />
        )}
      </Sheet>
    </div>
  )
}

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.enum(['CASH', 'DEBIT', 'CREDIT', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'OTHER']),
  currency: z.string().min(1, 'La moneda es obligatoria'),
  openingBalance: z.number().optional(),
  creditLimit: z.number().optional(),
  statementDay: z.number().optional(),
  dueDay: z.number().optional(),
  monthlyRate: z.number().optional(),
})

type FormValues = z.infer<typeof schema>

function AccountForm({ account, onDone }: { account?: Account; onDone: () => void }) {
  const { user } = useSession()
  const isEditing = account != null
  const [formError, setFormError] = useState<string | null>(null)

  const [createAccount] = useMutation(CreateAccountMutation, {
    refetchQueries: [{ query: AccountsQuery, variables: { includeInactive: true } }],
  })
  const [updateAccount] = useMutation(UpdateAccountMutation, {
    refetchQueries: [{ query: AccountsQuery, variables: { includeInactive: true } }],
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: account?.name ?? '',
      type: account?.type ?? 'CASH',
      currency: account?.currency ?? user?.baseCurrency ?? 'COP',
      openingBalance: account?.openingBalance ?? 0,
      creditLimit: account?.creditLimit ?? undefined,
      statementDay: account?.statementDay ?? undefined,
      dueDay: account?.dueDay ?? undefined,
      monthlyRate: account?.monthlyRate ?? undefined,
    },
  })

  const type = watch('type') as PaymentMethodType
  const showCredit = isCreditAccount(type)

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    // El backend valida que solo las de crédito lleven estos campos, así que
    // solo se envían cuando el tipo es crédito.
    const creditFields = showCredit
      ? {
          creditLimit: values.creditLimit ?? undefined,
          statementDay: values.statementDay ?? undefined,
          dueDay: values.dueDay ?? undefined,
          monthlyRate: values.monthlyRate ?? undefined,
        }
      : {}

    try {
      if (isEditing) {
        await updateAccount({
          variables: {
            input: {
              id: account.id,
              name: values.name,
              type: values.type,
              currency: values.currency,
              openingBalance: values.openingBalance ?? 0,
              ...creditFields,
            },
          },
        })
      } else {
        await createAccount({
          variables: {
            input: {
              name: values.name,
              type: values.type,
              currency: values.currency,
              openingBalance: values.openingBalance ?? 0,
              ...creditFields,
            },
          },
        })
      }
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  const numberField = (name: keyof FormValues) => ({
    ...register(name, {
      setValueAs: (value: string) => (value === '' ? undefined : Number(value)),
    }),
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Nombre"
        placeholder="Bancolombia"
        error={errors.name?.message}
        {...register('name')}
      />

      <Select label="Tipo" error={errors.type?.message} {...register('type')}>
        {ACCOUNT_TYPE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Moneda"
          placeholder="COP"
          error={errors.currency?.message}
          {...register('currency')}
        />
        <Field
          label="Saldo inicial"
          type="number"
          inputMode="decimal"
          step="any"
          placeholder="0"
          error={errors.openingBalance?.message}
          {...numberField('openingBalance')}
        />
      </div>

      {showCredit && (
        <div className="border-border bg-surface-sunken flex flex-col gap-3 rounded-lg border p-3">
          <p className="text-ink text-sm font-medium">Datos de la tarjeta</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Cupo"
              type="number"
              inputMode="decimal"
              step="any"
              {...numberField('creditLimit')}
            />
            <Field
              label="Tasa mensual %"
              type="number"
              inputMode="decimal"
              step="any"
              {...numberField('monthlyRate')}
            />
            <Field
              label="Día de corte"
              type="number"
              inputMode="numeric"
              {...numberField('statementDay')}
            />
            <Field
              label="Día de pago"
              type="number"
              inputMode="numeric"
              {...numberField('dueDay')}
            />
          </div>
        </div>
      )}

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

function RowAction({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg px-3 text-sm"
    >
      {children}
    </button>
  )
}
