import { describe, expect, it } from 'vitest'
import { buildArticleInput, computeUnitPrice } from './article'

describe('buildArticleInput', () => {
  it('sin artículo no envía ningún campo', () => {
    expect(buildArticleInput({ mode: 'none' })).toEqual({})
  })

  it('artículo existente envía solo articleId, nunca newArticle', () => {
    const input = buildArticleInput({
      mode: 'existing',
      articleId: 'a1',
      label: 'Shampoo',
      type: 'PRODUCT',
    })
    expect(input).toEqual({ articleId: 'a1' })
    expect(input).not.toHaveProperty('newArticle')
  })

  it('artículo nuevo envía solo newArticle, nunca articleId', () => {
    const input = buildArticleInput({
      mode: 'new',
      name: 'Jabón',
      type: 'PRODUCT',
      categoryId: 'c1',
    })
    expect(input).toEqual({
      newArticle: { name: 'Jabón', type: 'PRODUCT', categoryId: 'c1' },
    })
    expect(input).not.toHaveProperty('articleId')
  })

  it('artículo nuevo sin categoría manda categoryId undefined', () => {
    const input = buildArticleInput({
      mode: 'new',
      name: 'Corte de pelo',
      type: 'SERVICE',
      categoryId: null,
    })
    expect(input.newArticle?.categoryId).toBeUndefined()
  })
})

describe('computeUnitPrice', () => {
  it('divide importe entre cantidad', () => {
    expect(computeUnitPrice(30000, 2)).toBe(15000)
    expect(computeUnitPrice(100, 4)).toBe(25)
  })

  it('con cantidad 1 devuelve el importe', () => {
    expect(computeUnitPrice(185000, 1)).toBe(185000)
  })

  it('devuelve null en vez de dividir por cero', () => {
    // Un precio "infinito" confundiría; la UI muestra "—".
    expect(computeUnitPrice(1000, 0)).toBeNull()
    expect(computeUnitPrice(1000, -1)).toBeNull()
  })

  it('devuelve null cuando falta un dato', () => {
    expect(computeUnitPrice(undefined, 2)).toBeNull()
    expect(computeUnitPrice(1000, undefined)).toBeNull()
    expect(computeUnitPrice(Number.NaN, 2)).toBeNull()
  })
})
