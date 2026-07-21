import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useChartTheme } from '@/lib/chartTheme'
import { formatPeriod, formatPeriodShort } from '@/lib/dates'
import { formatAmount, formatRate } from '@/lib/money'

export type InflationPoint = {
  period: string
  total: number
  count: number
  monthlyRate?: number | null
  annualRate?: number | null
}

/** Lo mínimo que necesita RateChart: sirve tanto para la variación de gasto
 *  como para el índice de precios. */
export type RatePoint = {
  period: string
  monthlyRate?: number | null
}

/**
 * DOS gráficos, no uno con dos ejes.
 *
 * El total está en pesos y la variación en porcentaje: en un mismo gráfico
 * harían falta dos escalas Y, y entonces dos alturas iguales significarían
 * cosas distintas. Separarlos es la única lectura honesta.
 */

export function TotalChart({
  data,
  currency,
}: {
  data: InflationPoint[]
  currency: string
}) {
  const theme = useChartTheme()

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid
            vertical={false}
            stroke={theme['--color-border']}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="period"
            tickFormatter={formatPeriodShort}
            interval={data.length > 8 ? 1 : 0}
            tickLine={false}
            axisLine={{ stroke: theme['--color-border'] }}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value: number) => compactNumber(value)}
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme['--color-border'], opacity: 0.3 }}
            contentStyle={tooltipStyle(theme)}
            labelFormatter={(period) =>
              typeof period === 'string' ? formatPeriod(period) : period
            }
            formatter={(value) => [
              typeof value === 'number' ? formatAmount(value, currency) : String(value),
              'Gasto del mes',
            ]}
          />
          <Bar
            dataKey="total"
            fill={theme['--color-expense']}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RateChart({ data }: { data: RatePoint[] }) {
  const theme = useChartTheme()

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid
            vertical={false}
            stroke={theme['--color-border']}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="period"
            tickFormatter={formatPeriodShort}
            interval={data.length > 8 ? 1 : 0}
            tickLine={false}
            axisLine={{ stroke: theme['--color-border'] }}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value: number) =>
              `${value > 0 ? '+' : ''}${value.toFixed(0)}%`
            }
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          {/* El cero es la referencia: por encima el gasto sube, por debajo baja. */}
          <ReferenceLine y={0} stroke={theme['--color-ink-muted']} strokeWidth={1} />
          <Tooltip
            contentStyle={tooltipStyle(theme)}
            labelFormatter={(period) =>
              typeof period === 'string' ? formatPeriod(period) : period
            }
            formatter={(value) => [
              typeof value === 'number' ? formatRate(value) : '—',
              'Variación mensual',
            ]}
          />
          <Line
            type="monotone"
            dataKey="monthlyRate"
            stroke={theme['--color-neutral']}
            strokeWidth={2}
            dot={{ r: 4, fill: theme['--color-neutral'] }}
            // connectNulls en false (el defecto) es DELIBERADO: un mes sin
            // variación comparable rompe la línea en vez de trazar un tramo
            // recto que insinuaría una tendencia inexistente.
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function tooltipStyle(theme: Record<string, string>) {
  return {
    backgroundColor: theme['--color-surface-raised'],
    border: `1px solid ${theme['--color-border']}`,
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  }
}

function compactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`
  return String(value)
}
