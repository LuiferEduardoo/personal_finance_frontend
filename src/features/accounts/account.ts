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
