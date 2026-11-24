import { graphql } from '@/graphql/generated'

/** Campos de una notificación; los usan la lista y las mutaciones. */
export const NotificationFieldsFragment = graphql(`
  fragment NotificationFields on Notification {
    id
    type
    title
    body
    link
    read
    readAt
    createdAt
  }
`)

/** Contador del badge de la campana; se sondea cada minuto. */
export const UnreadNotificationsCountQuery = graphql(`
  query UnreadNotificationsCount {
    unreadNotificationsCount
  }
`)

/** Más recientes primero; paginación por `offset` (máx. 100 por página). */
export const NotificationsQuery = graphql(`
  query Notifications($filter: NotificationsFilterInput) {
    notifications(filter: $filter) {
      ...NotificationFields
    }
  }
`)

export const MarkNotificationReadMutation = graphql(`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      ...NotificationFields
    }
  }
`)

/** Devuelve cuántas se marcaron. */
export const MarkAllNotificationsReadMutation = graphql(`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`)

export const RemoveNotificationMutation = graphql(`
  mutation RemoveNotification($id: ID!) {
    removeNotification(id: $id)
  }
`)
