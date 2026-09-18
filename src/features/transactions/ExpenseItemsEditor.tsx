import { Field } from '@/components/Field'
import { ArticleField } from '@/features/articles/ArticleField'
import { formatAmount } from '@/lib/money'
import { itemsTotal, newItemRow, rowSubtotal, type ItemRow } from './items'

type ExpenseItemsEditorProps = {
  rows: ItemRow[]
  onChange: (rows: ItemRow[]) => void
  currency: string
}

/**
 * Editor de la lista de ítems de un gasto. Cada fila es un artículo (con su tipo
 * y opción de crear) + precio unitario + cantidad; el subtotal se calcula solo.
 * Cuando hay ítems, el importe del gasto es la suma de subtotales (lo muestra el
 * formulario padre como solo lectura).
 */
export function ExpenseItemsEditor({
  rows,
  onChange,
  currency,
}: ExpenseItemsEditorProps) {
  const patch = (key: string, changes: Partial<ItemRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...changes } : row)))

  const remove = (key: string) => onChange(rows.filter((row) => row.key !== key))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink text-sm font-medium">Ítems</span>
        {rows.length > 0 && (
          <span className="tabular text-ink-secondary text-sm">
            Total: {formatAmount(itemsTotal(rows), currency)}
          </span>
        )}
      </div>

      {rows.map((row, index) => {
        const subtotal = rowSubtotal(row)
        return (
          <div key={row.key} className="border-border rounded-lg border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-secondary text-xs font-medium">
                Ítem {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(row.key)}
                className="text-ink-secondary hover:text-ink text-sm underline"
              >
                Quitar
              </button>
            </div>

            <div className="mt-2">
              <ArticleField
                value={row.article}
                onChange={(article) => patch(row.key, { article })}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field
                label="Precio unitario"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0"
                value={row.unitPrice ?? ''}
                onChange={(event) =>
                  patch(row.key, {
                    unitPrice:
                      event.target.value === ''
                        ? undefined
                        : Number(event.target.value),
                  })
                }
              />
              <Field
                label="Cantidad"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={row.quantity}
                onChange={(event) =>
                  patch(row.key, { quantity: Number(event.target.value) })
                }
              />
              <Field
                label="Descuento"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                max={(row.unitPrice ?? 0) * row.quantity}
                placeholder="0"
                value={row.discount}
                onChange={(event) =>
                  patch(row.key, {
                    discount:
                      event.target.value === '' ? 0 : Number(event.target.value),
                  })
                }
              />
            </div>

            {subtotal != null && (
              <p className="text-ink-secondary mt-2 text-sm">
                Subtotal:{' '}
                <span className="tabular text-ink font-medium">
                  {formatAmount(subtotal, currency)}
                </span>
              </p>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => onChange([...rows, newItemRow()])}
        className="border-border text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg border border-dashed text-sm"
      >
        + Añadir ítem
      </button>
    </div>
  )
}
