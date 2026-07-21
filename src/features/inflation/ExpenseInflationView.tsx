import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatPeriod } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { findGaps } from './gaps'
import { ExpenseInflationQuery } from './inflation.queries'
import { RateChart, TotalChart } from './InflationCharts'
import { RateCell, RateTile } from './inflationUi'

export type InflationFilter = {
  from: string
  to: string
  categoryId?: string
}

/**
 * "Variación de gasto": cuánto cambia tu gasto TOTAL mes a mes. Se mueve tanto
 * por los precios como por cuánto consumes, así que da porcentajes grandes y NO
 * es comparable con la inflación de precios. Es el `expenseInflation` de siempre.
 */
export function ExpenseInflationView({
  filter,
  currency,
}: {
  filter: InflationFilter
  currency: string
}) {
  const { data, loading, error } = useQuery(ExpenseInflationQuery, {
    variables: { filter },
  })

  const report = data?.expenseInflation
  const points = useMemo(() => report?.points ?? [], [report?.points])
  const gaps = useMemo(() => findGaps(points.map((point) => point.period)), [points])

  if (loading) return <LoadingRows rows={4} />
  if (error) return <ErrorState message={getFirstErrorMessage(error)} />
  if (points.length === 0) {
    return (
      <EmptyState
        title="Sin datos suficientes"
        description="Necesitas gastos registrados en al menos un mes del periodo."
      />
    )
  }

  return (
    <>
      <p className="text-ink-secondary text-sm">
        Cuánto varía tu <strong className="font-medium">gasto total</strong> mes a mes.
        Se mueve por los precios <em>y</em> por cuánto consumes, así que no es
        comparable con la inflación de precios.
      </p>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <RateTile
          label="Variación mensual"
          rate={report?.latestMonthlyRate}
          hint="Último mes frente al anterior"
        />
        <RateTile
          label="Variación anual"
          rate={report?.latestAnnualRate}
          hint="Último mes frente al mismo mes del año pasado"
        />
        <RateTile
          label="Promedio mensual"
          rate={report?.averageMonthlyRate}
          hint="Media de la serie"
        />
      </section>

      {gaps.length > 0 && (
        <p className="border-warning/40 bg-warning/10 text-ink mt-6 rounded-lg border px-4 py-3 text-sm">
          <strong className="font-medium">Hay meses sin gastos registrados</strong> (
          {gaps.map(formatPeriod).join(', ')}). No aparecen en la serie, y el mes
          siguiente a un hueco no muestra variación porque no hay con qué compararlo.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Gasto por mes</h2>
        <div className="border-border bg-surface-raised mt-3 rounded-lg border p-3">
          <TotalChart data={points} currency={currency} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Variación mensual</h2>
        <p className="text-ink-muted mt-0.5 text-xs">
          La línea se corta en los meses sin variación comparable.
        </p>
        <div className="border-border bg-surface-raised mt-3 rounded-lg border p-3">
          <RateChart data={points} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-ink text-base font-semibold">Detalle</h2>
        <div className="border-border mt-3 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-border text-ink-secondary border-b">
              <tr>
                <th className="px-4 py-2.5 text-xs font-medium">Mes</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium">Gasto</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium">Nº</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium">Mensual</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium">Anual</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {points.map((point) => (
                <tr key={point.period}>
                  <td className="text-ink px-4 py-2.5 whitespace-nowrap">
                    {formatPeriod(point.period)}
                  </td>
                  <td className="tabular text-ink px-4 py-2.5 text-right">
                    {formatAmount(point.total, currency)}
                  </td>
                  <td className="tabular text-ink-secondary px-4 py-2.5 text-right">
                    {point.count}
                  </td>
                  <RateCell rate={point.monthlyRate} />
                  <RateCell rate={point.annualRate} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
