import { useQuery } from '@apollo/client'
import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Money } from '@/components/Money'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { BudgetAlertBanner } from '@/features/budgets/BudgetAlertBanner'
import { directionOf } from '@/features/transactions/types'
import { useTransactions } from '@/features/transactions/useTransactions'
import { getFirstErrorMessage } from '@/graphql/errors'
import { endOfMonth, formatDate, startOfMonth, todayIso, toPeriod } from '@/lib/dates'
import { toBaseCurrency } from '@/lib/money'
import { LatestTrmQuery } from '@/features/settings/trm.queries'
import { CategoryBreakdown } from './CategoryBreakdown'
import { MonthlyChart } from './MonthlyChart'
import { StatTile } from './StatTile'
import { periodRange, type DashboardPeriod } from './period'
import { monthlySeries, summarize, totalsByCategory } from './summary'

const RANGES = [
  { months: 0, label: 'Este mes' },
  { months: 5, label: '6 meses' },
  { months: 11, label: '12 meses' },
] as const

/** Cuántas categorías se ven antes de agrupar el resto en "Otras". */
const CATEGORY_LIMIT = 8

const inputClass =
  'border-border bg-surface-raised text-ink focus:border-ink mt-1 min-h-11 w-full rounded-lg border px-3 text-base outline-none'

type DashboardCurrency = 'COP' | 'USD'

