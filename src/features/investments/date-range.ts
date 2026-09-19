export type DateRange = '1D' | '5D' | '1M' | '1A' | '5A' | 'MAX'

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '1M', label: '1M' },
  { value: '1A', label: '1A' },
  { value: '5A', label: '5A' },
  { value: 'MAX', label: 'Max' },
]

export function dateRangeVariables(range: DateRange, latestDate?: string) {
  if (range === 'MAX' || !latestDate) return { from: undefined, to: undefined }
  const to = new Date(`${latestDate}T00:00:00Z`)
  const from = new Date(to)
  if (range === '5D') from.setUTCDate(from.getUTCDate() - 4)
  if (range === '1M') from.setUTCMonth(from.getUTCMonth() - 1)
  if (range === '1A') from.setUTCFullYear(from.getUTCFullYear() - 1)
  if (range === '5A') from.setUTCFullYear(from.getUTCFullYear() - 5)
  return { from: from.toISOString().slice(0, 10), to: latestDate }
}

export function filterPointsByRange<T extends { date: string }>(
  points: readonly T[],
  from?: string,
) {
  return from ? points.filter((point) => point.date >= from) : points
}
