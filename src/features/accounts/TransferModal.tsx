import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { Sheet } from '@/components/Sheet'
import { getFirstErrorMessage } from '@/graphql/errors'
import { todayIso } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { creditDebt, isCreditAccount, spendableAmount, type Account } from './account'
import { TransferMutation } from './accounts.queries'

type TransferModalProps = {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
  /** Cuenta origen preseleccionada (desde su card). */
  defaultFromId?: string
}

/**
 * Transferencia entre cuentas, que también sirve para pagar una tarjeta
 * (origen activo → destino crédito reduce la deuda). Valida en cliente lo mismo
 * que el backend, para feedback inmediato.
 */
export function TransferModal({
  isOpen,
  onClose,
  accounts,
  defaultFromId,
}: TransferModalProps) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="Transferir">
      {isOpen && (
        <TransferForm
          key={defaultFromId ?? 'nuevo'}
          accounts={accounts}
          defaultFromId={defaultFromId}
          onDone={onClose}
        />
      )}
    </Sheet>
  )
}

function TransferForm({
  accounts,
  defaultFromId,
  onDone,
}: {
  accounts: Account[]
  defaultFromId?: string
  onDone: () => void
}) {
  const [fromId, setFromId] = useState(defaultFromId ?? accounts[0]?.id ?? '')
  const [toId, setToId] = useState('')
  const [amount, setAmount] = useState<number | undefined>()
  const [occurredOn, setOccurredOn] = useState(todayIso())
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const [transfer, { loading }] = useMutation(TransferMutation, {
    // La respuesta trae ambas cuentas con su balance nuevo → Apollo las
    // normaliza por id en caché. Refrescamos las transferencias por si hay una
    // lista abierta.
    refetchQueries: ['AccountTransfers'],
  })

  const from = accounts.find((account) => account.id === fromId)
  const to = accounts.find((account) => account.id === toId)
  const payingCard = to != null && isCreditAccount(to.type)
  const available = from ? spendableAmount(from) : 0

  const validate = (): string | null => {
    if (!fromId || !toId) return 'Elige las dos cuentas.'
    if (fromId === toId) return 'Las cuentas origen y destino son la misma.'
    if (amount == null || amount <= 0) return 'Introduce un importe mayor que 0.'
    if (from && amount > available) {
      return isCreditAccount(from.type)
        ? `Excede el cupo disponible (${formatAmount(available, from.currency)}).`
        : `Fondos insuficientes (disponible: ${formatAmount(available, from.currency)}).`
    }
    return null
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const error = validate()
    if (error) {
      setFormError(error)
      return
    }
    setFormError(null)
    try {
      await transfer({
        variables: {
          input: {
            fromAccountId: fromId,
            toAccountId: toId,
            amount: amount!,
            occurredOn,
            note: note.trim() || undefined,
          },
        },
      })
      onDone()
    } catch (caught) {
      setFormError(getFirstErrorMessage(caught))
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Select
        label="Desde"
        value={fromId}
        onChange={(event) => setFromId(event.target.value)}
      >
        <option value="">Elige…</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} · {formatAmount(spendableAmount(account), account.currency)}
          </option>
        ))}
      </Select>

      {from && (
        <p className="text-ink-muted -mt-2 text-xs">
          Disponible: {formatAmount(available, from.currency)}
        </p>
      )}

      <Select
        label="Hacia"
        value={toId}
        onChange={(event) => setToId(event.target.value)}
      >
        <option value="">Elige…</option>
        {accounts
          .filter((account) => account.id !== fromId)
          .map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
      </Select>

      {/* Pago de tarjeta: mostrar la deuda y cuánto quedará. */}
      {payingCard && to && (
        <div className="border-border bg-surface-sunken rounded-lg border p-3 text-sm">
          <p className="text-ink font-medium">Pago de tarjeta</p>
          <p className="text-ink-secondary mt-1">
            Deuda actual: {formatAmount(creditDebt(to), to.currency)}
          </p>
          {amount != null && amount > 0 && (
            <p className="text-ink-secondary">
              Quedará: {formatAmount(Math.max(creditDebt(to) - amount, 0), to.currency)}
            </p>
          )}
        </div>
      )}

      <Field
        label="Importe"
        type="number"
        inputMode="decimal"
        step="any"
        min="0"
        placeholder="0"
        value={amount ?? ''}
        onChange={(event) =>
          setAmount(event.target.value === '' ? undefined : Number(event.target.value))
        }
      />

      <Field
        label="Fecha"
        type="date"
        value={occurredOn}
        onChange={(event) => setOccurredOn(event.target.value)}
      />

      <Field
        label="Nota (opcional)"
        placeholder="Pago tarjeta"
        value={note}
        onChange={(event) => setNote(event.target.value)}
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
        <Button type="submit" isLoading={loading} className="flex-1">
          {payingCard ? 'Pagar' : 'Transferir'}
        </Button>
      </div>
    </form>
  )
}
