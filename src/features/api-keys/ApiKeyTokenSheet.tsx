import { useState } from 'react'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'

export function ApiKeyTokenSheet({
  token,
  onClose,
}: {
  token: string | null
  onClose: () => void
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const copy = async () => {
    if (!token) return
    try {
      await navigator.clipboard.writeText(token)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <Sheet isOpen={token !== null} onClose={onClose} title="Clave creada">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-ink text-sm font-medium">Guárdala ahora</p>
          <p className="text-ink-secondary mt-1 text-sm">
            Este secreto se muestra una sola vez. Kuantico no podrá recuperarlo cuando
            cierres esta ventana.
          </p>
        </div>

        <code className="border-border bg-surface-sunken text-ink block rounded-lg border p-4 font-mono text-sm break-all select-all">
          {token}
        </code>

        <p aria-live="polite" className="text-ink-secondary min-h-5 text-sm">
          {copyState === 'copied' && 'Clave copiada.'}
          {copyState === 'error' &&
            'No se pudo copiar automáticamente. Selecciona el texto y cópialo.'}
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button variant="secondary" onClick={onClose} className="sm:flex-1">
            Ya la guardé
          </Button>
          <Button onClick={() => void copy()} className="sm:flex-1">
            Copiar clave
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
