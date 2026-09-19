import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Money } from '@/components/Money'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { directionOf } from '@/features/transactions/types'
import { useTransactions } from '@/features/transactions/useTransactions'
import { getFirstErrorMessage } from '@/graphql/errors'
import { endOfMonth, formatDate, subtractMonths, todayIso } from '@/lib/dates'
import { toBaseCurrency } from '@/lib/money'
import { CategoryBreakdown } from './CategoryBreakdown'
import { MonthlyChart } from './MonthlyChart'
import { StatTile } from './StatTile'
import { monthlySeries, summarize, totalsByCategory } from './summary'

const RANGES = [
  { months: 0, label: 'Este mes' },
  { months: 5, label: '6 meses' },
  { months: 11, label: '12 meses' },
] as const

type DashboardCurrency = 'COP' | 'USD'

const USD_COP_RATE_KEY = 'kairos.dashboard.usd-cop-rate'

function savedUsdCopRate(): number | null {
  const value = Number(globalThis.localStorage?.getItem(USD_COP_RATE_KEY))
  return Number.isFinite(value) && value > 0 ? value : null
}

export function DashboardPage() {
  const { user } = useSession()
  const [months, setMonths] = useState<number>(5)
  const [currency, setCurrency] = useState<DashboardCurrency>(() =>
    user?.baseCurrency === 'USD' ? 'USD' : 'COP',
  )
  const [customUsdCopRate, setCustomUsdCopRate] = useState<number | null>(
    savedUsdCopRate,
  )

  const today = todayIso()
  const range = useMemo(
    () => ({ from: subtractMonths(today, months), to: endOfMonth(today) }),
    [today, months],
  )

  const { transactions, loading, error } = useTransactions('ALL', range)

  const inferredUsdCopRate = useMemo(() => {
    const usdMovement = transactions.find(
      (transaction) => transaction.currency === 'USD' && transaction.exchangeRate > 0,
    )
    return usdMovement?.exchangeRate ?? null
  }, [transactions])
  const usdCopRate = customUsdCopRate ?? inferredUsdCopRate
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
            className="border-border bg-surface-sunken flex gap-1 rounded-lg border p-1"
          >
            {RANGES.map((option) => (
              <button
                key={option.months}
                type="button"
                aria-pressed={months === option.months}
                onClick={() => setMonths(option.months)}
                className={`min-h-10 rounded-md px-3 text-sm font-medium ${
                  months === option.months
                    ? 'bg-surface-raised text-ink shadow-sm'
                    : 'text-ink-secondary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currency !== baseCurrency && (
        <label className="text-ink-muted mt-3 flex flex-wrap items-center justify-end gap-2 text-xs">
          1 USD =
          <input
            type="number"
            min="0.000001"
            step="0.01"
            aria-label="Tasa de cambio de dólar a peso colombiano"
            value={usdCopRate ?? ''}
            placeholder="Tasa USD/COP"
            onChange={(event) => {
              const rate = Number(event.target.value)
              const nextRate = Number.isFinite(rate) && rate > 0 ? rate : null
              setCustomUsdCopRate(nextRate)
              if (nextRate) localStorage.setItem(USD_COP_RATE_KEY, String(nextRate))
              else localStorage.removeItem(USD_COP_RATE_KEY)
            }}
            className="border-border bg-surface-raised text-ink h-9 w-28 rounded-md border px-2 text-right text-sm"
          />
          COP
        </label>
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
                <CategoryBreakdown data={byCategory} currency={currency} />
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
