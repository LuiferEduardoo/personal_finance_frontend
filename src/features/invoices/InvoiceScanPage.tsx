import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/Button'
import { Money } from '@/components/Money'
import { InvoiceCapture } from './InvoiceCapture'
import { InvoiceReviewForm } from './InvoiceReviewForm'
import type { ExpenseDraft } from './invoice'
import type { CreatedExpense } from './invoices.api'

/**
 * Escanear factura: capturar → revisar → registrar.
 *
 * El borrador NUNCA se guarda solo. Lo escribe un modelo de lenguaje a partir
 * de una foto o de texto pegado, así que puede equivocarse en el precio, en la
 * fecha o en el artículo; el paso de revisión es parte del flujo, no un extra.
 */
export function InvoiceScanPage() {
  const [draft, setDraft] = useState<ExpenseDraft | null>(null)
  const [created, setCreated] = useState<CreatedExpense | null>(null)

  const startOver = () => {
    setDraft(null)
    setCreated(null)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Escanear factura</h1>
      <p className="text-ink-secondary mt-1 text-sm">
        {created
          ? 'Gasto registrado.'
          : draft
            ? 'Revisa lo que se leyó y elige la cuenta antes de registrarlo.'
            : 'Sube una foto de la factura o pega su texto.'}
      </p>

      <div className="mt-6">
        {created ? (
          <div className="border-border flex flex-col gap-4 rounded-lg border p-6 text-center">
            <p className="text-ink text-sm">{created.description}</p>
            <Money
              amount={created.amount}
              currency={created.currency || 'COP'}
              direction="out"
              size="lg"
              className="justify-center"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={startOver}>Escanear otra</Button>
              <Link
                to="/movimientos"
                className="border-border text-ink hover:bg-surface-sunken inline-flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium"
              >
                Ver movimientos
              </Link>
            </div>
          </div>
        ) : draft ? (
          <InvoiceReviewForm
            draft={draft}
            onCancel={startOver}
            onCreated={(expense) => {
              setDraft(null)
              setCreated(expense)
            }}
          />
        ) : (
          <InvoiceCapture onAnalyzed={setDraft} />
        )}
      </div>
    </div>
  )
}