export function DashboardPage() {
  const { user } = useSession()
  const today = todayIso()
  const [period, setPeriod] = useState<DashboardPeriod>({ mode: 'recent', months: 5 })
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [currency, setCurrency] = useState<DashboardCurrency>(() =>
    user?.financeBaseCurrency === 'USD' ? 'USD' : 'COP',
  )
  const trm = useQuery(LatestTrmQuery)

  const range = useMemo(() => periodRange(period, today), [period, today])

  const { transactions, loading, error } = useTransactions('ALL', range)

  const usdCopRate = trm.data?.latestTrm.value ?? null
  const baseCurrency = user?.baseCurrency === 'USD' ? 'USD' : 'COP'
  const conversionFactor = useMemo(() => {
    if (currency === baseCurrency) return 1
    if (!usdCopRate) return 1
    return baseCurrency === 'COP' ? 1 / usdCopRate : usdCopRate
  }, [baseCurrency, currency, usdCopRate])

  const summary = useMemo(
    () => summarize(transactions, conversionFactor),
    [conversionFactor, transactions],
  )
  const monthly = useMemo(
    () => monthlySeries(transactions, conversionFactor),
    [conversionFactor, transactions],
  )
  const byCategory = useMemo(
    () => totalsByCategory(transactions, conversionFactor),
    [conversionFactor, transactions],
  )
  const recent = useMemo(() => transactions.slice(0, 5), [transactions])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-ink text-2xl font-semibold">
          Hola{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div
            role="group"
            aria-label="Moneda del dashboard"
            className="border-border bg-surface-sunken flex gap-1 rounded-lg border p-1"
          >
            {(['COP', 'USD'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={currency === option}
                onClick={() => setCurrency(option)}
                className={`min-h-10 rounded-md px-3 text-sm font-medium ${
                  currency === option
                    ? 'bg-surface-raised text-ink shadow-sm'
                    : 'text-ink-secondary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Periodo"
            className="border-border bg-surface-sunken flex flex-wrap gap-1 rounded-lg border p-1"
          >
            {RANGES.map((option) => (
              <PeriodButton
                key={option.months}
                pressed={period.mode === 'recent' && period.months === option.months}
                onClick={() => setPeriod({ mode: 'recent', months: option.months })}
              >
                {option.label}
              </PeriodButton>
            ))}
            <PeriodButton
              pressed={period.mode === 'month'}
              onClick={() => setPeriod({ mode: 'month', month: toPeriod(today) })}
            >
              Mes
            </PeriodButton>
            <PeriodButton
              pressed={period.mode === 'range'}
              onClick={() =>
                setPeriod({
                  mode: 'range',
                  from: startOfMonth(today),
                  to: endOfMonth(today),
                })
              }
            >
              Rango
            </PeriodButton>
          </div>
        </div>
      </div>

      {period.mode === 'month' && (
        <div className="mt-3 flex justify-end">
          <label className="text-ink-secondary w-full text-sm sm:w-56">
            Mes
            <input
              type="month"
              value={period.month}
              max={toPeriod(today)}
              onChange={(event) =>
                // Borrar el campo deja el valor vacío: se ignora para no
                // consultar un periodo inválido.
                event.target.value &&
                setPeriod({ mode: 'month', month: event.target.value })
              }
              className={inputClass}
            />
          </label>
        </div>
      )}

      {period.mode === 'range' && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:ml-auto sm:max-w-md">
          <label className="text-ink-secondary text-sm">
            Desde
            <input
              type="date"
              value={period.from}
              onChange={(event) =>
                event.target.value && setPeriod({ ...period, from: event.target.value })
              }
              className={inputClass}
            />
          </label>
          <label className="text-ink-secondary text-sm">
            Hasta
            <input
              type="date"
              value={period.to}
              onChange={(event) =>
                event.target.value && setPeriod({ ...period, to: event.target.value })
              }
              className={inputClass}
            />
          </label>
        </div>
      )}

      <p className="text-ink-muted mt-3 text-right text-xs">
        {formatDate(range.from)} – {formatDate(range.to)}
      </p>

      <BudgetAlertBanner />

      {currency !== baseCurrency && usdCopRate && (
        <p className="text-ink-muted mt-3 text-right text-xs">
          TRM oficial: 1 USD = {usdCopRate.toLocaleString('es-CO')} COP · vigencia{' '}
          {trm.data?.latestTrm.validFrom}
        </p>
      )}

      {loading ? (
        <div className="mt-6">
          <LoadingRows rows={5} />
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={getFirstErrorMessage(error)} />
        </div>
      ) : currency !== baseCurrency && !usdCopRate ? (
        <div className="mt-6">
          <EmptyState
            title="Agrega la tasa USD/COP"
            description="Necesitamos la tasa de cambio para convertir los valores sin alterar tus datos."
          />
        </div>
      ) : transactions.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Aún no hay movimientos"
            description="Registra tu primer gasto o ingreso para ver el resumen."
          />
        </div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile
              label="Ingresos"
              amount={summary.income}
              currency={currency}
              direction="in"
            />
            <StatTile
              label="Gastos"
              amount={summary.expense}
              currency={currency}
              direction="out"
            />
            <StatTile
              label="Balance"
              amount={summary.balance}
              currency={currency}
              // El balance cambia de dirección con su signo: en negativo es
              // dinero que salió de más, y se pinta como gasto.
              direction={summary.balance >= 0 ? 'in' : 'out'}
              hint={summary.balance >= 0 ? 'A favor' : 'Gastaste más de lo que entró'}
            />
          </section>

          <section className="mt-8">
            <h2 className="text-ink text-base font-semibold">Evolución mensual</h2>
            <p className="text-ink-muted mt-0.5 text-xs">
              Los meses sin movimientos no aparecen en la serie.
            </p>
            <div className="border-border bg-surface-raised mt-3 rounded-lg border p-3">
              <MonthlyChart data={monthly} currency={currency} />
            </div>
          </section>

          {byCategory.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-ink text-base font-semibold">
                  Gasto por categoría
                </h2>
                <Link to="/inflacion" className="text-ink-secondary text-sm underline">
                  Ver inflación
                </Link>
              </div>
              <div className="border-border bg-surface-raised mt-3 rounded-lg border p-4">
                <CategoryBreakdown
                  data={byCategory}
                  currency={currency}
                  limit={showAllCategories ? byCategory.length : CATEGORY_LIMIT}
                />
                {byCategory.length > CATEGORY_LIMIT && (
                  <button
                    type="button"
                    aria-expanded={showAllCategories}
                    onClick={() => setShowAllCategories((shown) => !shown)}
                    className="text-ink-secondary hover:bg-surface-sunken mt-4 min-h-11 w-full rounded-lg text-sm font-medium underline"
                  >
                    {showAllCategories
                      ? 'Ver menos'
                      : `Ver todas (${byCategory.length})`}
                  </button>
                )}
              </div>
            </section>
          )}

          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-ink text-base font-semibold">Últimos movimientos</h2>
              <Link to="/movimientos" className="text-ink-secondary text-sm underline">
                Ver todos
              </Link>
            </div>
            <ul className="border-border divide-border bg-surface-raised mt-3 divide-y rounded-lg border">
              {recent.map((transaction) => (
                <li
                  key={`${transaction.kind}-${transaction.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-ink truncate text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-ink-muted text-xs">
                      {formatDate(transaction.occurredOn)}
                    </p>
                  </div>
                  <Money
                    amount={
                      toBaseCurrency(transaction.amount, transaction.exchangeRate) *
                      conversionFactor
                    }
                    currency={currency}
                    direction={directionOf(transaction.kind)}
                    size="sm"
                  />
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}

type PeriodButtonProps = {
  pressed: boolean
  onClick: () => void
  children: ReactNode
}

function PeriodButton({ pressed, onClick, children }: PeriodButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-10 rounded-md px-3 text-sm font-medium ${
        pressed ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-secondary'
      }`}
    >
      {children}
    </button>
  )
}
