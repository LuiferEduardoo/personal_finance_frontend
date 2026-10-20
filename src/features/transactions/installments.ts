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
