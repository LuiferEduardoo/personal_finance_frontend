import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage } from '@/api/http'
import { Button } from '@/components/Button'
import { ErrorState } from '@/components/states'
import type { ExpenseDraft } from './invoice'
import {
  ACCEPTED_IMAGE_TYPES,
  analyzeInvoiceImage,
  analyzeInvoiceText,
  validateImage,
} from './invoices.api'

type Source = 'image' | 'text'

const SOURCES: { value: Source; label: string }[] = [
  { value: 'image', label: 'Foto' },
  { value: 'text', label: 'Texto' },
]

/**
 * Primer paso: la factura entra como foto o como texto pegado. El backend la
 * lee con un modelo de lenguaje y devuelve un borrador de gasto — que SIEMPRE
 * pasa por revisión antes de guardarse; aquí no se crea nada.
 */
export function InvoiceCapture({
  onAnalyzed,
}: {
  onAnalyzed: (draft: ExpenseDraft) => void
}) {
  const [source, setSource] = useState<Source>('image')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // La URL del preview es un recurso vivo: sin revocarla, cada foto elegida deja
  // el blob anterior retenido en memoria.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pickFile = (picked: File | undefined) => {
    setError(null)
    if (!picked) return
    const invalid = validateImage(picked)
    if (invalid) {
      setFile(null)
      setError(invalid)
      return
    }
    setFile(picked)
  }

  const analyze = async () => {
    setError(null)
    setIsAnalyzing(true)
    try {
      const draft =
        source === 'image' && file
          ? await analyzeInvoiceImage(file)
          : await analyzeInvoiceText(text)
      onAnalyzed(draft)
    } catch (caught) {
      setError(getApiErrorMessage(caught))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = source === 'image' ? file !== null : text.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Origen de la factura"
        className="border-border bg-surface-sunken flex gap-1 rounded-lg border p-1"
      >
        {SOURCES.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={source === option.value}
            onClick={() => {
              setSource(option.value)
              setError(null)
            }}
            className={`min-h-10 flex-1 rounded-md text-sm font-medium ${
              source === option.value
                ? 'bg-surface-raised text-ink shadow-sm'
                : 'text-ink-secondary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {source === 'image' ? (
        <div className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            className="sr-only"
            onChange={(event) => pickFile(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border-border hover:bg-surface-sunken flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Factura seleccionada"
                className="max-h-56 rounded-lg object-contain"
              />
            ) : (
              <>
                <CameraIcon />
                <span className="text-ink text-sm font-medium">
                  Haz una foto o elige una imagen
                </span>
                <span className="text-ink-muted text-xs">
                  JPEG, PNG o WEBP · hasta 10 MB
                </span>
              </>
            )}
          </button>
          {file && (
            <p className="text-ink-secondary text-sm">
              {file.name}
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-ink-secondary hover:text-ink ml-2 underline"
              >
                Quitar
              </button>
            </p>
          )}
        </div>
      ) : (
        <label className="text-ink-secondary text-sm font-medium">
          Texto de la factura
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={10}
            placeholder={'ÉXITO\n2 x Leche entera 1L  8.400\n...'}
            className="border-border bg-surface-raised text-ink placeholder:text-ink-muted focus:border-ink mt-1.5 w-full rounded-lg border p-3 text-base outline-none"
          />
        </label>
      )}

      {error && <ErrorState message={error} />}

      <Button
        onClick={() => void analyze()}
        disabled={!canAnalyze}
        isLoading={isAnalyzing}
      >
        {isAnalyzing ? 'Leyendo la factura…' : 'Leer factura'}
      </Button>

      <p className="text-ink-muted text-xs">
        Lo que se lea es un borrador: podrás corregirlo antes de registrar el gasto.
      </p>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-ink-muted size-8"
    >
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  )
}
