import type { BrokerKind, InvestmentTransactionType } from '@/graphql/generated/graphql'

export const BROKER_LABELS: Record<BrokerKind, string> = {
  BINANCE: 'Binance',
  ETORO: 'eToro',
  INTERACTIVE_BROKERS: 'Interactive Brokers',
  XTB: 'XTB',
  MANUAL: 'Manual',
}

export const TRANSACTION_LABELS: Record<InvestmentTransactionType, string> = {
  BUY: 'Compra',
  SELL: 'Venta',
  DIVIDEND: 'Dividendo',
  INTEREST: 'Interés',
  DEPOSIT: 'Depósito',
  WITHDRAWAL: 'Retiro',
  FEE: 'Comisión',
  TAX: 'Impuesto',
  SPLIT: 'Split',
  TRANSFER_IN: 'Transferencia recibida',
  TRANSFER_OUT: 'Transferencia enviada',
  CURRENCY_EXCHANGE: 'Cambio de moneda',
}

export const TRANSACTION_TYPES = Object.entries(TRANSACTION_LABELS) as [
  InvestmentTransactionType,
  string,
][]
export const INSTRUMENT_TYPES: InvestmentTransactionType[] = [
  'BUY',
  'SELL',
  'SPLIT',
  'TRANSFER_IN',
  'TRANSFER_OUT',
]

export function percent(value: number | null | undefined) {
  return value == null
    ? '—'
    : `${value.toLocaleString('es-CO', { maximumFractionDigits: 2 })} %`
}

export function compactMoney(value: number | null | undefined, currency = 'USD') {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}
