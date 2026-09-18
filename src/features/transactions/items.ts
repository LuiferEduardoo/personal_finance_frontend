import { buildArticleInput, type ArticleSelection } from '@/features/articles/article'
import type { ExpenseItemInput } from '@/graphql/generated/graphql'
import type { TransactionItem } from './types'

/** Una fila del editor de ítems del gasto (estado local del formulario). */
export type ItemRow = {
  /** Clave estable para React; no se envía al backend. */
  key: string
  article: ArticleSelection
  unitPrice: number | undefined
  quantity: number
  discount: number
}

let counter = 0
export function newItemRow(): ItemRow {
  counter += 1
  return {
    key: `item-${counter}`,
    article: { mode: 'none' },
    unitPrice: undefined,
    quantity: 1,
    discount: 0,
  }
}

/** Reconstruye las filas al editar un gasto existente. */
export function rowsFromItems(items: TransactionItem[]): ItemRow[] {
  return items.map((item) => {
    counter += 1
    const article: ArticleSelection =
      item.articleId && item.articleName
        ? {
            mode: 'existing',
            articleId: item.articleId,
            label: item.articleName,
            type: item.articleType ?? 'PRODUCT',
          }
        : { mode: 'none' }
    return {
      key: `item-${counter}`,
      article,
      unitPrice: item.unitPrice ?? undefined,
      quantity: item.quantity,
      discount: item.discount,
    }
  })
}

/** Subtotal de una fila, o `null` si aún no se puede calcular. */
export function rowSubtotal(row: ItemRow): number | null {
  if (row.unitPrice == null || !Number.isFinite(row.unitPrice)) return null
  if (!Number.isFinite(row.quantity)) return null
  return Math.max(0, row.unitPrice * row.quantity - row.discount)
}

export function itemsTotal(rows: ItemRow[]): number {
  return rows.reduce((sum, row) => sum + (rowSubtotal(row) ?? 0), 0)
}

/** Una fila está lista si tiene artículo y precio. */
export function isRowComplete(row: ItemRow): boolean {
  return (
    row.article.mode !== 'none' &&
    row.unitPrice != null &&
    row.quantity > 0 &&
    row.discount >= 0 &&
    row.discount <= row.unitPrice * row.quantity
  )
}

/**
 * Traduce las filas a `ExpenseItemInput[]`. Cada ítem lleva su artículo
 * (articleId o newArticle, nunca ambos: lo garantiza `buildArticleInput`) más
 * precio y cantidad.
 */
export function buildItemsInput(rows: ItemRow[]): ExpenseItemInput[] {
  // Solo se llama tras validar `isRowComplete`, así que unitPrice está definido.
  return rows.map((row) => ({
    ...buildArticleInput(row.article),
    unitPrice: row.unitPrice ?? 0,
    quantity: row.quantity,
    discount: row.discount,
  }))
}
