export type InstallmentPreview = {
  regularPayment: number
  totalAmount: number
  totalInterest: number
}

const fromCents = (value: number) => value / 100

/** Replica el redondeo del backend para que la vista previa no prometa otro total. */
export function installmentPreview(
  principal: number,
  installmentCount: number,
  monthlyRate: number,
): InstallmentPreview {
  if (principal <= 0 || installmentCount < 1 || monthlyRate < 0) {
    return { regularPayment: 0, totalAmount: 0, totalInterest: 0 }
  }

  const principalCents = Math.round(principal * 100)
  const rawPayment =
    monthlyRate === 0
      ? principalCents / installmentCount
      : (principalCents * monthlyRate * (1 + monthlyRate) ** installmentCount) /
        ((1 + monthlyRate) ** installmentCount - 1)
  const regularPaymentCents = Math.round(rawPayment)
  let remainingCents = principalCents
  let totalCents = 0

  for (let index = 0; index < installmentCount; index += 1) {
    const interestCents = Math.round(remainingCents * monthlyRate)
    const principalForPeriod =
      index === installmentCount - 1
        ? remainingCents
        : Math.min(remainingCents, regularPaymentCents - interestCents)
    totalCents += principalForPeriod + interestCents
    remainingCents -= principalForPeriod
  }

  return {
    regularPayment: fromCents(regularPaymentCents),
    totalAmount: fromCents(totalCents),
    totalInterest: fromCents(totalCents - principalCents),
  }
}

/** Lo que el formulario necesita de una cuota para editar su compra completa. */
type InstallmentPurchase = {
  planDescription: string
  planPrincipalAmount: number
  purchaseDate: string
  installmentCount: number
  monthlyRate: number
}

export type InstallmentPurchaseDefaults = {
  description: string
  amount: number
  occurredOn: string
  installmentCount: number
  monthlyInterestRatePercent: number
}

/**
 * Valores iniciales al editar una compra a cuotas: `updateExpense` sobre
 * cualquiera de sus cuotas edita el plan entero, así que el formulario parte
 * del plan (descripción base sin " (n/N)", capital sin intereses y fecha de
 * compra), no de la cuota.
 */
export function installmentPurchaseDefaults(
  installment: InstallmentPurchase,
): InstallmentPurchaseDefaults {
  return {
    description: installment.planDescription,
    amount: installment.planPrincipalAmount,
    occurredOn: installment.purchaseDate,
    installmentCount: installment.installmentCount,
    // 0.025 * 100 = 2.5000000000000004: se redondea para no mostrar ruido de float.
    monthlyInterestRatePercent: Math.round(installment.monthlyRate * 100 * 1e6) / 1e6,
  }
}

/**
 * Cupo que puede usar la compra editada. El backend revierte primero el total
 * financiado de la cuenta anterior y luego valida el nuevo, así que si la
 * cuenta no cambia el total actual vuelve a estar disponible.
 */
export function installmentEditCredit(
  available: number,
  sameAccount: boolean,
  currentTotal: number,
): number {
  return sameAccount ? available + currentTotal : available
}
