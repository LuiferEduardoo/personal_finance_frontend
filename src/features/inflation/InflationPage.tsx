import { useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { useCategories } from '@/features/categories/useCategories'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatPeriod, subtractMonths, todayIso, toPeriod } from '@/lib/dates'
import { formatAmount, formatRate } from '@/lib/money'
import { findGaps } from './gaps'
import { ExpenseInflationQuery } from './inflation.queries'
import { RateChart, TotalChart } from './InflationCharts'

const RANGES = [
  { months: 5, label: '6 meses' },
  { months: 11, label: '12 meses' },
  { months: 23, label: '24 meses' },
] as const

export function InflationPage() {
  const { user } = useSession()
  const [months, setMonths] = useState<number>(11)
  const [categoryId, setCategoryId] = useState('')

  const { tree } = useCategories('EXPENSE')

  const filter = useMemo(
    () => ({
      from: toPeriod(subtractMonths(todayIso(), months)),
      to: toPeriod(todayIso()),
      categoryId: categoryId || undefined,
    }),
    [months, categoryId],
  )

  const { data, loading, error } = useQuery(ExpenseInflationQuery, {
    variables: { filter },
  })

  const report = data?.expenseInflation
  const points = useMemo(() => report?.points ?? [], [report?.points])
  const gaps = useMemo(() => findGaps(points.map((point) => point.period)), [points])
  const currency = user?.baseCurrency ?? 'COP'

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Inflación personal</h1>
      <p className="text-ink-secondary mt-2 text-sm">
        Mide cuánto varía tu <strong className="font-medium">gasto total</strong> mes a
        mes. Se mueve tanto por los precios como por cuánto consumes, así que no es
        comparable con el IPC.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div
          role="group"
          aria-label="Periodo"
          className="border-border bg-surface-sunken flex gap-1 rounded-lg border p-1"
        >
          {RANGES.map((option) => (
            <button
              key={option.months}
              type="button"
              aria-pressed={months === option.months}
              onClick={() => setMonths(option.months)}
              className={`min-h-10 flex-1 rounded-md px-3 text-sm font-medium whitespace-nowrap ${
                months === option.months
                  ? 'bg-surface-raised text-ink shadow-sm'
                  : 'text-ink-secondary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="text-ink-secondary flex-1 text-sm">
          Categoría
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
          >
            <option value="">Todas</option>
            {tree.map(({ category, depth }) => (
              <option key={category.id} value={category.id}>
                {depth > 0 ? '  ' : ''}
                {category.icon ? `${category.icon} ` : ''}
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-6">
          <LoadingRows rows={4} />
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={getFirstErrorMessage(error)} />
        </div>
      ) : points.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Sin datos suficientes"
            description="Necesitas gastos registrados en al menos un mes del periodo."
          />
        </div>
      ) : (
        <>
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
            // Sin este aviso, dos barras contiguas parecen meses consecutivos.
            <p className="border-warning/40 bg-warning/10 text-ink mt-6 rounded-lg border px-4 py-3 text-sm">
              <strong className="font-medium">Hay meses sin gastos registrados</strong>{' '}
              ({gaps.map(formatPeriod).join(', ')}). No aparecen en la serie, y el mes
              siguiente a un hueco no muestra variación porque no hay con qué
              compararlo.
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
            {/* Vista de tabla: los gráficos con nulos se leen mejor con los
                números al lado, y cubre el caso de lectura no visual. */}
            <div className="border-border mt-3 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="border-border text-ink-secondary border-b">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-medium">Mes</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium">
                      Gasto
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium">Nº</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium">
                      Mensual
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium">
                      Anual
                    </th>
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
      )}
    </div>
  )
}

function RateTile({
  label,
  rate,
  hint,
}: {
  label: string
  rate?: number | null
  hint: string
}) {
  return (
    <div className="border-border bg-surface-raised rounded-lg border p-4">
      <p className="text-ink-secondary text-sm">{label}</p>
      <p className={`tabular mt-1.5 text-2xl font-medium ${rateColor(rate)}`}>
        {formatRate(rate)}
      </p>
      <p className="text-ink-muted mt-1 text-xs">
        {rate == null ? 'Sin periodo con el que comparar' : hint}
      </p>
    </div>
  )
}

function RateCell({ rate }: { rate?: number | null }) {
  return (
    <td className={`tabular px-4 py-2.5 text-right ${rateColor(rate)}`}>
      {formatRate(rate)}
    </td>
  )
}

/**
 * Aquí el rojo/verde va invertido respecto a los importes, y es correcto:
 * que el gasto SUBA es malo, que baje es bueno. El texto siempre lleva el signo
 * (formatRate usa signDisplay), así que el color solo refuerza.
 */
function rateColor(rate?: number | null): string {
  if (rate == null) return 'text-ink-muted'
  if (rate > 0) return 'text-expense'
  if (rate < 0) return 'text-income'
  return 'text-ink-secondary'
}
