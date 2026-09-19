import { compactMoney, percent } from './investment-ui'

type Slice = {
  key: string
  label: string
  marketValue: number
  percentage: number
}

const COLORS = [
  'var(--color-income)',
  'var(--color-neutral)',
  'var(--color-warning)',
  'var(--color-expense)',
  'var(--color-ink-secondary)',
  'var(--color-ink-muted)',
]

export function AllocationDonut({
  slices,
  currency,
  total,
}: {
  slices: readonly Slice[]
  currency: string
  total: number
}) {
  let offset = 0

  return (
    <div className="mt-4 grid items-center gap-5 sm:grid-cols-[11rem_1fr]">
      <figure className="relative mx-auto size-44">
        <svg
          viewBox="0 0 42 42"
          role="img"
          aria-label={`Distribución de una cartera valorada en ${compactMoney(total, currency)}`}
          className="size-full -rotate-90"
        >
          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            stroke="var(--color-surface-sunken)"
            strokeWidth="7"
          />
          {slices.map((slice, index) => {
            const currentOffset = offset
            offset += slice.percentage
            return (
              <circle
                key={slice.key}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="7"
                strokeDasharray={`${Math.max(0, slice.percentage)} ${Math.max(0, 100 - slice.percentage)}`}
                strokeDashoffset={-currentOffset}
              />
            )
          })}
        </svg>
        <figcaption className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-ink-muted text-[0.625rem] uppercase">Total</span>
          <span className="text-ink max-w-24 truncate text-sm font-semibold">
            {compactMoney(total, currency)}
          </span>
        </figcaption>
      </figure>

      <ul className="space-y-2">
        {slices.map((slice, index) => (
          <li
            key={slice.key}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-sm"
          >
            <span
              aria-hidden="true"
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-ink min-w-0 truncate">{slice.label}</span>
            <span className="tabular text-ink-secondary">
              {percent(slice.percentage)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
