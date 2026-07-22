import { Link } from 'react-router'
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

      {/* Cuentas, categorías y recurrentes se gestionan poco: no ocupan sitio en
          la tab bar y viven aquí. */}
      <div className="mt-4 flex flex-col gap-2">
        <SettingsLink to="/cuentas" label="Cuentas" />
        <SettingsLink to="/categorias" label="Categorías" />
        <SettingsLink to="/recurrentes" label="Gastos recurrentes" />
      </div>

      <Button variant="secondary" onClick={() => void logout()} className="mt-6">
        Cerrar sesión
      </Button>
    </div>
  )
}

function SettingsLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="border-border bg-surface-raised hover:bg-surface-sunken flex min-h-11 items-center justify-between rounded-lg border px-4 py-3"
    >
      <span className="text-ink text-sm font-medium">{label}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-ink-muted size-5"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
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
