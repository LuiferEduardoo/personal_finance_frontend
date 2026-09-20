import type { BrokerKind } from '@/graphql/generated/graphql'

/**
 * `InvestmentTransactionsFilterInput` solo acepta `accountId`, `from`, `to`,
 * `instrumentId`, `types`, `limit` y `offset`: ni el broker ni la búsqueda por
 * etiqueta existen en el esquema. Los dos se resuelven en cliente sobre la
 * ventana que devuelve el servidor, por eso hace falta saber cuándo se llena.
 */
export const SERVER_WINDOW = 500
export const PAGE_SIZE = 50

/** Lo mínimo que los filtros de cliente necesitan de una operación. */
export type FilterableTransaction = {
  accountId: string
  instrument?: { symbol: string; name: string } | null
}

/** Broker de cada cuenta, por id. La consulta de operaciones no lo trae. */
export type BrokerByAccount = ReadonlyMap<string, BrokerKind>

export function brokersByAccount(
  accounts: readonly { id: string; broker: BrokerKind }[],
): BrokerByAccount {
  return new Map(accounts.map((account) => [account.id, account.broker]))
}

/** Quita acentos y mayúsculas: "Telefónica" y "telefonica" son lo mismo. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Hay refinamiento de cliente cuando se filtra por broker o por etiqueta. */
export function isRefining(broker: BrokerKind | '', query: string): boolean {
  return Boolean(broker) || normalize(query) !== ''
}

/**
 * Empareja por etiqueta del activo: símbolo o nombre, por subcadena. Una
 * operación sin instrumento (depósito, comisión…) no casa con ningún término,
 * así que queda fuera en cuanto se busca algo.
 */
export function matchesInstrumentQuery(
  row: FilterableTransaction,
  query: string,
): boolean {
  const term = normalize(query)
  if (!term) return true
  if (!row.instrument) return false
  return (
    normalize(row.instrument.symbol).includes(term) ||
    normalize(row.instrument.name).includes(term)
  )
}

export function matchesBroker(
  row: FilterableTransaction,
  broker: BrokerKind | '',
  brokers: BrokerByAccount,
): boolean {
  return !broker || brokers.get(row.accountId) === broker
}

export function refineTransactions<T extends FilterableTransaction>(
  rows: readonly T[],
  {
    broker,
    query,
    brokers,
  }: {
    broker: BrokerKind | ''
    query: string
    brokers: BrokerByAccount
  },
): T[] {
  return rows.filter(
    (row) => matchesBroker(row, broker, brokers) && matchesInstrumentQuery(row, query),
  )
}

/**
 * Con refinamiento el servidor entrega una ventana única y la paginación pasa a
 * ser de cliente; sin él se mantiene la del backend, que no tiene techo.
 * `saturated` avisa de que la ventana se llenó, así que el refinamiento puede
 * estar dejando fuera operaciones que el servidor nunca llegó a enviar.
 */
export function paginate<T>(
  rows: readonly T[],
  { refining, page, total }: { refining: boolean; page: number; total: number },
): { visible: T[]; count: number; saturated: boolean } {
  if (!refining) return { visible: [...rows], count: total, saturated: false }
  return {
    visible: rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    count: rows.length,
    saturated: total > SERVER_WINDOW,
  }
}
