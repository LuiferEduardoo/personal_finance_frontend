import { Select } from '@/components/Select'
import { ACCOUNT_TYPE_LABELS } from './account'
import { useAccounts } from './useAccounts'

type AccountSelectProps = {
  value: string
  onChange: (accountId: string) => void
  /** Etiqueta: "Cuenta" en gastos, "Cuenta destino" en ingresos. */
  label?: string
  error?: string
}

/**
 * Selector de cuenta reutilizable (gasto, ingreso, recurrente). La cuenta es
 * opcional, así que siempre incluye "Sin cuenta".
 */
export function AccountSelect({
  value,
  onChange,
  label = 'Cuenta (opcional)',
  error,
}: AccountSelectProps) {
  const { accounts, loading } = useAccounts()

  return (
    <Select
      label={label}
      value={value}
      disabled={loading}
      error={error}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Sin cuenta</option>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.name} · {ACCOUNT_TYPE_LABELS[account.type]}
        </option>
      ))}
    </Select>
  )
}
