import { Button } from '@/components/Button'
import { useSession } from '@/features/auth/SessionContext'

export function SettingsPage() {
  const { user, logout } = useSession()

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Ajustes</h1>

      {user && (
        <dl className="border-border bg-surface-raised divide-border mt-6 divide-y rounded-lg border">
          <Row
            label="Nombre"
            value={[user.firstName, user.lastName].filter(Boolean).join(' ')}
          />
          <Row label="Correo" value={user.email} />
          <Row label="Moneda base" value={user.baseCurrency} />
          <Row label="Zona horaria" value={user.timezone} />
        </dl>
      )}

      <Button variant="secondary" onClick={() => void logout()} className="mt-6">
        Cerrar sesión
      </Button>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-ink-secondary text-sm">{label}</dt>
      <dd className="text-ink text-sm font-medium">{value}</dd>
    </div>
  )
}
