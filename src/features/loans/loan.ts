import type {
  CreateLoanInput,
  LoanChargeKind,
  LoanChargeMode,
  LoanInstallmentStatus,
  LoanPrepaymentMode,
  LoanQuery,
  LoanRateType,
  LoansQuery,
  LoanStatus,
} from '@/graphql/generated/graphql'

export type LoanSummary = LoansQuery['loans'][number]
export type LoanDetail = LoanQuery['loan']
export type LoanInstallment = LoanDetail['installments'][number]

/** Límites espejados del backend (`LoansService`), en porcentaje para la UI. */
export const MAX_INSTALLMENTS = 600
export const MAX_EFFECTIVE_ANNUAL_PERCENT = 1000
export const MAX_MONTHLY_PERCENT = 100
export const MAX_CHARGE_PERCENT = 100

/** Los enums se muestran traducidos pero se envían con su valor literal. */
export const RATE_TYPE_LABELS: Record<LoanRateType, string> = {
  EFFECTIVE_ANNUAL: 'Efectiva anual (EA)',
  MONTHLY: 'Mensual vencida',
}

/** Sufijo corto para mostrar una tasa junto a su tipo ("24 % EA"). */
export const RATE_TYPE_SUFFIX: Record<LoanRateType, string> = {
  EFFECTIVE_ANNUAL: 'EA',
  MONTHLY: 'mensual',
}

export const CHARGE_KIND_LABELS: Record<LoanChargeKind, string> = {
  INSURANCE: 'Seguro',
  FEE: 'Comisión',
}

export const CHARGE_MODE_LABELS: Record<LoanChargeMode, string> = {
  FIXED: 'Valor fijo por cuota',
  PERCENT_OF_BALANCE: '% mensual sobre el saldo',
}

export const PREPAYMENT_MODE_LABELS: Record<LoanPrepaymentMode, string> = {
  REDUCE_TERM: 'Reducir el plazo',
  REDUCE_PAYMENT: 'Reducir la cuota',
}

export const PREPAYMENT_MODE_HINTS: Record<LoanPrepaymentMode, string> = {
  REDUCE_TERM: 'Mantienes la cuota y terminas de pagar antes.',
  REDUCE_PAYMENT: 'Mantienes el número de cuotas y pagas menos cada mes.',
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  ACTIVE: 'Activo',
  PAID_OFF: 'Saldado',
}

/**
 * Porcentaje de la UI (24) → fracción de la API (0.24). Se redondea para no
 * enviar ruido de float (1.1 / 100 = 0.011000000000000001).
 */
export function percentToFraction(percent: number): number {
  return Math.round((percent / 100) * 1e10) / 1e10
}

/** Fracción de la API (0.24) → porcentaje de la UI (24). */
export function fractionToPercent(fraction: number): number {
  return Math.round(fraction * 100 * 1e8) / 1e8
}

/** "24 %", "1,8 %" — la tasa se guarda como fracción. */
export function formatPercent(fraction: number, locale = 'es-CO'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 4,
  }).format(fraction)
}

/** Tope del porcentaje de tasa según cómo se expresa. */
export function maxRatePercent(rateType: LoanRateType): number {
  return rateType === 'EFFECTIVE_ANNUAL'
    ? MAX_EFFECTIVE_ANNUAL_PERCENT
    : MAX_MONTHLY_PERCENT
}

/** Valor de un cargo para la API: fijo en dinero, porcentual como fracción. */
export function chargeValueForApi(mode: LoanChargeMode, value: number): number {
  return mode === 'PERCENT_OF_BALANCE' ? percentToFraction(value) : value
}

export type LoanProgress = { paid: number; total: number; ratio: number }

/**
 * Cuotas pagadas sobre el total de la tabla actual. Un abono que reduce el
 * plazo acorta la tabla, así que el total sale de las cuotas, no del plazo
 * pactado.
 */
export function loanProgress(loan: {
  installments: ReadonlyArray<{ status: LoanInstallmentStatus }>
}): LoanProgress {
  const total = loan.installments.length
  const paid = loan.installments.filter(
    (installment) => installment.status === 'PAID',
  ).length
  return { paid, total, ratio: total === 0 ? 0 : paid / total }
}

/**
 * El backend solo borra un crédito sin cuotas pagadas ni abonos (y revierte el
 * desembolso). La UI deshabilita el botón en vez de esperar el BAD_REQUEST.
 */
export function canRemoveLoan(loan: {
  installments: ReadonlyArray<{ status: LoanInstallmentStatus }>
  prepayments: ReadonlyArray<unknown>
}): boolean {
  return loanProgress(loan).paid === 0 && loan.prepayments.length === 0
}

export type LoanChargeValues = {
  name: string
  kind: LoanChargeKind
  mode: LoanChargeMode
  /** Dinero por cuota (FIXED) o porcentaje mensual (PERCENT_OF_BALANCE). */
  value: number
}

export type LoanFormValues = {
  name: string
  lender?: string
  principalAmount: number
  currency: string
  rateType: LoanRateType
  /** Porcentaje tal como lo escribe el usuario (24 = 24 %). */
  ratePercent: number
  installmentCount: number
  disbursedOn: string
  firstDueDate?: string
  disbursementAccountId?: string
  paymentAccountId?: string
  categoryId?: string
  charges: LoanChargeValues[]
}

/** Arma `CreateLoanInput`: porcentajes → fracciones y opcionales vacíos fuera. */
export function buildCreateLoanInput(values: LoanFormValues): CreateLoanInput {
  const optional = (value: string | undefined) => value?.trim() || undefined
  return {
    name: values.name.trim(),
    lender: optional(values.lender),
    principalAmount: values.principalAmount,
    currency: values.currency.trim().toUpperCase(),
    rateType: values.rateType,
    rate: percentToFraction(values.ratePercent),
    installmentCount: values.installmentCount,
    disbursedOn: values.disbursedOn,
    firstDueDate: optional(values.firstDueDate),
    disbursementAccountId: optional(values.disbursementAccountId),
    paymentAccountId: optional(values.paymentAccountId),
    categoryId: optional(values.categoryId),
    charges: values.charges.map((charge) => ({
      name: charge.name.trim(),
      kind: charge.kind,
      mode: charge.mode,
      value: chargeValueForApi(charge.mode, charge.value),
    })),
  }
}
