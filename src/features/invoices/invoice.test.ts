import { describe, expect, it } from 'vitest'
import {
  buildExpensePayload,
  invoiceItemsTotal,
  isInvoiceRowComplete,
  matchCategory,
  newInvoiceItemRow,
  rowsFromDraft,
  type ExpenseDraft,
  type InvoiceItemRow,
} from './invoice'

function draft(overrides: Partial<ExpenseDraft> = {}): ExpenseDraft {
  return {
    description: 'Mercado',
    merchant: 'Éxito',
    occurredOn: '2026-07-20',
    currency: 'COP',
    amount: null,
    categorySuggestion: 'mercado',
    accountId: null,
    items: [],
    ...overrides,
  }
}

const values = {
  description: 'Mercado',
  occurredOn: '2026-07-20',
  currency: 'COP',
  accountId: 'account-1',
}

describe('rowsFromDraft', () => {
  it('traduce los enums en minúscula del REST a los de GraphQL', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          {
            newArticle: {
              name: 'Leche',
              type: 'product',
              unit: 'l',
              brand: 'Alquería',
            },
            unitPrice: 4200,
            quantity: 2,
            description: null,
          },
          {
            newArticle: {
              name: 'Domicilio',
              type: 'service',
              unit: 'unit',
              brand: null,
            },
            unitPrice: 5000,
            quantity: 1,
            description: 'envío',
          },
        ],
      }),
    )

    expect(rows[0]?.article).toMatchObject({ mode: 'new', type: 'PRODUCT' })
    expect(rows[0]?.unit).toBe('LITER')
    expect(rows[1]?.article).toMatchObject({ mode: 'new', type: 'SERVICE' })
    expect(rows[1]?.unit).toBe('UNIT')
  })

  it('cae en producto/unidad si el modelo devuelve un enum desconocido', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          {
            // El borrador lo escribe un LLM: puede inventarse el valor.
            newArticle: {
              name: 'Algo',
              type: 'comida' as never,
              unit: 'litros' as never,
              brand: null,
            },
            unitPrice: 1000,
            quantity: 1,
            description: null,
          },
        ],
      }),
    )

    expect(rows[0]?.article).toMatchObject({ type: 'PRODUCT' })
    expect(rows[0]?.unit).toBe('UNIT')
  })
})

describe('buildExpensePayload', () => {
  it('omite amount cuando hay ítems: lo recalcula el backend', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          {
            newArticle: {
              name: 'Leche',
              type: 'product',
              unit: 'l',
              brand: 'Alquería',
            },
            unitPrice: 4200,
            quantity: 2,
            description: null,
          },
        ],
      }),
    )

    const payload = buildExpensePayload({ ...values, amount: 99999 }, rows)

    expect(payload.amount).toBeUndefined()
    expect(payload.items).toEqual([
      {
        unitPrice: 4200,
        quantity: 2,
        newArticle: {
          name: 'Leche',
          type: 'product',
          unit: 'l',
          brand: 'Alquería',
        },
      },
    ])
  })

  it('envía items vacíos y el total cuando la factura no trae líneas', () => {
    const payload = buildExpensePayload({ ...values, amount: 32000 }, [])

    expect(payload.items).toEqual([])
    expect(payload.amount).toBe(32000)
  })

  it('manda articleId o newArticle, nunca los dos', () => {
    const linked: InvoiceItemRow = {
      ...newInvoiceItemRow(),
      article: {
        mode: 'existing',
        articleId: 'article-1',
        label: 'Leche',
        type: 'PRODUCT',
      },
      unitPrice: 4200,
      quantity: 1,
    }

    const [item] = buildExpensePayload(values, [linked]).items ?? []

    expect(item?.articleId).toBe('article-1')
    expect(item).not.toHaveProperty('newArticle')
  })

  it('no envía campos opcionales vacíos', () => {
    const payload = buildExpensePayload(
      { ...values, amount: 1000, categoryId: '', merchant: '   ', notes: '' },
      [],
    )

    expect(payload).not.toHaveProperty('categoryId')
    expect(payload).not.toHaveProperty('merchant')
    expect(payload).not.toHaveProperty('notes')
  })
})

describe('isInvoiceRowComplete', () => {
  it('exige nombre y precio en un artículo nuevo', () => {
    const row = newInvoiceItemRow()
    expect(isInvoiceRowComplete(row)).toBe(false)
    expect(
      isInvoiceRowComplete({
        ...row,
        article: { mode: 'new', name: 'Leche', type: 'PRODUCT', categoryId: null },
        unitPrice: 4200,
      }),
    ).toBe(true)
  })

  it('rechaza una fila sin artículo elegido', () => {
    expect(
      isInvoiceRowComplete({
        ...newInvoiceItemRow(),
        article: { mode: 'none' },
        unitPrice: 4200,
      }),
    ).toBe(false)
  })
})

describe('invoiceItemsTotal', () => {
  it('ignora las filas sin precio en vez de contarlas como cero forzado', () => {
    const rows = [
      { ...newInvoiceItemRow(), unitPrice: 1000, quantity: 3 },
      { ...newInvoiceItemRow(), unitPrice: undefined, quantity: 2 },
    ]
    expect(invoiceItemsTotal(rows)).toBe(3000)
  })
})

describe('matchCategory', () => {
  const categories = [
    { id: 'cat-1', name: 'Mercado y hogar' },
    { id: 'cat-2', name: 'Transporte' },
  ]

  it('empareja ignorando acentos y mayúsculas', () => {
    expect(matchCategory('TRANSPÓRTE', categories)).toBe('cat-2')
  })

  it('acepta una coincidencia parcial', () => {
    expect(matchCategory('mercado', categories)).toBe('cat-1')
  })

  it('devuelve null antes que clasificar mal', () => {
    expect(matchCategory('criptomonedas', categories)).toBeNull()
    expect(matchCategory(null, categories)).toBeNull()
  })
})
