import { useState } from 'react'
import { Field } from '@/components/Field'
import { Money } from '@/components/Money'
import { Select } from '@/components/Select'
import { ArticleField } from '@/features/articles/ArticleField'
import {
  ARTICLE_TYPE_OPTIONS,
  type ArticleSelection,
} from '@/features/articles/article'
import { UNIT_OPTIONS } from '@/features/products/units'
import type { ArticleType, UnitOfMeasure } from '@/graphql/generated/graphql'
import {
  amountsMatch,
  invoiceItemsTotal,
  invoiceRowError,
  invoiceRowSubtotal,
  newInvoiceItemRow,
  type InvoiceItemRow,
} from './invoice'

type InvoiceItemsEditorProps = {
  rows: InvoiceItemRow[]
  onChange: (rows: InvoiceItemRow[]) => void
  currency: string
  /** Líneas del borrador citadas por algún aviso del backend. */
  flaggedLines: Set<number>
  /** Mostrar el error de cada fila (tras un intento de envío). */
  showErrors: boolean
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
  flaggedLines,
  showErrors,
}: InvoiceItemsEditorProps) {
  const patch = (key: string, changes: Partial<InvoiceItemRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...changes } : row)))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink text-sm font-medium">Ítems de la factura</span>
        {rows.length > 0 && (
          <span className="text-ink-secondary inline-flex items-center gap-1 text-sm">
            Total:
            <Money
              amount={invoiceItemsTotal(rows)}
              currency={currency}
              direction="out"
              size="sm"
            />
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
          flagged={row.draftLine != null && flaggedLines.has(row.draftLine)}
          error={showErrors ? invoiceRowError(row) : null}
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
  /** Algún aviso del backend cita esta línea. */
  flagged: boolean
  /** Lo que impide enviarla, o `null`. */
  error: string | null
  onPatch: (changes: Partial<InvoiceItemRow>) => void
  onRemove: () => void
}

function ItemCard({
  row,
  index,
  currency,
  flagged,
  error,
  onPatch,
  onRemove,
}: ItemCardProps) {
  /**
   * Lo que la factura decía antes de ponerse a buscar en el catálogo. Sin esto,
   * abrir el buscador y arrepentirse borraría el nombre que leyó el modelo.
   */
  const [fromInvoice, setFromInvoice] = useState<ArticleSelection | null>(null)

  const subtotal = invoiceRowSubtotal(row)
  // Alias para que TypeScript estreche el modo dentro del JSX.
  const article = row.article
  const missingPrice = row.unitPrice == null
  const lineMismatch =
    subtotal != null && row.lineTotal != null && !amountsMatch(subtotal, row.lineTotal)

  return (
    <div
      className={`rounded-lg border p-3 ${
        error ? 'border-expense' : flagged ? 'border-warning' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-secondary flex flex-wrap items-center gap-2 text-xs font-medium">
          Ítem {index + 1}
          {flagged && (
            // El texto lleva el significado; el color solo lo refuerza.
            <span className="bg-warning/10 text-ink rounded px-1.5 py-0.5">
              Línea {row.draftLine} con aviso
            </span>
          )}
        </span>
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

          <label className="border-border bg-surface-sunken flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3">
            <input
              type="checkbox"
              checked={article.isOneTime ?? false}
              onChange={(event) =>
                onPatch({
                  article: { ...article, isOneTime: event.target.checked },
                })
              }
              className="accent-ink size-4"
            />
            <span>
              <span className="text-ink block text-sm font-medium">Compra única</span>
              <span className="text-ink-muted block text-xs">
                No guardar este artículo en el catálogo.
              </span>
            </span>
          </label>

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

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field
          label="Precio unitario"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder={missingPrice ? 'Escríbelo' : '0'}
          required
          aria-required="true"
          error={error && missingPrice ? error : undefined}
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
        <Field
          label="Descuento"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          className="col-span-2 sm:col-span-1"
          value={row.discount ?? ''}
          onChange={(event) =>
            onPatch({
              discount:
                event.target.value === '' ? undefined : Number(event.target.value),
            })
          }
        />
      </div>

      {error && !missingPrice && (
        <p role="alert" className="text-expense mt-2 text-sm">
          {error}
        </p>
      )}

      {subtotal != null && (
        <p className="text-ink-secondary mt-2 flex flex-wrap items-center gap-1 text-sm">
          Subtotal:
          <Money amount={subtotal} currency={currency} direction="out" size="sm" />
        </p>
      )}
      {row.lineTotal != null && (
        <p className="text-ink-muted mt-1 flex flex-wrap items-center gap-1 text-xs">
          La factura muestra:
          <Money amount={row.lineTotal} currency={currency} direction="out" size="sm" />
          {lineMismatch && <span>(no coincide con el subtotal)</span>}
        </p>
      )}
    </div>
  )
}
