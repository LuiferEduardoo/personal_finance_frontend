import { useEffect, useRef, type ReactNode } from 'react'

type SheetProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Un contenedor, dos presentaciones: hoja inferior deslizante en móvil y modal
 * centrado desde `sm:`.
 *
 * Se apoya en `<dialog>` nativo, que ya trae el foco atrapado, el cierre con
 * Escape y el backdrop inerte — todo lo que una implementación a mano suele
 * hacer mal.
 */
export function Sheet({ isOpen, onClose, title, children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) dialog.showModal()
    else if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      // `close` cubre Escape y el cierre nativo, no solo nuestro botón.
      onClose={onClose}
      aria-label={title}
      className="bg-surface-raised text-ink m-0 mt-auto max-h-[90dvh] w-full max-w-none rounded-t-2xl p-0 backdrop:bg-black/40 sm:m-auto sm:max-w-md sm:rounded-2xl"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="border-border flex items-center justify-between gap-4 border-b px-4 py-3">
          <h2 className="text-ink text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-ink-secondary hover:bg-surface-sunken -mr-2 flex size-11 items-center justify-center rounded-lg"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {/* pb con el inset inferior: en móvil el contenido llega hasta el borde. */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-[calc(1rem+var(--spacing-safe-bottom))]">
          {children}
        </div>
      </div>
    </dialog>
  )
}
