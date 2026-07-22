import type { ApolloCache } from '@apollo/client'

/**
 * Invalidación de caché por eviction de campos raíz.
 *
 * ¿Por qué eviction y no `refetchQueries`? `refetchQueries` (por nombre o por
 * variables) solo refresca queries **activas** en ese momento. Si registras un
 * movimiento en Movimientos, el Dashboard no está montado, así que su query —con
 * otro rango de fechas— no se refresca, y al ir a Inicio Apollo sirve la caché
 * vieja hasta recargar.
 *
 * Evictar el campo raíz borra TODAS sus entradas (todas las combinaciones de
 * filtro/rango). Efectos:
 *   - las queries activas que lo leen quedan incompletas → Apollo las refetchea
 *     (la página actual se actualiza al instante);
 *   - las demás páginas piden datos frescos al montarse (cache-first no encuentra
 *     nada), así que nunca muestran algo obsoleto.
 */
function evictFields(cache: ApolloCache<unknown>, fields: string[]): void {
  for (const fieldName of fields) {
    cache.evict({ id: 'ROOT_QUERY', fieldName })
  }
  cache.gc()
}

/**
 * Un gasto o ingreso afecta: las listas de movimientos, el dashboard, las dos
 * inflaciones y el saldo de la cuenta asociada.
 */
export function evictMovements(cache: ApolloCache<unknown>): void {
  evictFields(cache, [
    'expenses',
    'incomes',
    'expenseInflation',
    'articleInflation',
    'accounts',
  ])
}

/**
 * El inventario cambia sin pasar por sus mutaciones cuando un gasto lleva un
 * artículo de tipo producto, y también al editar el catálogo de artículos.
 */
export function evictInventory(cache: ApolloCache<unknown>): void {
  evictFields(cache, [
    'products',
    'articles',
    'productStats',
    'productPurchases',
    'consumptionCycles',
  ])
}

export function evictAccounts(cache: ApolloCache<unknown>): void {
  evictFields(cache, ['accounts'])
}

export function evictAccountTransfers(cache: ApolloCache<unknown>): void {
  evictFields(cache, ['accountTransfers', 'accounts'])
}

export function evictRecurring(cache: ApolloCache<unknown>): void {
  evictFields(cache, ['recurringExpenses'])
}

/** Las categorías se leen con `kind` variable (gasto/ingreso), en varias páginas. */
export function evictCategories(cache: ApolloCache<unknown>): void {
  evictFields(cache, ['categories'])
}
