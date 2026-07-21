import type { ArticleType, CreateArticleInput } from '@/graphql/generated/graphql'

/**
 * Selección de artículo de un gasto. Los tres estados son excluyentes por
 * construcción, así que el XOR `articleId` / `newArticle` que exige el backend
 * ("Envía solo uno...") no se puede violar desde la UI.
 */
export type ArticleSelection =
  | { mode: 'none' }
  | { mode: 'existing'; articleId: string; label: string }
  | { mode: 'new'; name: string; type: ArticleType; categoryId: string | null }

/**
 * Traduce la selección a los campos de `CreateExpenseInput`. Nunca devuelve
 * `articleId` y `newArticle` a la vez: el tipo discriminado lo impide.
 */
export function buildArticleInput(selection: ArticleSelection): {
  articleId?: string
  newArticle?: CreateArticleInput
} {
  if (selection.mode === 'existing') return { articleId: selection.articleId }
  if (selection.mode === 'new') {
    return {
      newArticle: {
        name: selection.name,
        type: selection.type,
        categoryId: selection.categoryId ?? undefined,
      },
    }
  }
  return {}
}

/** Los enums se muestran traducidos pero se envían con su valor literal. */
export const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
  PRODUCT: 'Producto',
  SERVICE: 'Servicio',
  OTHER: 'Otro',
}

export const ARTICLE_TYPE_OPTIONS = Object.entries(ARTICLE_TYPE_LABELS) as [
  ArticleType,
  string,
][]

/**
 * Precio unitario a partir del importe y la cantidad.
 *
 * El backend lo devuelve calculado tras guardar, pero el formulario lo muestra
 * en vivo. Devuelve `null` si no se puede calcular (cantidad 0 o vacía): un
 * precio "infinito" o un 0 inventado confundirían más que un guion.
 */
export function computeUnitPrice(
  amount: number | undefined,
  quantity: number | undefined,
): number | null {
  if (amount == null || quantity == null) return null
  if (!Number.isFinite(amount) || !Number.isFinite(quantity)) return null
  if (quantity <= 0) return null
  return amount / quantity
}
