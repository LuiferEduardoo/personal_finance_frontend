import { AreaSeries, ColorType, createChart, type Time } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import type { DateRange } from './date-range'

type PortfolioPoint = { date: string; totalValue: number }

export function PortfolioValueChart({
  points,
  currency,
  range,
}: {
  points: readonly PortfolioPoint[]
  currency: string
  range: DateRange
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const styles = getComputedStyle(document.documentElement)
    const color = (token: string, fallback: string) =>
      styles.getPropertyValue(token).trim() || fallback
    const ink = color('--color-ink', '#17201b')
    const muted = color('--color-ink-muted', '#68736c')
    const border = color('--color-border', '#dce2de')
    const income = color('--color-income', '#247a4b')
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    })
    const dateFormatter = new Intl.DateTimeFormat('es-CO', {
      ...(range === '5A' || range === 'MAX'
        ? { year: 'numeric' }
        : range === '1A'
          ? { month: 'short', year: '2-digit' }
          : { day: 'numeric', month: 'short' }),
      timeZone: 'UTC',
    })

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 256,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: muted,
        attributionLogo: false,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: border } },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderColor: border,
        timeVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 0,
        tickMarkFormatter: (time: Time) => {
          const iso =
            typeof time === 'string'
              ? time
              : typeof time === 'number'
                ? new Date(time * 1000).toISOString().slice(0, 10)
                : `${time.year}-${String(time.month).padStart(2, '0')}-${String(time.day).padStart(2, '0')}`
          return dateFormatter.format(new Date(`${iso}T00:00:00Z`))
        },
      },
      localization: { priceFormatter: (value: number) => formatter.format(value) },
      crosshair: {
        vertLine: { color: muted, labelBackgroundColor: ink },
        horzLine: { color: muted, labelBackgroundColor: ink },
      },
    })
    const series = chart.addSeries(AreaSeries, {
      lineColor: income,
      topColor: `${income}55`,
      bottomColor: `${income}05`,
      lineWidth: 2,
      priceLineVisible: false,
    })
    series.setData(
      points.map((point) => ({ time: point.date as Time, value: point.totalValue })),
    )
    chart.timeScale().fitContent()

    const observer = new ResizeObserver(([entry]) => {
      if (entry) chart.applyOptions({ width: Math.floor(entry.contentRect.width) })
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
      chart.remove()
    }
  }, [currency, points, range])

  const first = points[0]
  const last = points.at(-1)
  return (
    <figure>
      <div
        ref={containerRef}
        role="img"
        aria-label={`Evolución del valor de la cartera en ${currency}, desde ${first?.date ?? 'el inicio'} hasta ${last?.date ?? 'hoy'}`}
        className="h-64 w-full"
      />
      <figcaption className="sr-only">
        {points.length} valoraciones diarias. Valor inicial {first?.totalValue ?? 0}{' '}
        {currency}; valor final {last?.totalValue ?? 0} {currency}.
      </figcaption>
    </figure>
  )
}
