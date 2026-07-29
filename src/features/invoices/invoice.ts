import type { ArticleSelection } from '@/features/articles/article'
import type { ArticleType, UnitOfMeasure } from '@/graphql/generated/graphql'

/**
 * Análisis de facturas: el único trozo de la API que NO es GraphQL.
 *
 * OJO con los enums: el REST de facturas los escribe en minúscula
 * (`product`, `kg`, `once`) mientras que GraphQL los usa en mayúscula
 * (`PRODUCT`, `KILOGRAM`, `ONCE`). Todo lo que entra se traduce a la forma de
 * GraphQL para poder reutilizar los componentes y etiquetas existentes, y se
 * vuelve a traducir justo al construir el payload.
 */

export type RestArticleType = 'product' | 'service' | 'other'

export type RestUnitOfMeasure =
  'unit' | 'g' | 'kg' | 'ml' | 'l' | 'pack' | 'roll' | 'pair' | 'other'

export type RestRecurrence =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual'

/** Lo que devuelven `/invoices/analyze-image` y `/invoices/analyze-text`. */
export type ExpenseDraft = {
  description: string
  merchant: string | null
  occurredOn: string | null
  currency: string
  /** `null` cuando la factura trae líneas: el importe es la suma de subtotales. */
  amount: number | null
  /** Texto libre, NO un id: hay que emparejarlo con las categorías del usuario. */
  categorySuggestion: string | null
  accountId: null
  items: ExpenseDraftItem[]
}

export type ExpenseDraftItem = {
  newArticle: {
    name: string
    type: RestArticleType
    unit: RestUnitOfMeasure
    brand: string | null
  }
  unitPrice: number
  quantity: number
  description: string | null
}

/** Lo que se envía a `POST /invoices/expense` (sin `userId`: va en el token). */
export type CreateExpensePayload = {
  description: string
  occurredOn: string
  amount?: number
  items?: CreateExpenseItemPayload[]
  currency?: string
  exchangeRate?: number
  categoryId?: string
  accountId?: string
  merchant?: string
  notes?: string
  receiptUrl?: string
  recurrence?: RestRecurrence
}

export type CreateExpenseItemPayload = {
  articleId?: string
  newArticle?: {
    name: string
    type?: RestArticleType
    unit?: RestUnitOfMeasure
    brand?: string
    categoryId?: string
  }
  unitPrice: number
  quantity?: number
  description?: string
}

const ARTICLE_TYPE_FROM_REST: Record<RestArticleType, ArticleType> = {
  product: 'PRODUCT',
  service: 'SERVICE',
  other: 'OTHER',
}

const ARTICLE_TYPE_TO_REST: Record<ArticleType, RestArticleType> = {
  PRODUCT: 'product',
  SERVICE: 'service',
  OTHER: 'other',
}

const UNIT_FROM_REST: Record<RestUnitOfMeasure, UnitOfMeasure> = {
  unit: 'UNIT',
  g: 'GRAM',
  kg: 'KILOGRAM',
  ml: 'MILLILITER',
  l: 'LITER',
  pack: 'PACK',
  roll: 'ROLL',
  pair: 'PAIR',
  other: 'OTHER',
}

const UNIT_TO_REST: Record<UnitOfMeasure, RestUnitOfMeasure> = {
  UNIT: 'unit',
  GRAM: 'g',
  KILOGRAM: 'kg',
  MILLILITER: 'ml',
  LITER: 'l',
  PACK: 'pack',
  ROLL: 'roll',
  PAIR: 'pair',
  OTHER: 'other',
}

/**
 * El valor lo escribe un modelo de lenguaje, así que puede llegar cualquier
 * cosa: un tipo desconocido cae en el más probable en una factura (producto)
 * en lugar de romper la pantalla.
 */
export function articleTypeFromRest(value: string | null | undefined): ArticleType {
  const key = value?.toLowerCase() as RestArticleType | undefined
  return (key && ARTICLE_TYPE_FROM_REST[key]) || 'PRODUCT'
}

export function unitFromRest(value: string | null | undefined): UnitOfMeasure {
  const key = value?.toLowerCase() as RestUnitOfMeasure | undefined
  return (key && UNIT_FROM_REST[key]) || 'UNIT'
}

export function articleTypeToRest(type: ArticleType): RestArticleType {
  return ARTICLE_TYPE_TO_REST[type]
}

export function unitToRest(unit: UnitOfMeasure): RestUnitOfMeasure {
  return UNIT_TO_REST[unit]
}

/**
 * Una línea de la factura en revisión.
 *
 * Reutiliza `ArticleSelection` del gasto manual: el borrador llega siempre en
 * modo `new` (el artículo aún no existe), y el usuario puede cambiarlo a uno
 * del catálogo. El XOR `articleId` / `newArticle` lo garantiza el tipo.
 */
export type InvoiceItemRow = {
  /** Clave estable para React; no se envía. */
  key: string
  article: ArticleSelection
  unitPrice: number | undefined
  quantity: number
  description: string | null
  /** Unidad del artículo nuevo; se muestra y edita aparte de la selección. */
  unit: UnitOfMeasure
}

