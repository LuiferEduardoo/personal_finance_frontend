/** La TRM es la tasa oficial USD/COP: fuera de ese par no aplica. */
export function supportsTrm(from: string, to: string): boolean {
  return (from === 'USD' && to === 'COP') || (from === 'COP' && to === 'USD')
}

export function trmFactor(from: string, to: string, trm: number): number {
  if (from === to) return 1
  if (from === 'USD' && to === 'COP') return trm
  if (from === 'COP' && to === 'USD') return 1 / trm
  throw new Error(`Conversión TRM no soportada: ${from}/${to}`)
}

/**
 * `fxRate` es la tasa hacia la moneda base, no la TRM: un depósito en COP con
 * base USD la lleva como 1/TRM, del orden de 0,00024. Nadie registra un
 * depósito pensando en ese número, así que el formulario pide la TRM del día y
 * la conversión ocurre aquí. Sin redondeos: recortar decimales de 1/TRM mueve
 * el importe convertido de forma apreciable.
 */
export function fxRateFromTrm(
  trm: number,
  currency: string,
  baseCurrency: string,
): number | null {
  if (!(trm > 0)) return null
  if (currency === baseCurrency) return 1
  if (!supportsTrm(currency, baseCurrency)) return null
  return trmFactor(currency, baseCurrency, trm)
}

/** Inversa de `fxRateFromTrm`, para reabrir una operación ya guardada. */
export function trmFromFxRate(
  fxRate: number | null | undefined,
  currency: string,
  baseCurrency: string,
): number | null {
  if (fxRate == null || !(fxRate > 0)) return null
  if (currency === baseCurrency) return null
  if (!supportsTrm(currency, baseCurrency)) return null
  return currency === 'COP' ? 1 / fxRate : fxRate
}
