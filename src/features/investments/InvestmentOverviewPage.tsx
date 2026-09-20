import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { getFirstErrorMessage } from '@/graphql/errors'
import { useSession } from '@/features/auth/SessionContext'
import { LatestTrmQuery } from '@/features/settings/trm.queries'
import { trmFactor } from '@/lib/trm'
import type { AllocationDimension } from '@/graphql/generated/graphql'
import { AllocationDonut } from './AllocationDonut'
import {
  DATE_RANGES,
  dateRangeVariables,
  filterPointsByRange,
  type DateRange,
} from './date-range'
import { compactMoney, percent } from './investment-ui'
import { PortfolioValueChart } from './PortfolioValueChart'
import {
  ApplyCorporateActionMutation,
  BenchmarkComparisonQuery,
  InvestmentAllocationQuery,
  InvestmentOverviewQuery,
  InvestmentReturnsQuery,
  RebuildPortfolioSnapshotsMutation,
  RefreshCorporateActionsMutation,
  RefreshInvestmentPricesMutation,
} from './investments.queries'

const DIMENSIONS: [AllocationDimension, string][] = [
  ['ASSET_CLASS', 'Tipo'],
  ['INSTRUMENT', 'Activo'],
  ['BROKER', 'Bróker'],
  ['SECTOR', 'Sector'],
  ['COUNTRY', 'País'],
  ['CURRENCY', 'Moneda'],
]

