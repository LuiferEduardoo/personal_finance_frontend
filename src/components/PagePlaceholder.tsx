/**
 * Marcador para las secciones que llegan en fases posteriores.
 * Se borra cuando cada fase entrega su pantalla real.
 */
export function PagePlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">{title}</h1>
      <p className="text-ink-secondary mt-2 text-sm">Llega en la {phase}.</p>
    </div>
  )
}
