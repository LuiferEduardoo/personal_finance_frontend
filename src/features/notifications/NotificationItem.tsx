import {
  notificationSeverity,
  relativeTime,
  type AppNotification,
} from './notification'
import { NotificationTypeIcon } from './NotificationTypeIcon'

/**
 * Una fila: el cuerpo entero es un botón (marca leída y navega) y el × es un
 * botón hermano, no anidado. Sin leer = punto + título en negrita + texto
 * oculto "sin leer".
 */
export function NotificationItem({
  notification,
  onOpen,
  onRemove,
}: {
  notification: AppNotification
  onOpen: () => void
  onRemove: () => void
}) {
  const { title, body, createdAt, read } = notification
  return (
    <li
      className={`border-border flex items-start border-b last:border-b-0 ${
        read ? '' : 'bg-surface-sunken/60'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="hover:bg-surface-sunken flex min-w-0 flex-1 items-start gap-3 py-3 pr-1 pl-4 text-left"
      >
        <NotificationTypeIcon severity={notificationSeverity(notification.type)} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            {!read && (
              <span
                aria-hidden="true"
                className="bg-neutral size-2 shrink-0 rounded-full"
              />
            )}
            <span
              className={`text-sm break-words ${
                read ? 'text-ink-secondary font-normal' : 'text-ink font-semibold'
              }`}
            >
              {title}
            </span>
          </span>
          <span className="text-ink-secondary mt-0.5 block text-sm break-words">
            {body}
          </span>
          <span className="text-ink-muted mt-1 block text-xs">
            <time dateTime={createdAt}>{relativeTime(createdAt)}</time>
            {!read && <span className="sr-only">, sin leer</span>}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Eliminar notificación: ${title}`}
        className="text-ink-muted hover:bg-surface-sunken hover:text-ink m-1 flex size-11 shrink-0 items-center justify-center rounded-md"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-4"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </li>
  )
}
