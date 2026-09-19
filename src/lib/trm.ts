export function trmFactor(from: string, to: string, trm: number): number {
  if (from === to) return 1
  if (from === 'USD' && to === 'COP') return trm
  if (from === 'COP' && to === 'USD') return 1 / trm
  throw new Error(`Conversión TRM no soportada: ${from}/${to}`)
}
