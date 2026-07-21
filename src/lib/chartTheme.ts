import { useEffect, useState } from 'react'

/**
 * Recharts pinta con atributos SVG (`fill`, `stroke`), no con clases, así que
 * los colores tienen que llegarle como strings. En vez de duplicar los hex —
 * que se desincronizarían del CSS a la primera— se leen del DOM las mismas
 * variables que definen los tokens.
 */
const CHART_TOKENS = [
  '--color-income',
  '--color-expense',
  '--color-warning',
  '--color-neutral',
  '--color-border',
  '--color-ink-muted',
  '--color-ink-secondary',
  '--color-surface-raised',
] as const

type ChartToken = (typeof CHART_TOKENS)[number]
export type ChartTheme = Record<ChartToken, string>

function readTheme(): ChartTheme {
  const styles = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    CHART_TOKENS.map((token) => [token, styles.getPropertyValue(token).trim()]),
  ) as ChartTheme
}

/**
 * Colores actuales del tema, recalculados cuando cambia el modo claro/oscuro.
 *
 * Sin esto, un gráfico montado en claro conservaría los colores claros tras
 * cambiar a oscuro, porque los valores ya están inyectados en el SVG.
 */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(readTheme)

  useEffect(() => {
    const update = () => setTheme(readTheme())

    // Cambio de preferencia del sistema.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', update)

    // Cambio del interruptor manual, que estampa data-theme en <html>.
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return theme
}
