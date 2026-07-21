/** Un movimiento entra o sale. El signo es parte del dato, no del estilo. */
export type MoneyDirection = 'in' | 'out'

/**
 * Convierte un importe a la moneda base del usuario.
 * El backend expone `exchangeRate` justo para esto; los totales y las
 * comparativas siempre deben usar el valor convertido, nunca `amount` a secas.
 */
export function toBaseCurrency(amount: number, exchangeRate?: number | null): number {
  return amount * (exchangeRate ?? 1)
}

/**
 * Formatea un importe sin signo. `Intl` ya localiza separadores y símbolo, así
 * que no reimplementamos el formato de moneda a mano.
 */
export function formatAmount(
  amount: number,
  currency: string,
  locale = 'es-CO',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    // Los pesos colombianos no usan decimales; el euro y el dólar sí. Dejamos
    // que Intl decida en vez de fijar 0 o 2 a ciegas.
    maximumFractionDigits: undefined,
  }).format(Math.abs(amount))
}

/**
 * Formatea un importe con signo explícito (+ / −).
 *
 * Usa el menos tipográfico U+2212, no el guion ASCII: se alinea con los dígitos
 * y no se confunde con un separador.
 */
export function formatSignedAmount(
  amount: number,
  currency: string,
  direction: MoneyDirection,
  locale = 'es-CO',
): string {
  const sign = direction === 'in' ? '+' : '−'
  return `${sign}${formatAmount(amount, currency, locale)}`
}

/** Formatea una variación porcentual; `null` cuando no hay con qué comparar. */
export function formatRate(rate: number | null | undefined, locale = 'es-CO'): string {
  // El backend devuelve null cuando falta el periodo de comparación. Mostrar
  // «0 %» ahí sería inventarse un dato.
  if (rate == null) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    signDisplay: 'exceptZero',
    maximumFractionDigits: 1,
  }).format(rate / 100)
}
