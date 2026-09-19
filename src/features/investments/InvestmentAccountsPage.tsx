import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useConfirm } from '@/components/ConfirmDialog'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  BrokerKind,
  InvestmentAccountsQuery as AccountsData,
} from '@/graphql/generated/graphql'
import { BROKER_LABELS, compactMoney } from './investment-ui'
import {
  CreateInvestmentAccountMutation,
  DeleteInvestmentAccountMutation,
  InvestmentAccountsQuery,
  RebuildInvestmentPositionsMutation,
  UpdateInvestmentAccountMutation,
} from './investments.queries'

type Account = AccountsData['investmentAccounts'][number]
const BROKERS = Object.entries(BROKER_LABELS) as [BrokerKind, string][]

export function InvestmentAccountsPage() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const { data, loading, error, refetch } = useQuery(InvestmentAccountsQuery, {
    variables: { includeInactive },
  })
  const [remove] = useMutation(DeleteInvestmentAccountMutation)
  const [rebuild] = useMutation(RebuildInvestmentPositionsMutation)
  const { confirm, dialog } = useConfirm()

  const removeAccount = async (account: Account) => {
    if (!(await confirm({ title: `¿Eliminar “${account.name}”?` }))) return
    try {
      await remove({ variables: { id: account.id } })
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }
  const rebuildAccount = async (id: string) => {
    try {
      await rebuild({ variables: { accountId: id } })
      setNotice('Posiciones, lotes y efectivo recalculados.')
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-ink-muted text-sm">Inversiones</p>
          <h1 className="text-ink text-2xl font-semibold">Cuentas de inversión</h1>
        </div>
        <Button onClick={() => setCreating(true)}>Nueva cuenta</Button>
      </div>
      <label className="text-ink-secondary mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(e) => setIncludeInactive(e.target.checked)}
          className="size-4"
        />
        Mostrar inactivas
      </label>
      {notice && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {notice}
        </p>
      )}
      <div className="mt-4">
        {loading ? (
          <LoadingRows rows={4} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : !data?.investmentAccounts.length ? (
          <EmptyState
            title="Sin cuentas de inversión"
            description="Crea una cuenta manual o conéctala después con tu bróker."
            action={<Button onClick={() => setCreating(true)}>Crear cuenta</Button>}
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.investmentAccounts.map((account) => (
              <li
                key={account.id}
                className="border-border bg-surface-raised rounded-xl border p-4"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-ink font-medium">{account.name}</p>
                    <p className="text-ink-muted text-xs">
                      {BROKER_LABELS[account.broker]} · {account.currency}
                      {!account.isActive && ' · Inactiva'}
                    </p>
                  </div>
                  <span className="bg-surface-sunken text-ink-secondary h-fit rounded-full px-2 py-1 text-xs">
                    {account.connectionId ? 'Conectada' : 'Manual'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  <RowAction onClick={() => setEditing(account)}>Editar</RowAction>
                  <RowAction onClick={() => void rebuildAccount(account.id)}>
                    Recalcular
                  </RowAction>
                  <RowAction danger onClick={() => void removeAccount(account)}>
                    Eliminar
                  </RowAction>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data?.investmentCashBalances.length ? (
        <section className="border-border bg-surface-raised mt-5 rounded-xl border p-4">
          <h2 className="text-ink font-semibold">Efectivo consolidado</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {data.investmentCashBalances.map((cash) => (
              <div
                key={cash.currency}
                className="bg-surface-sunken rounded-lg px-4 py-3"
              >
                <p className="text-ink-muted text-xs">{cash.currency}</p>
                <p className="tabular text-ink font-medium">
                  {compactMoney(cash.amount, cash.currency)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <Sheet
        isOpen={creating || !!editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
        title={editing ? 'Editar cuenta' : 'Nueva cuenta'}
      >
        {(creating || editing) && (
          <AccountForm
            account={editing ?? undefined}
            onDone={async () => {
              setCreating(false)
              setEditing(null)
              await refetch()
            }}
          />
        )}
      </Sheet>
      {dialog}
    </div>
  )
}

function AccountForm({
  account,
  onDone,
}: {
  account?: Account
  onDone: () => Promise<void>
}) {
  const [name, setName] = useState(account?.name ?? '')
  const [broker, setBroker] = useState<BrokerKind>(account?.broker ?? 'MANUAL')
  const [currency, setCurrency] = useState(account?.currency ?? 'USD')
  const [active, setActive] = useState(account?.isActive ?? true)
  const [message, setMessage] = useState<string | null>(null)
  const [create, creating] = useMutation(CreateInvestmentAccountMutation)
  const [update, updating] = useMutation(UpdateInvestmentAccountMutation)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (account)
        await update({
          variables: {
            input: {
              id: account.id,
              name,
              broker,
              currency: currency.toUpperCase(),
              isActive: active,
            },
          },
        })
      else
        await create({
          variables: { input: { name, broker, currency: currency.toUpperCase() } },
        })
      await onDone()
    } catch (caught) {
      setMessage(getFirstErrorMessage(caught))
    }
  }
  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <Field
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label className="block text-sm">
        <span className="text-ink-secondary mb-1 block">Bróker</span>
        <select
          value={broker}
          onChange={(e) => setBroker(e.target.value as BrokerKind)}
          className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
        >
          {BROKERS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Moneda principal"
        value={currency}
        maxLength={3}
        onChange={(e) => setCurrency(e.target.value)}
        required
      />
      {account && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Cuenta activa
        </label>
      )}
      {message && <ErrorState message={message} />}
      <Button type="submit" disabled={creating.loading || updating.loading}>
        {account ? 'Guardar cambios' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
function RowAction({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover:bg-surface-sunken min-h-10 rounded-lg px-3 text-sm ${danger ? 'text-expense' : 'text-ink-secondary'}`}
    >
      {children}
    </button>
  )
}
