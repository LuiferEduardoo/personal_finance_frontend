import { NetworkStatus, useMutation, useQuery } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { NOTIFICATIONS_PAGE_SIZE, type AppNotification } from './notification'
import { NotificationItem } from './NotificationItem'
import {
  MarkAllNotificationsReadMutation,
  MarkNotificationReadMutation,
  NotificationsQuery,
  RemoveNotificationMutation,
} from './notifications.queries'
import {
  adjustUnreadCount,
  markAllReadInCache,
  removeFromCache,
} from './notificationsCache'

const ACTION_ERROR = 'No se pudieron actualizar las notificaciones. Inténtalo de nuevo.'

/**
 * Panel de la campana. Solo se monta abierto, así que la lista se pide al
 * abrir (no con el sondeo del contador). Móvil: ancho completo bajo el header;
 * `sm:` en adelante: desplegable anclado a la campana.
 */
export function NotificationPanel({
  id,
  unreadCount,
  onClose,
}: {
  id: string
  unreadCount: number
  onClose: () => void
}) {
  const navigate = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const [exhausted, setExhausted] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const { data, error, networkStatus, fetchMore, refetch } = useQuery(
    NotificationsQuery,
    {
      variables: { filter: { limit: NOTIFICATIONS_PAGE_SIZE, offset: 0 } },
      notifyOnNetworkStatusChange: true,
    },
  )
  const [markRead] = useMutation(MarkNotificationReadMutation)
  const [markAllRead] = useMutation(MarkAllNotificationsReadMutation)
  const [removeNotification] = useMutation(RemoveNotificationMutation)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  const items = data?.notifications ?? []
  const loadingMore = networkStatus === NetworkStatus.fetchMore
  const hasMore = !exhausted && items.length >= NOTIFICATIONS_PAGE_SIZE

  const openNotification = (notification: AppNotification) => {
    if (!notification.read) {
      markRead({
        variables: { id: notification.id },
        optimisticResponse: {
          markNotificationRead: {
            ...notification,
            __typename: 'Notification',
            read: true,
            readAt: new Date().toISOString(),
          },
        },
        // Corre en la capa optimista y otra vez con la respuesta real (la
        // optimista se descarta), así que el contador baja una sola vez.
        update: (cache) => adjustUnreadCount(cache, -1),
      }).catch(() => setActionError(ACTION_ERROR))
    }
    onClose()
    // Solo rutas internas de la app.
    if (notification.link?.startsWith('/')) void navigate(notification.link)
  }

  const remove = (notification: AppNotification) => {
    setActionError(null)
    removeNotification({
      variables: { id: notification.id },
      optimisticResponse: { removeNotification: true },
      update: (cache, result) => {
        if (!result.data?.removeNotification) return
        removeFromCache(cache, notification.id)
        if (!notification.read) adjustUnreadCount(cache, -1)
      },
    }).catch(() => setActionError(ACTION_ERROR))
  }

  const markAll = () => {
    setActionError(null)
    const readAt = new Date().toISOString()
    markAllRead({
      optimisticResponse: { markAllNotificationsRead: unreadCount },
      update: (cache) => markAllReadInCache(cache, readAt),
    }).catch(() => setActionError(ACTION_ERROR))
  }

  const loadMore = () => {
    fetchMore({
      variables: {
        filter: { limit: NOTIFICATIONS_PAGE_SIZE, offset: items.length },
      },
    })
      .then((result) => {
        if (result.data.notifications.length < NOTIFICATIONS_PAGE_SIZE) {
          setExhausted(true)
        }
      })
      .catch(() => setActionError(ACTION_ERROR))
  }

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-label="Notificaciones"
      tabIndex={-1}
      className="border-border bg-surface-raised absolute inset-x-0 top-full z-40 border-b shadow-lg outline-none sm:inset-x-auto sm:top-[calc(100%+0.5rem)] sm:right-0 sm:w-96 sm:rounded-lg sm:border"
    >
      <div className="border-border flex items-center justify-between gap-2 border-b py-1 pr-2 pl-4">
        <h2 className="text-ink text-sm font-semibold">Notificaciones</h2>
        <button
          type="button"
          onClick={markAll}
          disabled={unreadCount === 0}
          className="text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-md px-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Marcar todas como leídas
        </button>
      </div>

      {actionError && (
        <p
          role="alert"
          className="text-expense border-border border-b px-4 py-2 text-sm"
        >
          {actionError}
        </p>
      )}

      <div className="max-h-[min(70dvh,32rem)] overflow-y-auto overscroll-contain">
        {!data && error ? (
          <div role="alert" className="px-4 py-8 text-center">
            <p className="text-ink text-sm">
              No se pudieron cargar las notificaciones.
            </p>
            <button
              type="button"
              onClick={() => void refetch().catch(() => undefined)}
              className="text-ink-secondary mt-2 min-h-11 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        ) : !data ? (
          <p className="text-ink-muted px-4 py-8 text-center text-sm">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-ink-secondary px-4 py-8 text-center text-sm">
            No tienes notificaciones
          </p>
        ) : (
          <>
            <ul>
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onOpen={() => openNotification(notification)}
                  onRemove={() => remove(notification)}
                />
              ))}
            </ul>
            {hasMore && (
              <div className="border-border border-t p-2">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="text-ink hover:bg-surface-sunken min-h-11 w-full rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {loadingMore ? 'Cargando…' : 'Ver más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
