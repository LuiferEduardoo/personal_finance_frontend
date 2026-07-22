import { describe, expect, it } from 'vitest'
import { buildItemsInput, isRowComplete, itemsTotal, type ItemRow } from './items'

function row(overrides: Partial<ItemRow>): ItemRow {
  return {
    key: 'k',
    article: { mode: 'none' },
    unitPrice: undefined,
    quantity: 1,
    ...overrides,
  }
}

describe('itemsTotal', () => {
  it('suma los subtotales de las filas completas', () => {
    const total = itemsTotal([
      row({ unitPrice: 2500, quantity: 2 }),
      row({ unitPrice: 1000, quantity: 3 }),
    ])
    expect(total).toBe(8000)
  })

  it('ignora las filas sin precio', () => {
    expect(itemsTotal([row({ unitPrice: undefined, quantity: 5 })])).toBe(0)
  })
})

describe('isRowComplete', () => {
  it('exige artículo, precio y cantidad positiva', () => {
    expect(isRowComplete(row({ article: { mode: 'none' }, unitPrice: 10 }))).toBe(false)
    expect(
      isRowComplete(
        row({
          article: { mode: 'existing', articleId: 'a', label: 'x', type: 'PRODUCT' },
          unitPrice: undefined,
        }),
      ),
    ).toBe(false)
    expect(
      isRowComplete(
        row({
          article: { mode: 'existing', articleId: 'a', label: 'x', type: 'PRODUCT' },
          unitPrice: 10,
          quantity: 0,
        }),
      ),
    ).toBe(false)
    expect(
      isRowComplete(
        row({
          article: { mode: 'existing', articleId: 'a', label: 'x', type: 'PRODUCT' },
          unitPrice: 10,
          quantity: 1,
        }),
      ),
    ).toBe(true)
  })
})

describe('buildItemsInput', () => {
  it('cada ítem lleva su artículo (XOR) más precio y cantidad', () => {
    const input = buildItemsInput([
      row({
        article: {
          mode: 'existing',
          articleId: 'a1',
          label: 'Shampoo',
          type: 'PRODUCT',
        },
        unitPrice: 25000,
        quantity: 1,
      }),
      row({
        article: { mode: 'new', name: 'Jabón', type: 'PRODUCT', categoryId: null },
        unitPrice: 3000,
        quantity: 2,
      }),
    ])

    expect(input[0]).toEqual({ articleId: 'a1', unitPrice: 25000, quantity: 1 })
    expect(input[1]).toEqual({
      newArticle: { name: 'Jabón', type: 'PRODUCT', categoryId: undefined },
      unitPrice: 3000,
      quantity: 2,
    })
  })
})
