import { apiFetch, ApiError } from '@/api/http'
import type {
  CreateExpensePayload,
  ExpenseDraft,
  ExpenseDraftItem,
  RestArticleType,
  RestUnitOfMeasure,
} from './invoice'

/** Límites del endpoint de imagen; se validan en cliente para no subir en balde. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/** Mensaje de error, o `null` si la imagen sirve. */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Formato no admitido. Usa una imagen JPEG, PNG o WEBP.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'La imagen pesa más de 10 MB. Haz la foto con menos resolución.'
  }
  return null
}

/**
 * El borrador lo escribe un modelo de lenguaje: puede faltar cualquier campo o
 * venir con un tipo inesperado. Se normaliza al entrar para que el formulario
 * de revisión trabaje siempre con la misma forma.
 */
function normalizeDraft(raw: unknown): ExpenseDraft {
  const draft = (raw ?? {}) as Partial<ExpenseDraft>
  const items = Array.isArray(draft.items) ? draft.items : []

  return {
    description: typeof draft.description === 'string' ? draft.description : '',
    merchant: typeof draft.merchant === 'string' ? draft.merchant : null,
    occurredOn: typeof draft.occurredOn === 'string' ? draft.occurredOn : null,
    currency:
      typeof draft.currency === 'string' && draft.currency ? draft.currency : 'COP',
    amount: numberOrNull(draft.amount),
    total: numberOrNull(draft.total),
    categoryId: idOrNull(draft.categoryId),
    categorySuggestion:
      typeof draft.categorySuggestion === 'string' ? draft.categorySuggestion : null,
    accountId: null,
    items: items.map(normalizeItem),
    warnings: Array.isArray(draft.warnings)
      ? draft.warnings.filter(
          (warning): warning is string => typeof warning === 'string',
        )
      : [],
  }
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function positiveOrNull(value: unknown): number | null {
  const number = numberOrNull(value)
  return number != null && number > 0 ? number : null
}

function idOrNull(value: unknown): string | null {
  return typeof value === 'string' && value ? value : null
}

function normalizeItem(raw: unknown): ExpenseDraftItem {
  const item = (raw ?? {}) as Partial<ExpenseDraftItem>
  const article = (item.newArticle ?? {}) as Partial<ExpenseDraftItem['newArticle']>

  return {
    newArticle: {
      name: typeof article.name === 'string' ? article.name : '',
      type: (article.type ?? 'product') as RestArticleType,
      unit: (article.unit ?? 'unit') as RestUnitOfMeasure,
      brand: typeof article.brand === 'string' ? article.brand : null,
      categoryId: idOrNull(article.categoryId),
    },
    // Sin precio legible llega `null`, no 0: el usuario debe escribirlo, y un 0
    // inventado pasaría la validación y registraría la línea gratis.
    unitPrice: numberOrNull(item.unitPrice),
    // Una línea sin cantidad es una unidad, no cero: un 0 dejaría el subtotal a 0.
    quantity:
      typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
    discount: positiveOrNull(item.discount),
    lineTotal: numberOrNull(item.lineTotal),
    description: typeof item.description === 'string' ? item.description : null,
  }
}

/** `POST /invoices/analyze-image` — multipart con el campo `image`. */
export async function analyzeInvoiceImage(
  file: File,
  signal?: AbortSignal,
): Promise<ExpenseDraft> {
  const invalid = validateImage(file)
  // Mismo tipo de error que devolvería el backend: la pantalla lo trata igual.
  if (invalid) throw new ApiError(400, invalid)

  const form = new FormData()
  form.append('image', file)

  return normalizeDraft(await apiFetch('/invoices/analyze-image', { form, signal }))
}

/** `POST /invoices/analyze-text` — JSON `{ text }`. */
export async function analyzeInvoiceText(
  text: string,
  signal?: AbortSignal,
): Promise<ExpenseDraft> {
  const trimmed = text.trim()
  if (!trimmed) throw new ApiError(400, 'Pega el texto de la factura.')

  return normalizeDraft(
    await apiFetch('/invoices/analyze-text', { json: { text: trimmed }, signal }),
  )
}

/** El gasto creado; solo se leen los campos que la pantalla confirma. */
export type CreatedExpense = {
  id: string
  description: string
  amount: number
  currency: string
}

/** `POST /invoices/expense` — confirma el borrador ya revisado. */
export function createInvoiceExpense(
  payload: CreateExpensePayload,
): Promise<CreatedExpense> {
  return apiFetch<CreatedExpense>('/invoices/expense', { json: payload })
}
