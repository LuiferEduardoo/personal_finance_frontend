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
  /** Total impreso en la factura. Solo sirve para cuadrar contra la suma de líneas. */
  total: number | null
  /** Categoría sugerida por el clasificador: un id real de categoría, o `null`. */
  categoryId: string | null
  /**
   * @deprecated Usa `categoryId`. Texto libre, NO un id: solo se empareja con
   * las categorías del usuario cuando no llega `categoryId`.
   */
  categorySuggestion: string | null
  accountId: null
  items: ExpenseDraftItem[]
  /** Avisos en español cuando una línea o el total no cuadran. Se muestran tal cual. */
  warnings: string[]
}

export type ExpenseDraftItem = {
  newArticle: {
    name: string
    type: RestArticleType
    unit: RestUnitOfMeasure
    brand: string | null
    /** Categoría sugerida para el artículo nuevo (id), o `null`. */
    categoryId: string | null
  }
  /** `null` si la factura no traía ni precio unitario ni total de línea. */
  unitPrice: number | null
  quantity: number
  /** Descuento en importe sobre la línea, o `null`. */
  discount: number | null
  /** Total impreso de la línea; solo para cuadrar, no se envía. */
  lineTotal: number | null
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
    isOneTime?: boolean
  }
  unitPrice: number
  quantity?: number
  /** Descuento en importe sobre `unitPrice * quantity`. */
  discount?: number
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
  /** Descuento en importe sobre la línea; `undefined` = sin descuento. */
  discount: number | undefined
  description: string | null
  /** Unidad del artículo nuevo; se muestra y edita aparte de la selección. */
  unit: UnitOfMeasure
  /**
   * Número de línea (1-based) en el borrador original, o `null` si la añadió
   * el usuario. Los `warnings` del backend citan la línea por ese número
   * ("Línea 2 (...)"), y sigue valiendo aunque se quiten filas.
   */
  draftLine: number | null
  /** Total impreso de la línea, para compararlo con el subtotal; no se envía. */
  lineTotal: number | null
}

let counter = 0

function nextKey(): string {
  counter += 1
  return `invoice-item-${counter}`
}

export function newInvoiceItemRow(): InvoiceItemRow {
  return {
    key: nextKey(),
    article: {
      mode: 'new',
      name: '',
      type: 'PRODUCT',
      categoryId: null,
      isOneTime: false,
    },
    unitPrice: undefined,
    quantity: 1,
    discount: undefined,
    description: null,
    unit: 'UNIT',
    draftLine: null,
    lineTotal: null,
  }
}

export function rowsFromDraft(draft: ExpenseDraft): InvoiceItemRow[] {
  return draft.items.map((item, index) => ({
    key: nextKey(),
    article: {
      mode: 'new',
      name: item.newArticle.name,
      type: articleTypeFromRest(item.newArticle.type),
      // La sugerencia del clasificador viaja con el artículo NUEVO; si el
      // usuario lo vincula al catálogo, el modo `existing` ya no la lleva.
      categoryId: item.newArticle.categoryId,
      brand: item.newArticle.brand,
      isOneTime: false,
    },
    // `null` = la factura no lo mostraba: campo vacío y obligatorio.
    unitPrice: item.unitPrice ?? undefined,
    quantity: item.quantity,
    discount: item.discount ?? undefined,
    description: item.description,
    unit: unitFromRest(item.newArticle.unit),
    draftLine: index + 1,
    lineTotal: item.lineTotal,
  }))
}

function isNumber(value: number | undefined): value is number {
  return value != null && Number.isFinite(value)
}

/** `unitPrice * quantity - discount`, la misma fórmula que usa el backend. */
export function invoiceRowSubtotal(row: InvoiceItemRow): number | null {
  if (!isNumber(row.unitPrice)) return null
  if (!Number.isFinite(row.quantity)) return null
  const discount = isNumber(row.discount) ? row.discount : 0
  return row.unitPrice * row.quantity - discount
}

export function invoiceItemsTotal(rows: InvoiceItemRow[]): number {
  return rows.reduce((sum, row) => sum + (invoiceRowSubtotal(row) ?? 0), 0)
}

/**
 * Primer problema que impide enviar la fila, o `null` si está lista. El
 * descuento no puede superar el bruto: el backend lo rechaza con una
 * restricción de Postgres, cuyo mensaje no debe llegar al usuario.
 */
export function invoiceRowError(row: InvoiceItemRow): string | null {
  if (row.article.mode === 'none') return 'Elige un artículo del catálogo.'
  if (row.article.mode === 'new' && !row.article.name.trim()) {
    return 'Escribe el nombre del artículo.'
  }
  if (!isNumber(row.unitPrice)) return 'Escribe el precio unitario.'
  if (row.unitPrice < 0) return 'El precio unitario no puede ser negativo.'
  if (!(row.quantity > 0)) return 'La cantidad debe ser mayor que 0.'
  if (row.discount != null) {
    if (!Number.isFinite(row.discount) || row.discount < 0) {
      return 'El descuento no puede ser negativo.'
    }
    if (row.discount > row.unitPrice * row.quantity) {
      return 'El descuento no puede superar precio × cantidad.'
    }
  }
  return null
}

/** Lista si tiene artículo (existente o con nombre), precio y descuento válido. */
export function isInvoiceRowComplete(row: InvoiceItemRow): boolean {
  return invoiceRowError(row) === null
}

/**
 * ¿Cuadran dos importes? Misma holgura que el backend: la mayor entre 1 y el
 * 0,5 % del esperado, para absorber redondeos sin tapar errores de lectura.
 */
export function amountsMatch(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= Math.max(1, Math.abs(expected) * 0.005)
}

/**
 * Líneas del borrador que citan los avisos ("Línea 3 (...)": ...). Sirve para
 * resaltar la fila; el texto del aviso se muestra siempre completo arriba.
 */
export function warningLines(warnings: string[]): Set<number> {
  const lines = new Set<number>()
  for (const warning of warnings) {
    const match = /^L[ií]nea (\d+)\b/.exec(warning)
    if (match?.[1]) lines.add(Number(match[1]))
  }
  return lines
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
    ...(row.discount != null && row.discount > 0 ? { discount: row.discount } : {}),
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
      ...(article?.isOneTime ? { isOneTime: true } : {}),
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
