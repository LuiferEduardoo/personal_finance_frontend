import { useState } from 'react'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { ArticleField } from '@/features/articles/ArticleField'
import {
  ARTICLE_TYPE_OPTIONS,
  type ArticleSelection,
} from '@/features/articles/article'
import { UNIT_OPTIONS } from '@/features/products/units'
import type { ArticleType, UnitOfMeasure } from '@/graphql/generated/graphql'
import { formatAmount } from '@/lib/money'
import {
  invoiceItemsTotal,
  invoiceRowSubtotal,
  newInvoiceItemRow,
  type InvoiceItemRow,
} from './invoice'

type InvoiceItemsEditorProps = {
  rows: InvoiceItemRow[]
  onChange: (rows: InvoiceItemRow[]) => void
  currency: string
}

/**
 * Líneas leídas de la factura, editables antes de confirmar.
 *
 * Cada línea llega como artículo NUEVO (el modelo solo sabe lo que pone el
 * ticket). El usuario puede corregir nombre, tipo, unidad, precio y cantidad, o
 * vincularla a un artículo del catálogo — reutilizando el mismo buscador del
 * gasto manual, que es quien garantiza el XOR `articleId` / `newArticle`.
 */
export function InvoiceItemsEditor({
  rows,
  onChange,
  currency,
}: InvoiceItemsEditorProps) {
  const patch = (key: string, changes: Partial<InvoiceItemRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...changes } : row)))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink text-sm font-medium">Ítems de la factura</span>
        {rows.length > 0 && (
          <span className="tabular text-ink-secondary text-sm">
            Total: {formatAmount(invoiceItemsTotal(rows), currency)}
          </span>
        )}
      </div>

      {rows.length === 0 && (
        <p className="text-ink-muted text-sm">
          La factura no trae líneas: escribe el importe total arriba.
        </p>
      )}

      {rows.map((row, index) => (
        <ItemCard
          key={row.key}
          row={row}
          index={index}
          currency={currency}
          onPatch={(changes) => patch(row.key, changes)}
          onRemove={() => onChange(rows.filter((other) => other.key !== row.key))}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...rows, newInvoiceItemRow()])}
        className="border-border text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg border border-dashed text-sm"
      >
        + Añadir ítem
      </button>
    </div>
  )
}

type ItemCardProps = {
  row: InvoiceItemRow
  index: number
  currency: string
  onPatch: (changes: Partial<InvoiceItemRow>) => void
  onRemove: () => void
}

function ItemCard({ row, index, currency, onPatch, onRemove }: ItemCardProps) {
  /**
   * Lo que la factura decía antes de ponerse a buscar en el catálogo. Sin esto,
   * abrir el buscador y arrepentirse borraría el nombre que leyó el modelo.
   */
  const [fromInvoice, setFromInvoice] = useState<ArticleSelection | null>(null)

  const subtotal = invoiceRowSubtotal(row)
  // Alias para que TypeScript estreche el modo dentro del JSX.
  const article = row.article

  return (
    <div className="border-border rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-secondary text-xs font-medium">Ítem {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-ink-secondary hover:text-ink text-sm underline"
        >
          Quitar
        </button>
      </div>

      {article.mode === 'new' ? (
        <div className="mt-2 flex flex-col gap-3">
          <Field
            label="Artículo"
            placeholder="Leche entera"
            value={article.name}
            onChange={(event) =>
              onPatch({ article: { ...article, name: event.target.value } })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Tipo"
              value={article.type}
              onChange={(event) =>
                onPatch({
                  article: { ...article, type: event.target.value as ArticleType },
                })
              }
            >
              {ARTICLE_TYPE_OPTIONS.map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </Select>

            <Select
              label="Unidad"
              value={row.unit}
              onChange={(event) =>
                onPatch({ unit: event.target.value as UnitOfMeasure })
              }
            >
              {UNIT_OPTIONS.map(([unit, label]) => (
                <option key={unit} value={unit}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          {article.brand && (
            <p className="text-ink-muted text-xs">Marca leída: {article.brand}</p>
          )}

          <button
            type="button"
            onClick={() => {
              setFromInvoice(article)
              onPatch({ article: { mode: 'none' } })
            }}
            className="text-ink-secondary hover:text-ink self-start text-sm underline"
          >
            Vincular a un artículo del catálogo
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <ArticleField
            value={article}
            onChange={(next) => onPatch({ article: next })}
          />
          {fromInvoice && (
            <button
              type="button"
              onClick={() => {
                onPatch({ article: fromInvoice })
                setFromInvoice(null)
              }}
              className="text-ink-secondary hover:text-ink self-start text-sm underline"
            >
              Volver al artículo de la factura
            </button>
          )}
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Field
          label="Precio unitario"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          value={row.unitPrice ?? ''}
          onChange={(event) =>
            onPatch({
              unitPrice:
                event.target.value === '' ? undefined : Number(event.target.value),
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
          onChange={(event) => onPatch({ quantity: Number(event.target.value) })}
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
}
