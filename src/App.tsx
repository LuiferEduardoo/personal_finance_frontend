import { Money } from '@/components/Money'

/**
 * Página temporal de la fase 0: verifica que los tokens de color, el modo oscuro
 * y el componente Money funcionan. Se sustituye por el router en la fase 1.
 */
export default function App() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Sistema de color</h1>
      <p className="text-ink-secondary mt-1 text-sm">
        Comprobación de tokens. Cambia el tema del sistema para validar el modo oscuro.
      </p>

      <section className="mt-8">
        <h2 className="text-ink-secondary text-sm font-medium">Semánticos</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ['income', 'Ingresos', 'bg-income'],
              ['expense', 'Gastos', 'bg-expense'],
              ['warning', 'Avisos', 'bg-warning'],
              ['neutral', 'Neutros', 'bg-neutral'],
            ] as const
          ).map(([token, label, bg]) => (
            <li
              key={token}
              className="border-border bg-surface-raised overflow-hidden rounded-lg border"
            >
              <div className={`h-14 ${bg}`} />
              <div className="p-3">
                <p className="text-ink text-sm font-medium">{label}</p>
                <p className="text-ink-muted text-xs">--color-{token}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-ink-secondary text-sm font-medium">
          Importes con signo e icono
        </h2>
        <p className="text-ink-muted mt-1 text-xs">
          Ponlo en escala de grises: deben seguir distinguiéndose.
        </p>
        <div className="divide-border border-border bg-surface-raised mt-3 divide-y rounded-lg border">
          {(
            [
              ['Pago nómina julio', 4_500_000, 'in'],
              ['Mercado semana', 185_000, 'out'],
              ['Arriendo', 1_200_000, 'out'],
            ] as const
          ).map(([description, amount, direction]) => (
            <div
              key={description}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-ink text-sm">{description}</span>
              <Money amount={amount} currency="COP" direction={direction} size="sm" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
