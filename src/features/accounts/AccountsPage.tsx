import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { evictAccounts } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { PaymentMethodType } from '@/graphql/generated/graphql'
import { formatAmount } from '@/lib/money'
import {
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_OPTIONS,
  creditDebt,
  isCreditAccount,
  type Account,
} from './account'
import {
  CreateAccountMutation,
  RecalculateAccountBalanceMutation,
  RemoveAccountMutation,
  UpdateAccountMutation,
} from './accounts.queries'
import { CreditGauge } from './CreditGauge'
import { TransferModal } from './TransferModal'
import { useAccounts } from './useAccounts'

export function AccountsPage() {
  const [showInactive, setShowInactive] = useState(false)
  const { accounts, loading, error } = useAccounts(showInactive)
  const [editing, setEditing] = useState<Account | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [transferFrom, setTransferFrom] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const [removeAccount] = useMutation(RemoveAccountMutation, {
    update: evictAccounts,
  })
  const [recalculate] = useMutation(RecalculateAccountBalanceMutation)

  // Agregados: no se mezclan activos con deudas. Disponible = suma de balances
  // de activo; Deudas = suma de deudas de las tarjetas.
  const totals = useMemo(() => {
    let available = 0
    let debt = 0
    for (const account of accounts) {
      if (isCreditAccount(account.type)) debt += creditDebt(account)
      else available += account.balance
    }
    return { available, debt }
  }, [accounts])

  const currency = accounts[0]?.currency ?? 'COP'

  const handleRemove = async (account: Account) => {
    if (!window.confirm(`¿Eliminar la cuenta "${account.name}"?`)) return
    setActionError(null)
    try {
      await removeAccount({ variables: { id: account.id } })
    } catch (caught) {
      // "tiene planes de cuotas o transferencias asociadas" llega como BAD_REQUEST.
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const handleRecalculate = async (account: Account) => {
    setActionError(null)
    try {
      await recalculate({ variables: { id: account.id } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const openTransfer = (fromId?: string) => {
    setTransferFrom(fromId ?? null)
    setIsTransferring(true)
  }

  const isFormOpen = isCreating || editing !== null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Cuentas</h1>
        <div className="flex gap-2">
          {accounts.length > 1 && (
            <Button variant="secondary" onClick={() => openTransfer()}>
              Transferir
            </Button>
          )}
          <Button onClick={() => setIsCreating(true)}>Nueva</Button>
        </div>
      </div>

      {accounts.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="border-border bg-surface-raised rounded-lg border p-3">
            <p className="text-ink-secondary text-xs">Disponible</p>
            <p className="tabular text-income mt-0.5 text-lg font-medium">
              {formatAmount(totals.available, currency)}
            </p>
          </div>
          <div className="border-border bg-surface-raised rounded-lg border p-3">
            <p className="text-ink-secondary text-xs">Deudas de tarjeta</p>
            <p className="tabular text-expense mt-0.5 text-lg font-medium">
              {formatAmount(totals.debt, currency)}
            </p>
          </div>
        </div>
      )}

      <label className="text-ink-secondary mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={(event) => setShowInactive(event.target.checked)}
          className="size-4"
        />
        Mostrar inactivas
      </label>

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-4">
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
              <AccountCard
                key={account.id}
                account={account}
                onEdit={() => setEditing(account)}
                onTransfer={() => openTransfer(account.id)}
                onRecalculate={() => void handleRecalculate(account)}
                onRemove={() => void handleRemove(account)}
              />
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

      <TransferModal
        isOpen={isTransferring}
        onClose={() => setIsTransferring(false)}
        accounts={accounts}
        defaultFromId={transferFrom ?? undefined}
      />
    </div>
  )
}

function AccountCard({
  account,
  onEdit,
  onTransfer,
  onRecalculate,
  onRemove,
}: {
  account: Account
  onEdit: () => void
  onTransfer: () => void
  onRecalculate: () => void
  onRemove: () => void
}) {
  const isCredit = isCreditAccount(account.type)
  const debt = creditDebt(account)

  return (
    <li className="border-border bg-surface-raised rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink text-sm font-medium">
            {account.name}
            {!account.isActive && (
              <span className="text-ink-muted font-normal"> · inactiva</span>
            )}
          </p>
          <p className="text-ink-muted mt-0.5 text-xs">
            {ACCOUNT_TYPE_LABELS[account.type]}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {isCredit ? (
            <>
              <p className="text-ink-muted text-xs">Deuda</p>
              <p
                className={`tabular text-lg font-medium ${
                  debt > 0 ? 'text-expense' : 'text-ink'
                }`}
              >
                {formatAmount(debt, account.currency)}
              </p>
            </>
          ) : (
            <p
              className={`tabular text-lg font-medium ${
                account.balance < 0 ? 'text-expense' : 'text-ink'
              }`}
            >
              {formatAmount(account.balance, account.currency)}
            </p>
          )}
        </div>
      </div>

      {isCredit && account.creditLimit != null && <CreditGauge account={account} />}

      <div className="mt-2 flex flex-wrap gap-1">
        <RowAction onClick={onEdit}>Editar</RowAction>
        <RowAction onClick={onTransfer}>{isCredit ? 'Pagar' : 'Transferir'}</RowAction>
        <Link
          to={`/cuentas/${account.id}`}
          className="text-ink-secondary hover:bg-surface-sunken flex min-h-11 items-center rounded-lg px-3 text-sm"
        >
          Movimientos
        </Link>
        <RowAction onClick={onRecalculate}>Recalcular</RowAction>
        <RowAction onClick={onRemove}>Eliminar</RowAction>
      </div>
    </li>
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

  // Eviction del campo `accounts`: la lista se observa con `includeInactive`
  // variable (la caché indexa por ese arg) y el selector de cuenta lo usa en
  // otras páginas. Evictar borra todas las entradas y refresca todas las vistas.
  const [createAccount] = useMutation(CreateAccountMutation, { update: evictAccounts })
  const [updateAccount] = useMutation(UpdateAccountMutation, { update: evictAccounts })

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
