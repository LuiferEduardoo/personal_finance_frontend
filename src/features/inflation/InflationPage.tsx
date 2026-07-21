import { useMemo, useState } from 'react'
import { useSession } from '@/features/auth/SessionContext'
import { useCategories } from '@/features/categories/useCategories'
import { subtractMonths, todayIso, toPeriod } from '@/lib/dates'
import { ExpenseInflationView } from './ExpenseInflationView'
import { PriceInflationView } from './PriceInflationView'

const RANGES = [
  { months: 5, label: '6 meses' },
  { months: 11, label: '12 meses' },
  { months: 23, label: '24 meses' },
] as const

const TABS = [
  { id: 'prices', label: 'Precios' },
  { id: 'expense', label: 'Gasto' },
] as const

type TabId = (typeof TABS)[number]['id']

/**
 * Dos métricas que NO deben confundirse, en una sola pantalla con pestañas que
 * comparten periodo y categoría:
 *   - Precios (articleInflation): inflación real, ~IPC.
 *   - Gasto (expenseInflation): variación del gasto total, porcentajes grandes.
 * Con los mismos datos, la primera da ~10% donde la segunda daría cientos de %,
 * por eso van separadas y cada una explica qué mide.
 */
export function InflationPage() {
  const { user } = useSession()
  const [tab, setTab] = useState<TabId>('prices')
  const [months, setMonths] = useState<number>(11)
  const [categoryId, setCategoryId] = useState('')

  const { tree } = useCategories('EXPENSE')
  const currency = user?.baseCurrency ?? 'COP'

  const filter = useMemo(
    () => ({
      from: toPeriod(subtractMonths(todayIso(), months)),
      to: toPeriod(todayIso()),
      categoryId: categoryId || undefined,
    }),
    [months, categoryId],
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Inflación</h1>

      <div
        role="tablist"
        aria-label="Tipo de inflación"
        className="border-border bg-surface-sunken mt-4 flex gap-1 rounded-lg border p-1"
      >
        {TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            onClick={() => setTab(option.id)}
            className={`min-h-10 flex-1 rounded-md text-sm font-medium ${
              tab === option.id
                ? 'bg-surface-raised text-ink shadow-sm'
                : 'text-ink-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Filtros compartidos por ambas pestañas. */}
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

      <div className="mt-6">
        {tab === 'prices' ? (
          <PriceInflationView filter={filter} />
        ) : (
          <ExpenseInflationView filter={filter} currency={currency} />
        )}
      </div>
    </div>
  )
}
