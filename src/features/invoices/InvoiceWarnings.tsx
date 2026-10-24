import { useId } from 'react'

type InvoiceWarningsProps = {
  warnings: string[]
}

/**
 * Avisos del backend cuando la factura no cuadra (línea o total). Los números
 * NO se corrigen solos: el aviso es lo que le dice al usuario qué revisar.
 *
 * El color `warning` acompaña, no comunica: el título dice "Revisa..." y cada
 * aviso va en una lista con su texto completo, así que se entiende sin color.
 */
export function InvoiceWarnings({ warnings }: InvoiceWarningsProps) {
  const titleId = useId()
  if (warnings.length === 0) return null

  return (
    <section
      role="status"
      aria-labelledby={titleId}
      className="border-warning/40 bg-warning/10 text-ink rounded-lg border px-4 py-3 text-sm"
    >
      <h2 id={titleId} className="flex items-center gap-2 font-medium">
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="text-warning size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 1.75 15 14.25H1L8 1.75Z" />
          <path d="M8 6.5v3.25M8 12h.01" />
        </svg>
        {warnings.length === 1
          ? 'Revisa este aviso antes de registrar'
          : `Revisa estos ${warnings.length} avisos antes de registrar`}
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>
    </section>
  )
}
