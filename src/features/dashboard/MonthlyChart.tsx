import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatPeriod, formatPeriodShort } from '@/lib/dates'
import { useChartTheme } from '@/lib/chartTheme'
import { formatAmount } from '@/lib/money'
import type { MonthlyPoint } from './summary'

type MonthlyChartProps = {
  data: MonthlyPoint[]
  currency: string
}

/**
 * Ingresos y gastos por mes, en barras agrupadas.
 *
 * Un solo eje Y: ambas series son dinero en la misma moneda, así que comparten
 * escala. Un segundo eje haría que dos alturas iguales significaran cantidades
 * distintas.
 */
export function MonthlyChart({ data, currency }: MonthlyChartProps) {
  const theme = useChartTheme()

  // En móvil hay sitio para pocas etiquetas; el resto se omiten en vez de
  // solaparse. Con muchos meses se muestra uno de cada dos.
  const tickInterval = data.length > 6 ? 1 : 0

  return (
    <div className="h-64 w-full sm:h-72">
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
            interval={tickInterval}
            tickLine={false}
            axisLine={{ stroke: theme['--color-border'] }}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          <YAxis
            // Miles y millones abreviados: "4.500.000" en el eje no cabe en móvil.
            tickFormatter={(value: number) => compactNumber(value)}
            tickLine={false}
            axisLine={false}
            width={44}
            tick={{ fill: theme['--color-ink-muted'], fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: theme['--color-border'], opacity: 0.3 }}
            contentStyle={{
              backgroundColor: theme['--color-surface-raised'],
              border: `1px solid ${theme['--color-border']}`,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
            // Recharts tipa estos callbacks con ReactNode/ValueType, así que
            // se normaliza en vez de forzar el tipo con un cast.
            labelFormatter={(period) =>
              typeof period === 'string' ? formatPeriod(period) : period
            }
            formatter={(value, name) => [
              typeof value === 'number' ? formatAmount(value, currency) : String(value),
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '0.8125rem', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          {/* radius redondea solo el extremo del dato, no la base. */}
          <Bar
            dataKey="income"
            name="Ingresos"
            fill={theme['--color-income']}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="expense"
            name="Gastos"
            fill={theme['--color-expense']}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function compactNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}k`
  return String(value)
}
