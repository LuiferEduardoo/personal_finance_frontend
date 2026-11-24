import {
  SEVERITY_CLASSES,
  SEVERITY_LABELS,
  type NotificationSeverity,
} from './notification'

/** Icono + color + etiqueta (oculta) por severidad: el color nunca va solo. */
export function NotificationTypeIcon({ severity }: { severity: NotificationSeverity }) {
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${SEVERITY_CLASSES[severity]}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4"
      >
        {severity === 'danger' && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5m0 3.5h.01" />
          </>
        )}
        {severity === 'warning' && (
          <>
            <path d="M12 4 2.5 20h19z" />
            <path d="M12 10v4m0 3h.01" />
          </>
        )}
        {severity === 'info' && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5m0-9h.01" />
          </>
        )}
      </svg>
      <span className="sr-only">{SEVERITY_LABELS[severity]}:</span>
    </span>
  )
}
