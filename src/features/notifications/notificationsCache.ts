import type { ApolloCache, Reference } from '@apollo/client'

/**
 * Actualizaciones de caché de las notificaciones, sin refetch: la lista y el
 * contador del badge se tocan en el mismo `update` de cada mutación, así no
 * parpadean ni quedan descuadrados entre sí.
 */

/** Suma `delta` al contador del badge, sin bajar de 0. */
export function adjustUnreadCount(cache: ApolloCache<unknown>, delta: number): void {
  cache.modify({
    id: 'ROOT_QUERY',
    fields: {
      unreadNotificationsCount: (count: number) => Math.max(0, count + delta),
    },
  })
}

/** Marca leídas todas las notificaciones cacheadas y deja el contador en 0. */
export function markAllReadInCache(cache: ApolloCache<unknown>, readAt: string): void {
  const refs: Reference[] = []
  cache.modify<{ notifications: Reference[] }>({
    id: 'ROOT_QUERY',
    fields: {
      // Solo recoge las referencias (de todas las entradas de la lista); no
      // cambia el campo.
      notifications: (existing) => {
        refs.push(...existing)
        return existing
      },
    },
  })
  cache.modify({
    id: 'ROOT_QUERY',
    fields: { unreadNotificationsCount: () => 0 },
  })
  for (const ref of refs) {
    cache.modify({
      id: cache.identify(ref),
      fields: {
        read: () => true,
        readAt: (value: string | null) => value ?? readAt,
      },
    })
  }
}

/** Quita la notificación de todas las listas cacheadas y la evicta. */
export function removeFromCache(cache: ApolloCache<unknown>, id: string): void {
  cache.modify({
    id: 'ROOT_QUERY',
    fields: {
      // Sacarla del array (no solo evictarla) mantiene la longitud de la lista
      // igual a lo que se ve, que es el `offset` de la página siguiente.
      notifications: (existing: readonly Reference[], { readField }) =>
        existing.filter((ref) => readField('id', ref) !== id),
    },
  })
  cache.evict({ id: cache.identify({ __typename: 'Notification', id }) })
  cache.gc()
}