let counter = 0

function nextKey(): string {
  counter += 1
  return `invoice-item-${counter}`
}

export function newInvoiceItemRow(): InvoiceItemRow {
  return {
    key: nextKey(),
    article: { mode: 'new', name: '', type: 'PRODUCT', categoryId: null },
    unitPrice: undefined,
    quantity: 1,
    description: null,
    unit: 'UNIT',
  }
}

export function rowsFromDraft(draft: ExpenseDraft): InvoiceItemRow[] {
  return draft.items.map((item) => ({
    key: nextKey(),
    article: {
      mode: 'new',
      name: item.newArticle.name,
      type: articleTypeFromRest(item.newArticle.type),
      categoryId: null,
      brand: item.newArticle.brand,
    },
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    description: item.description,
    unit: unitFromRest(item.newArticle.unit),
  }))
}

export function invoiceRowSubtotal(row: InvoiceItemRow): number | null {
  if (row.unitPrice == null || !Number.isFinite(row.unitPrice)) return null
  if (!Number.isFinite(row.quantity)) return null
  return row.unitPrice * row.quantity
}

export function invoiceItemsTotal(rows: InvoiceItemRow[]): number {
  return rows.reduce((sum, row) => sum + (invoiceRowSubtotal(row) ?? 0), 0)
}

/** Lista si tiene artículo (existente o con nombre) y precio. */
export function isInvoiceRowComplete(row: InvoiceItemRow): boolean {
  if (row.unitPrice == null || !Number.isFinite(row.unitPrice)) return false
  if (!(row.quantity > 0)) return false
  if (row.article.mode === 'existing') return true
  return row.article.mode === 'new' && row.article.name.trim().length > 0
}

export type InvoiceFormValues = {
  description: string
  occurredOn: string
  currency: string
  /** Solo se usa cuando la factura no trae líneas. */
  amount?: number
  accountId: string
  categoryId?: string
  merchant?: string
  notes?: string
}

function itemPayload(row: InvoiceItemRow): CreateExpenseItemPayload {
  const base = {
    unitPrice: row.unitPrice ?? 0,
    quantity: row.quantity,
    ...(row.description?.trim() ? { description: row.description.trim() } : {}),
  }

  // Exactamente uno de los dos, nunca ambos: el backend rechaza el resto.
  if (row.article.mode === 'existing') {
    return { ...base, articleId: row.article.articleId }
  }
  const article = row.article.mode === 'new' ? row.article : null
  return {
    ...base,
    newArticle: {
      name: article?.name.trim() ?? '',
      type: articleTypeToRest(article?.type ?? 'PRODUCT'),
      unit: unitToRest(row.unit),
      ...(article?.brand?.trim() ? { brand: article.brand.trim() } : {}),
      ...(article?.categoryId ? { categoryId: article.categoryId } : {}),
    },
  }
}

/**
 * Construye el cuerpo de `POST /invoices/expense`.
 *
 * Con líneas, `amount` se OMITE: el backend lo recalcula como la suma de
 * subtotales y mandarlo solo abre la puerta a que no cuadren. Sin líneas se
 * envía `items: []` y el total escrito a mano.
 */
export function buildExpensePayload(
  values: InvoiceFormValues,
  rows: InvoiceItemRow[],
): CreateExpensePayload {
  const optional = (value: string | undefined | null) => value?.trim() || undefined

  const payload: CreateExpensePayload = {
    description: values.description.trim(),
    occurredOn: values.occurredOn,
    currency: optional(values.currency) ?? 'COP',
    ...(optional(values.accountId) ? { accountId: values.accountId } : {}),
    ...(optional(values.categoryId) ? { categoryId: values.categoryId } : {}),
    ...(optional(values.merchant) ? { merchant: values.merchant?.trim() } : {}),
    ...(optional(values.notes) ? { notes: values.notes?.trim() } : {}),
  }

  if (rows.length === 0) {
    return { ...payload, items: [], amount: values.amount ?? 0 }
  }
  return { ...payload, items: rows.map(itemPayload) }
}

/** Quita acentos y mayúsculas: "Alimentación" y "alimentacion" son lo mismo. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Empareja la sugerencia de categoría (texto libre del modelo) con una
 * categoría real del usuario. Prefiere la coincidencia exacta; si no la hay,
 * acepta que una contenga a la otra ("mercado" → "Mercado y hogar"). Devuelve
 * `null` cuando no hay nada razonable: mejor sin categoría que mal clasificado.
 */
export function matchCategory(
  suggestion: string | null | undefined,
  categories: { id: string; name: string }[],
): string | null {
  if (!suggestion?.trim()) return null
  const target = normalize(suggestion)

  const exact = categories.find((category) => normalize(category.name) === target)
  if (exact) return exact.id

  const partial = categories.find((category) => {
    const name = normalize(category.name)
    return name.includes(target) || target.includes(name)
  })
  return partial?.id ?? null
}
