import { useQuery } from '@apollo/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { bellLabel, unreadBadgeText, UNREAD_COUNT_POLL_MS } from './notification'
import { NotificationPanel } from './NotificationPanel'
import { UnreadNotificationsCountQuery } from './notifications.queries'

const PANEL_ID = 'notifications-panel'

/**
 * Campana del header. El contador se sondea cada minuto (sin sondear con la
 * pestaña oculta) y se refresca al volver a la ventana; las notificaciones las
 * crea el backend en segundo plano (presupuestos, créditos, correo...).
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { data, refetch } = useQuery(UnreadNotificationsCountQuery, {
    pollInterval: UNREAD_COUNT_POLL_MS,
    skipPollAttempt: () => document.visibilityState === 'hidden',
  })
  const count = data?.unreadNotificationsCount ?? 0
  const badge = unreadBadgeText(count)

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') void refetch().catch(() => undefined)
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [refetch])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) close()
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [open, close])

  return (
    // Sin `relative` en móvil: el panel se ancla al header (sticky) y ocupa
    // todo su ancho; desde `sm:` se ancla a la campana.
    <div ref={wrapperRef} className="sm:relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={bellLabel(count)}
        aria-expanded={open}
        aria-controls={open ? PANEL_ID : undefined}
        aria-haspopup="dialog"
        className="border-border bg-surface-raised text-ink hover:bg-surface-sunken relative flex size-11 items-center justify-center rounded-full border"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-6"
        >
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        </svg>
        {badge && (
          <span
            aria-hidden="true"
            className="bg-ink text-surface absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.6875rem] leading-none font-semibold"
          >
            {badge}
          </span>
        )}
      </button>
      {open && <NotificationPanel id={PANEL_ID} unreadCount={count} onClose={close} />}
    </div>
  )
}
