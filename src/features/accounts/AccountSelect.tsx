import { Select } from '@/components/Select'
import { formatAmount } from '@/lib/money'
import { isCreditAccount, spendableAmount, type Account } from './account'
import { useAccounts } from './useAccounts'

type AccountSelectProps = {
  value: string
  onChange: (accountId: string) => void
  /** Etiqueta: "Cuenta" en gastos, "Cuenta destino" en ingresos. */
  label?: string
  error?: string
  /** Notifica la cuenta elegida (para validar cupo en el formulario de gasto). */
  onAccountChange?: (account: Account | null) => void
}

/**
 * Selector de cuenta reutilizable (gasto, ingreso, recurrente). La cuenta es
 * opcional, así que siempre incluye "Sin cuenta". Muestra el saldo (o el cupo
 * disponible en tarjetas) para elegir con contexto.
 */
export function AccountSelect({
  value,
  onChange,
  label = 'Cuenta (opcional)',
  error,
  onAccountChange,
}: AccountSelectProps) {
  const { accounts, loading } = useAccounts()

  const handleChange = (accountId: string) => {
    onChange(accountId)
    onAccountChange?.(accounts.find((account) => account.id === accountId) ?? null)
  }

  return (
    <Select
      label={label}
      value={value}
      disabled={loading}
      error={error}
      onChange={(event) => handleChange(event.target.value)}
    >
      <option value="">Sin cuenta</option>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.name} ·{' '}
          {isCreditAccount(account.type)
            ? `cupo ${formatAmount(spendableAmount(account), account.currency)}`
            : formatAmount(account.balance, account.currency)}
        </option>
      ))}
    </Select>
  )
}