export function InvestmentOverviewPage() {
  const { user } = useSession()
  const [dimension, setDimension] = useState<AllocationDimension>('ASSET_CLASS')
  const [dateRange, setDateRange] = useState<DateRange>('1A')
  const { data, loading, error, refetch } = useQuery(InvestmentOverviewQuery)
  const trm = useQuery(LatestTrmQuery)
  const allocation = useQuery(InvestmentAllocationQuery, {
    variables: { dimension },
  })
  const latestDate = data?.portfolioEvolution.points.at(-1)?.date
  const period = dateRangeVariables(dateRange, latestDate)
  const periodReturns = useQuery(InvestmentReturnsQuery, {
    variables: period,
  })
  const benchmarks = useQuery(BenchmarkComparisonQuery, {
    variables: { benchmarks: ['SP500', 'NASDAQ100', 'MSCI_WORLD'], ...period },
  })
  const [refreshPrices, prices] = useMutation(RefreshInvestmentPricesMutation)
  const [rebuild, rebuilding] = useMutation(RebuildPortfolioSnapshotsMutation)
  const [refreshActions, actions] = useMutation(RefreshCorporateActionsMutation)
  const [applyAction] = useMutation(ApplyCorporateActionMutation)
  const [notice, setNotice] = useState<string | null>(null)

  const run = async (
    operation: () => Promise<{ data?: Record<string, unknown> | null }>,
  ) => {
    try {
      const result = await operation()
      const value = result.data && Object.values(result.data)[0]
      setNotice(typeof value === 'string' ? value : 'Actualizado correctamente.')
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }

  if (loading || trm.loading)
    return (
      <Page>
        <LoadingRows rows={5} />
      </Page>
    )
  if (error || trm.error || !data || !trm.data)
    return (
      <Page>
        <ErrorState message={getFirstErrorMessage(error ?? trm.error)} />
      </Page>
    )
  const { portfolioSummary: summary } = data
  const latestTrm = trm.data.latestTrm.value
  const displayCurrency = user?.investmentBaseCurrency ?? summary.baseCurrency
  const factor = trmFactor(
    summary.baseCurrency,
    displayCurrency,
    latestTrm,
  )
  const money = (value: number | null | undefined) =>
    compactMoney(value == null ? value : value * factor, displayCurrency)
  const displayFactor = (currency: string) =>
    trmFactor(currency, displayCurrency, latestTrm)
  const positionValues = (position: (typeof data.investmentPositions)[number]) => {
    const marketValue = position.lastPrice == null
      ? null
      : position.quantity * position.lastPrice * displayFactor(position.instrument.currency)
    const costBasis =
      position.quantity * position.averageCost * displayFactor(position.currency)
    return {
      marketValue,
      unrealizedPnl: marketValue == null ? null : marketValue - costBasis,
      unrealizedReturn:
        marketValue == null || costBasis === 0
          ? null
          : (marketValue - costBasis) / costBasis,
    }
  }
  const currentUnrealizedPnl = data.investmentPositions.reduce((total, position) => {
    const value = positionValues(position).unrealizedPnl
    return total + (value ?? 0)
  }, 0)
  const returns =
    periodReturns.data?.portfolioReturns ?? periodReturns.previousData?.portfolioReturns
  const evolutionPoints = filterPointsByRange(
    data.portfolioEvolution.points,
    period.from,
  )
  const lastPoint = evolutionPoints.at(-1)
  const busy = prices.loading || rebuilding.loading || actions.loading

  return (
    <Page>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink-muted text-sm">Cartera al {summary.asOf}</p>
          <h1 className="text-ink text-2xl font-semibold">Resumen de inversiones</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => void run(() => rebuild())}
          >
            Reconstruir
          </Button>
          <Button disabled={busy} onClick={() => void run(() => refreshPrices())}>
            Actualizar precios
          </Button>
        </div>
      </div>
      {notice && (
        <p
          role="status"
          className="border-border bg-surface-raised text-ink-secondary mt-4 rounded-lg border p-3 text-sm"
        >
          {notice}
        </p>
      )}
      {(returns?.isStale || data.portfolioEvolution.isStale) && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Hay operaciones posteriores al último cálculo. Reconstruye la serie para
          actualizar TWR y XIRR.
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-ink font-semibold">Resultados del periodo</h2>
          <p className="text-ink-muted text-xs">
            {period.from && period.to
              ? `${period.from} — ${period.to}`
              : 'Todo el histórico'}
          </p>
        </div>
        <PeriodSelector value={dateRange} onChange={setDateRange} />
      </div>
      <div
        className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-busy={periodReturns.loading}
      >
        <Metric
          label="Valor actual"
          value={money(returns?.endingValue ?? lastPoint?.totalValue)}
        />
        <Metric
          label="Capital aportado"
          value={money(returns?.investedCapital ?? lastPoint?.contributions)}
        />
        <Metric
          label="Ganancia no realizada"
          value={compactMoney(currentUnrealizedPnl, displayCurrency)}
          tone={currentUnrealizedPnl}
        />
        <Metric
          label="Rentabilidad simple"
          value={percent(returns?.simpleReturn)}
          tone={returns?.simpleReturn}
        />
        <Metric label="TWR" value={percent(returns?.twr)} tone={returns?.twr} />
        <Metric
          label="XIRR / MWR"
          value={percent(returns?.xirr)}
          tone={returns?.xirr}
        />
        <Metric
          label="Dividendos"
          value={money(returns?.dividends ?? lastPoint?.dividends)}
        />
        <Metric label="Efectivo" value={money(lastPoint?.cash)} />
      </div>

      <section className="border-border bg-surface-raised mt-5 rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-ink font-semibold">Evolución</h2>
            <p className="text-ink-muted text-xs">Valor total de la cartera</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-ink-muted hidden text-xs sm:inline">
              {data.portfolioEvolution.estimatedDays} días estimados
            </span>
          </div>
        </div>
        {evolutionPoints.length === 0 ? (
          <EmptyState
            title="Sin histórico"
            description="Registra operaciones y actualiza precios para construir la evolución."
          />
        ) : (
          <div className="mt-4">
            <PortfolioValueChart
              points={evolutionPoints.map((point) => ({
                ...point,
                totalValue: point.totalValue * factor,
              }))}
              currency={displayCurrency}
              range={dateRange}
            />
          </div>
        )}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="border-border bg-surface-raised rounded-xl border p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-ink font-semibold">Distribución</h2>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as AllocationDimension)}
              className="border-border bg-surface rounded-lg border px-2 py-2 text-sm"
            >
              {DIMENSIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {allocation.loading ? (
            <div className="mt-4" aria-label="Actualizando distribución">
              <LoadingRows rows={3} />
            </div>
          ) : allocation.error ? (
            <div className="mt-4">
              <ErrorState message={getFirstErrorMessage(allocation.error)} />
            </div>
          ) : allocation.data ? (
            <AllocationDonut
              slices={allocation.data.portfolioAllocation.slices.map((slice) => ({
                ...slice,
                marketValue: slice.marketValue * factor,
              }))}
              currency={displayCurrency}
              total={allocation.data.portfolioAllocation.total * factor}
            />
          ) : null}
        </section>
        <section className="border-border bg-surface-raised rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-ink font-semibold">Acciones pendientes</h2>
              <p className="text-ink-muted text-xs">
                Dividendos y splits sin registrar
              </p>
            </div>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => void run(() => refreshActions())}
            >
              Buscar
            </Button>
          </div>
          {data.pendingCorporateActions.length === 0 ? (
            <p className="text-ink-muted py-8 text-center text-sm">Todo está al día.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.pendingCorporateActions.map((action) => (
                <li key={action.id} className="border-border rounded-lg border p-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="text-ink text-sm font-medium">
                        {action.symbol} ·{' '}
                        {action.type === 'DIVIDEND' ? 'Dividendo' : 'Split'}
                      </p>
                      <p className="text-ink-muted text-xs">
                        {action.exDate} ·{' '}
                        {action.estimatedAmount
                          ? compactMoney(
                              action.estimatedAmount,
                              action.currency ?? summary.baseCurrency,
                            )
                          : `${action.ratioNumerator}:${action.ratioDenominator}`}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        void run(() =>
                          applyAction({
                            variables: {
                              actionId: action.id,
                              accountId: action.accountIds[0]!,
                            },
                          }),
                        )
                      }
                    >
                      Aplicar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="border-border bg-surface-raised mt-5 rounded-xl border p-4">
        <div>
          <h2 className="text-ink font-semibold">Comparación con el mercado</h2>
          <p className="text-ink-muted text-xs">
            TWR normalizado y convertido a {summary.baseCurrency}
          </p>
        </div>
        {benchmarks.loading ? (
          <div className="mt-3">
            <LoadingRows rows={2} />
          </div>
        ) : benchmarks.error ? (
          <p className="text-expense mt-3 text-sm">
            No se pudo construir la comparación.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benchmarks.data?.benchmarkComparison.series.map((series) => (
              <div key={series.key} className="bg-surface-sunken rounded-lg p-3">
                <p className="text-ink-secondary truncate text-xs">{series.label}</p>
                <p
                  className={`tabular mt-1 text-lg font-semibold ${(series.totalReturn ?? 0) >= 0 ? 'text-income' : 'text-expense'}`}
                >
                  {percent(series.totalReturn)}
                </p>
                {series.excessReturn != null && (
                  <p className="text-ink-muted text-xs">
                    {percent(series.excessReturn)} vs. cartera
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {benchmarks.data?.benchmarkComparison.warnings.map((warning) => (
          <p key={warning} className="mt-2 text-xs text-amber-800">
            {warning}
          </p>
        ))}
      </section>

      <section className="border-border bg-surface-raised mt-5 overflow-hidden rounded-xl border">
        <div className="border-border border-b p-4">
          <h2 className="text-ink font-semibold">Posiciones</h2>
          <p className="text-ink-muted text-xs">
            {summary.positionsCount} abiertas · {summary.missingPriceCount} sin precio
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-ink-muted bg-surface-sunken">
              <tr>
                <th className="p-3">Activo</th>
                <th>Cuenta</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Valor</th>
                <th className="p-3 text-right">P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {data.investmentPositions.map((position) => {
                const values = positionValues(position)
                return <tr key={position.id} className="border-border border-t">
                  <td className="p-3">
                    <p className="text-ink font-medium">{position.instrument.symbol}</p>
                    <p className="text-ink-muted text-xs">{position.instrument.name}</p>
                  </td>
                  <td>{position.account.name}</td>
                  <td className="tabular text-right">
                    {position.quantity.toLocaleString('es-CO')}
                  </td>
                  <td className="tabular text-right">
                    {compactMoney(values.marketValue, displayCurrency)}
                  </td>
                  <td
                    className={`tabular p-3 text-right ${(values.unrealizedPnl ?? 0) >= 0 ? 'text-income' : 'text-expense'}`}
                  >
                    {compactMoney(values.unrealizedPnl, displayCurrency)}
                    <p className="text-xs">{percent(values.unrealizedReturn)}</p>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </section>
    </Page>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</div>
}

function PeriodSelector({
  value,
  onChange,
}: {
  value: DateRange
  onChange: (range: DateRange) => void
}) {
  return (
    <div
      className="border-border bg-surface flex rounded-lg border p-0.5"
      role="group"
      aria-label="Periodo de los resultados"
    >
      {DATE_RANGES.map((range) => (
        <button
          key={range.value}
          type="button"
          aria-pressed={value === range.value}
          onClick={() => onChange(range.value)}
          className={`min-h-9 min-w-9 rounded-md px-2 text-xs font-medium transition-colors ${value === range.value ? 'bg-ink text-surface' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'}`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: number | null
}) {
  return (
    <div className="border-border bg-surface-raised rounded-xl border p-3">
      <p className="text-ink-muted text-xs">{label}</p>
      <p
        className={`tabular mt-1 text-lg font-semibold ${tone == null ? 'text-ink' : tone >= 0 ? 'text-income' : 'text-expense'}`}
      >
        {value}
      </p>
    </div>
  )
}
