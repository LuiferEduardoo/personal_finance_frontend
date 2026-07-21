import { useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { ARTICLE_TYPE_OPTIONS } from '@/features/articles/article'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { ArticleType } from '@/graphql/generated/graphql'
import { formatPeriod } from '@/lib/dates'
import { ArticleInflationQuery } from './articleInflation.queries'
import { RateChart } from './InflationCharts'
import { RateCell, RateTile } from './inflationUi'
import type { InflationFilter } from './ExpenseInflationView'

/**
 * "Inflación real" de precios: cuánto sube el precio unitario de lo que compras,
 * agregado en un índice. Da porcentajes moderados (~IPC), a diferencia de la
 * variación de gasto. Es la query `articleInflation`.
 */
export function PriceInflationView({ filter }: { filter: InflationFilter }) {
  // Filtro propio de esta pestaña: acotar el índice a un tipo de artículo.
  const [type, setType] = useState<ArticleType | ''>('')

  const { data, loading, error } = useQuery(ArticleInflationQuery, {
    variables: { filter: { ...filter, type: type || undefined } },
  })

  const report = data?.articleInflation
  const points = useMemo(() => report?.points ?? [], [report?.points])
  const articles = report?.articles ?? []
  const categories = report?.categories ?? []

  return (
    <>
      <p className="text-ink-secondary text-sm">
        Cuánto suben los <strong className="font-medium">precios</strong> de lo que
        compras (precio por unidad), como un índice. A diferencia de la variación de
        gasto, no se mueve por consumir más o menos.
      </p>

      <label className="text-ink-secondary mt-4 block text-sm sm:max-w-xs">
        Tipo de artículo
        <select
          value={type}
          onChange={(event) => setType(event.target.value as ArticleType | '')}
          className="border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
        >
          <option value="">Todos</option>
          {ARTICLE_TYPE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

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
            description="Hace falta el mismo artículo comprado en meses distintos para medir su precio."
          />
        </div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RateTile
              label="Inflación mensual"
              rate={report?.latestMonthlyRate}
              hint="Índice del último mes frente al anterior"
            />
            <RateTile
              label="Inflación anual"
              rate={report?.latestAnnualRate}
              hint="Índice del último mes frente al del año pasado"
            />
            <RateTile
              label="Promedio mensual"
              rate={report?.averageMonthlyRate}
              hint="Media de la serie"
            />
          </section>

          <section className="mt-8">
            <h2 className="text-ink text-base font-semibold">Índice de precios</h2>
            <p className="text-ink-muted mt-0.5 text-xs">
              La línea se corta en los meses sin variación comparable.
            </p>
            <div className="border-border bg-surface-raised mt-3 rounded-lg border p-3">
              <RateChart data={points} />
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-ink text-base font-semibold">Detalle del índice</h2>
            <div className="border-border mt-3 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="border-border text-ink-secondary border-b">
                  <tr>
                    <th className="px-4 py-2.5 text-xs font-medium">Mes</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium">
                      Artículos
                    </th>
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
                      <td className="tabular text-ink-secondary px-4 py-2.5 text-right">
                        {/* basketSize: cuántos artículos entran en el índice ese mes. */}
                        {point.basketSize}
                      </td>
                      <RateCell rate={point.monthlyRate} />
                      <RateCell rate={point.annualRate} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {articles.length > 0 && (
            <BreakdownTable
              title="Por artículo"
              rows={articles.map((article) => ({
                key: article.articleId ?? article.name ?? 'sin',
                name: article.name ?? 'Sin nombre',
                monthly: article.latestMonthlyRate,
                annual: article.latestAnnualRate,
              }))}
            />
          )}

          {categories.length > 0 && (
            <BreakdownTable
              title="Por categoría"
              rows={categories.map((category) => ({
                // Categoría nula = bucket "sin categoría".
                key: category.categoryId ?? '__sin__',
                name: category.categoryName ?? 'Sin categoría',
                monthly: category.latestMonthlyRate,
                annual: category.latestAnnualRate,
              }))}
            />
          )}
        </>
      )}
    </>
  )
}

function BreakdownTable({
  title,
  rows,
}: {
  title: string
  rows: { key: string; name: string; monthly?: number | null; annual?: number | null }[]
}) {
  return (
    <section className="mt-8">
      <h2 className="text-ink text-base font-semibold">{title}</h2>
      <div className="border-border mt-3 overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-border text-ink-secondary border-b">
            <tr>
              <th className="px-4 py-2.5 text-xs font-medium">Nombre</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium">Mensual</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium">Anual</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="text-ink px-4 py-2.5">{row.name}</td>
                <RateCell rate={row.monthly} />
                <RateCell rate={row.annual} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
