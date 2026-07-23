// oxlint-disable react/only-export-components -- el hook `useConfirm` y su
// componente de diálogo van juntos a propósito: son una sola API de confirmación.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from './Button'

export type ConfirmOptions = {
  title: string
  /** Texto explicativo opcional bajo el título. */
  message?: string
  /** Etiqueta del botón de acción. Por defecto "Eliminar". */
  confirmLabel?: string
  /** Acción destructiva → botón en color de gasto. Por defecto true. */
  danger?: boolean
}

/**
 * Reemplazo de `window.confirm` por un modal propio, coherente con el diseño.
 *
 * Se usa de forma imperativa como el `confirm` nativo:
 *
 *   const { confirm, dialog } = useConfirm()
 *   if (!(await confirm({ title: '¿Eliminar…?' }))) return
 *   // …y renderizar {dialog} una vez en el componente.
 *
 * `confirm()` devuelve una promesa que resuelve `true`/`false`, así que el punto
 * de llamada queda igual de simple que antes.
 */
export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolverRef = useRef<((result: boolean) => void) | null>(null)

  const confirm = useCallback((next: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
      setOptions(next)
    })
  }, [])

  const settle = useCallback((result: boolean) => {
    resolverRef.current?.(result)
    resolverRef.current = null
    setOptions(null)
  }, [])

  const dialog = (
    <ConfirmDialog
      options={options}
      onCancel={() => settle(false)}
      onConfirm={() => settle(true)}
    />
  )

  return { confirm, dialog }
}

function ConfirmDialog({
  options,
  onCancel,
  onConfirm,
}: {
  options: ConfirmOptions | null
  onCancel: () => void
  onConfirm: () => void
}): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = options !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    else if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  const danger = options?.danger ?? true

  return (
    <dialog
      ref={dialogRef}
      // `close` (Escape, backdrop nativo) cuenta como cancelar.
      onClose={onCancel}
      aria-label={options?.title ?? 'Confirmar'}
      className="bg-surface-raised text-ink m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl p-0 backdrop:bg-black/40"
    >
      {options && (
        <div className="p-5">
          <h2 className="text-ink text-base font-semibold">{options.title}</h2>
          {options.message && (
            <p className="text-ink-secondary mt-1.5 text-sm">{options.message}</p>
          )}
          <div className="mt-5 flex gap-2">
            <Button variant="secondary" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-lg px-4 text-sm font-medium ${
                danger
                  ? 'bg-expense text-surface hover:opacity-90'
                  : 'bg-ink text-surface hover:opacity-90'
              }`}
            >
              {options.confirmLabel ?? 'Eliminar'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
