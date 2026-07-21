import { formatAmount } from '@/lib/money'
import type { CategoryTotal } from './summary'

type CategoryBreakdownProps = {
  data: CategoryTotal[]
  currency: string
  /** Más allá de esto, el resto se agrupa en "Otras". */
  limit?: number
}

/**
 * Gasto por categoría en barras horizontales de un solo tono.
 *
 * No es un donut multicolor, a propósito:
 *   - las categorías son identidad nominal; colorearlas gastaría el canal de
 *     color repitiendo lo que la longitud de la barra ya dice;
 *   - los cuatro colores semánticos están reservados, así que una paleta
 *     categórica competiría visualmente con ellos;
 *   - en 375px las etiquetas de un donut no caben; aquí sí;
 *   - un donut se vuelve ilegible pasadas 6 categorías. Esto escala a 20.
 *
 * Se construye con divs, no con Recharts: son barras proporcionales con
 * etiqueta, no necesitan ejes ni escalas.
 */
export function CategoryBreakdown({
  data,
  currency,
  limit = 8,
}: CategoryBreakdownProps) {
  if (data.length === 0) return null

  const visible = data.slice(0, limit)
  const rest = data.slice(limit)

  const rows =
    rest.length > 0
      ? [
          ...visible,
          {
            categoryId: '__otras__',
            name: `Otras (${rest.length})`,
            total: rest.reduce((sum, entry) => sum + entry.total, 0),
          },
        ]
      : visible

  // La escala se ancla al mayor valor, no al total: así la barra más larga
  // llena la fila y las diferencias entre categorías se aprecian.
  const max = Math.max(...rows.map((row) => row.total))

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.categoryId ?? row.name}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-ink min-w-0 truncate">{row.name}</span>
            <span className="tabular text-ink-secondary shrink-0">
              {formatAmount(row.total, currency)}
            </span>
          </div>
          <div className="bg-surface-sunken mt-1.5 h-2 overflow-hidden rounded-full">
            <div
              className="bg-neutral h-full rounded-full"
              style={{ width: `${max > 0 ? (row.total / max) * 100 : 0}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
