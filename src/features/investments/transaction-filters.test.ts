import { describe, expect, it } from 'vitest'
import {
  brokersByAccount,
  isRefining,
  paginate,
  PAGE_SIZE,
  refineTransactions,
  SERVER_WINDOW,
} from './transaction-filters'

const brokers = brokersByAccount([
  { id: 'a1', broker: 'ETORO' },
  { id: 'a2', broker: 'BINANCE' },
])

const row = (accountId: string, symbol?: string, name?: string) => ({
  accountId,
  instrument: symbol ? { symbol, name: name ?? symbol } : null,
})

const rows = [
  row('a1', 'AAPL', 'Apple Inc.'),
  row('a2', 'BTC', 'Bitcoin'),
  row('a1', 'TEF', 'Telefónica'),
  row('a1'),
]

describe('filtros de operaciones', () => {
  it('solo refina cuando hay broker o término real', () => {
    expect(isRefining('', '')).toBe(false)
    expect(isRefining('', '   ')).toBe(false)
    expect(isRefining('ETORO', '')).toBe(true)
    expect(isRefining('', 'aapl')).toBe(true)
  })

  it('filtra por broker a través del mapa de cuentas', () => {
    const result = refineTransactions(rows, { broker: 'BINANCE', query: '', brokers })
    expect(result).toEqual([rows[1]])
  })

  it('busca la etiqueta en símbolo y nombre, sin acentos ni mayúsculas', () => {
    const bySymbol = refineTransactions(rows, { broker: '', query: 'aap', brokers })
    expect(bySymbol).toEqual([rows[0]])
    const byName = refineTransactions(rows, {
      broker: '',
      query: 'TELEFONICA',
      brokers,
    })
    expect(byName).toEqual([rows[2]])
  })

  it('deja fuera las operaciones sin instrumento al buscar', () => {
    expect(refineTransactions(rows, { broker: '', query: 'a', brokers })).not.toContain(
      rows[3],
    )
    // Sin término, el depósito sin instrumento sí entra.
    expect(refineTransactions(rows, { broker: 'ETORO', query: '', brokers })).toContain(
      rows[3],
    )
  })

  it('combina broker y etiqueta', () => {
    expect(
      refineTransactions(rows, { broker: 'ETORO', query: 'bitcoin', brokers }),
    ).toEqual([])
  })

  it('sin refinar conserva el recuento y la página del servidor', () => {
    expect(paginate(rows, { refining: false, page: 3, total: 900 })).toEqual({
      visible: rows,
      count: 900,
      saturated: false,
    })
  })

  it('al refinar recorta la página en cliente y cuenta lo refinado', () => {
    const many = Array.from({ length: PAGE_SIZE + 5 }, (_, i) => row('a1', `S${i}`))
    const first = paginate(many, { refining: true, page: 0, total: many.length })
    expect(first.visible).toHaveLength(PAGE_SIZE)
    expect(first.count).toBe(many.length)
    const second = paginate(many, { refining: true, page: 1, total: many.length })
    expect(second.visible).toHaveLength(5)
  })

  it('avisa cuando la ventana del servidor se llenó', () => {
    expect(
      paginate(rows, { refining: true, page: 0, total: SERVER_WINDOW + 1 }).saturated,
    ).toBe(true)
    expect(
      paginate(rows, { refining: true, page: 0, total: SERVER_WINDOW }).saturated,
    ).toBe(false)
  })
})
