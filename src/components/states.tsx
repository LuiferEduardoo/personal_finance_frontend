import type { ReactNode } from 'react'

/**
 * Un recurso inexistente o ajeno (NOT_FOUND) es un estado vacío, no un error
 * rojo: al usuario no le sirve un mensaje de alarma por una lista sin datos.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="border-border rounded-lg border border-dashed px-6 py-12 text-center">
      <p className="text-ink text-sm font-medium">{title}</p>
      {description && <p className="text-ink-secondary mt-1 text-sm">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

/** Error real: algo falló y el usuario puede reintentar. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="border-expense/30 bg-expense/5 rounded-lg border px-6 py-8 text-center"
    >
      <p className="text-ink text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-ink mt-3 min-h-11 text-sm font-medium underline"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Cargando">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="bg-surface-sunken h-16 animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
