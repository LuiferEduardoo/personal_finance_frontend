import { describe, expect, it } from 'vitest'
import {
  amountsMatch,
  buildExpensePayload,
  invoiceItemsTotal,
  invoiceRowError,
  invoiceRowSubtotal,
  isInvoiceRowComplete,
  matchCategory,
  newInvoiceItemRow,
  rowsFromDraft,
  warningLines,
  type ExpenseDraft,
  type ExpenseDraftItem,
  type InvoiceItemRow,
} from './invoice'

function draft(overrides: Partial<ExpenseDraft> = {}): ExpenseDraft {
  return {
    description: 'Mercado',
    merchant: 'Éxito',
    occurredOn: '2026-07-20',
    currency: 'COP',
    amount: null,
    total: null,
    categoryId: null,
    categorySuggestion: 'mercado',
    accountId: null,
    items: [],
    warnings: [],
    ...overrides,
  }
}

type ItemOverrides = Omit<Partial<ExpenseDraftItem>, 'newArticle'> & {
  newArticle?: Partial<ExpenseDraftItem['newArticle']>
}

function item(overrides: ItemOverrides = {}): ExpenseDraftItem {
  const { newArticle, ...rest } = overrides
  return {
    unitPrice: 1000,
    quantity: 1,
    discount: null,
    lineTotal: null,
    description: null,
    ...rest,
    newArticle: {
      name: 'Pan',
      type: 'product',
      unit: 'unit',
      brand: null,
      categoryId: null,
      ...newArticle,
    },
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
          item({
            newArticle: {
              name: 'Leche',
              type: 'product',
              unit: 'l',
              brand: 'Alquería',
            },
            unitPrice: 4200,
            quantity: 2,
            description: null,
          }),
          item({
            newArticle: {
              name: 'Domicilio',
              type: 'service',
              unit: 'unit',
              brand: null,
            },
            unitPrice: 5000,
            quantity: 1,
            description: 'envío',
          }),
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
          item({
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
          }),
        ],
      }),
    )

    expect(rows[0]?.article).toMatchObject({ type: 'PRODUCT' })
    expect(rows[0]?.unit).toBe('UNIT')
  })

  it('lleva la categoría sugerida, el descuento y el número de línea', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          item({ newArticle: { categoryId: 'cat-9' }, discount: 500, lineTotal: 500 }),
          item(),
        ],
      }),
    )

    expect(rows[0]?.article).toMatchObject({ mode: 'new', categoryId: 'cat-9' })
    expect(rows[0]?.discount).toBe(500)
    expect(rows[0]?.lineTotal).toBe(500)
    expect(rows[0]?.draftLine).toBe(1)
    expect(rows[1]?.discount).toBeUndefined()
    expect(rows[1]?.draftLine).toBe(2)
  })

  it('deja vacío el precio que la factura no mostraba, no a 0', () => {
    const [row] = rowsFromDraft(draft({ items: [item({ unitPrice: null })] }))

    expect(row?.unitPrice).toBeUndefined()
    expect(row && isInvoiceRowComplete(row)).toBe(false)
    expect(row && invoiceRowError(row)).toBe('Escribe el precio unitario.')
  })
})

describe('buildExpensePayload', () => {
  it('omite amount cuando hay ítems: lo recalcula el backend', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          item({
            newArticle: {
              name: 'Leche',
              type: 'product',
              unit: 'l',
              brand: 'Alquería',
            },
            unitPrice: 4200,
            quantity: 2,
            description: null,
          }),
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

  it('conserva la marca de compra única en un artículo nuevo', () => {
    const row = newInvoiceItemRow()
    row.article = {
      mode: 'new',
      name: 'Decoración para fiesta',
      type: 'PRODUCT',
      categoryId: null,
      isOneTime: true,
    }
    row.unitPrice = 25_000

    const [item] = buildExpensePayload(values, [row]).items ?? []

    expect(item?.newArticle?.isOneTime).toBe(true)
  })

  it('envía la categoría sugerida del artículo nuevo y el descuento', () => {
    const rows = rowsFromDraft(
      draft({
        items: [
          item({ newArticle: { categoryId: 'cat-9' }, unitPrice: 3000, discount: 200 }),
        ],
      }),
    )

    const [sent] = buildExpensePayload(values, rows).items ?? []

    expect(sent?.newArticle?.categoryId).toBe('cat-9')
    expect(sent?.discount).toBe(200)
  })

  it('descarta la categoría sugerida si se vincula a un artículo del catálogo', () => {
    const [row] = rowsFromDraft(
      draft({ items: [item({ newArticle: { categoryId: 'cat-9' } })] }),
    )
    const linked: InvoiceItemRow = {
      ...row!,
      article: {
        mode: 'existing',
        articleId: 'article-1',
        label: 'Pan',
        type: 'PRODUCT',
      },
    }

    const [sent] = buildExpensePayload(values, [linked]).items ?? []

    expect(sent).toEqual({ unitPrice: 1000, quantity: 1, articleId: 'article-1' })
  })

  it('no envía un descuento vacío o a cero', () => {
    const row = { ...newInvoiceItemRow(), unitPrice: 1000, discount: 0 }
    row.article = { mode: 'new', name: 'Pan', type: 'PRODUCT', categoryId: null }

    const [sent] = buildExpensePayload(values, [row]).items ?? []

    expect(sent).not.toHaveProperty('discount')
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

describe('invoiceRowError', () => {
  const ready: InvoiceItemRow = {
    ...newInvoiceItemRow(),
    article: { mode: 'new', name: 'Pan', type: 'PRODUCT', categoryId: null },
    unitPrice: 1000,
    quantity: 2,
  }

  it('acepta una fila completa', () => {
    expect(invoiceRowError(ready)).toBeNull()
  })

  it('rechaza un descuento mayor que precio × cantidad', () => {
    expect(invoiceRowError({ ...ready, discount: 2500 })).toBe(
      'El descuento no puede superar precio × cantidad.',
    )
    expect(invoiceRowError({ ...ready, discount: 2000 })).toBeNull()
  })

  it('rechaza un descuento negativo', () => {
    expect(invoiceRowError({ ...ready, discount: -1 })).toBe(
      'El descuento no puede ser negativo.',
    )
  })
})

describe('invoiceRowSubtotal', () => {
  it('resta el descuento como el backend', () => {
    expect(
      invoiceRowSubtotal({
        ...newInvoiceItemRow(),
        unitPrice: 3500,
        quantity: 2,
        discount: 500,
      }),
    ).toBe(6500)
  })
})

describe('warningLines', () => {
  it('extrae las líneas citadas e ignora los avisos generales', () => {
    const lines = warningLines([
      'Línea 2 ("PAN"): 3.500 × 2 = 7.000, pero la factura muestra 6.500.',
      'Línea 10 ("LECHE"): no se pudo leer el precio unitario ni el total de la línea; complétalo antes de guardar.',
      'La suma de las líneas (11.000) no coincide con el total de la factura (11.500).',
    ])

    expect([...lines]).toEqual([2, 10])
  })
})

describe('amountsMatch', () => {
  it('tolera redondeos pero no diferencias reales', () => {
    expect(amountsMatch(11_500.4, 11_500)).toBe(true)
    // 0,5 % de 1.000.000 = 5.000 de holgura.
    expect(amountsMatch(1_004_000, 1_000_000)).toBe(true)
    expect(amountsMatch(11_000, 11_500)).toBe(false)
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
