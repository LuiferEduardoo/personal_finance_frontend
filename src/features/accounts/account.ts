import type { AccountsQuery, PaymentMethodType } from '@/graphql/generated/graphql'

export type Account = AccountsQuery['accounts'][number]

/** Los enums se muestran traducidos pero se envían con su valor literal. */
export const ACCOUNT_TYPE_LABELS: Record<PaymentMethodType, string> = {
  CASH: 'Efectivo',
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  BANK_TRANSFER: 'Transferencia',
  DIGITAL_WALLET: 'Billetera digital',
  OTHER: 'Otro',
}

export const ACCOUNT_TYPE_OPTIONS = Object.entries(ACCOUNT_TYPE_LABELS) as [
  PaymentMethodType,
  string,
][]

/** Los campos de crédito (límite, día de corte, etc.) solo aplican a tarjetas. */
export function isCreditAccount(type: PaymentMethodType): boolean {
  return type === 'CREDIT'
}

/** Campos mínimos para razonar sobre el saldo (sirve para Account y respuestas de transfer). */
type BalanceLike = {
  type: PaymentMethodType
  balance: number
  availableCredit?: number | null
  creditLimit?: number | null
}

/**
 * Deuda de una tarjeta de crédito: el `balance` negativo es lo normal (deuda);
 * el cupo usado es `-balance`. Devuelve 0 si está a favor.
 */
export function creditDebt(account: BalanceLike): number {
  return account.balance < 0 ? -account.balance : 0
}

/**
 * Cuánto se puede gastar/transferir desde la cuenta:
 *   - crédito → `availableCredit` (cupo disponible);
 *   - activo  → `balance`.
 * Es el tope contra el que valida el frontend antes de enviar.
 */
export function spendableAmount(account: BalanceLike): number {
  if (isCreditAccount(account.type)) return account.availableCredit ?? 0
  return account.balance
}
