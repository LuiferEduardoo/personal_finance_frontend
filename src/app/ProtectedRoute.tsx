import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '@/features/auth/SessionContext'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSession()
  const location = useLocation()

  // Con tokens en disco pero `me` todavía en vuelo, no se sabe si hay sesión.
  // Redirigir aquí mandaría al login a un usuario válido en cada recarga.
  if (isLoading) return <FullScreenLoader />

  if (!isAuthenticated) {
    // `state` guarda a dónde iba para volver ahí tras entrar.
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

/** Solo para rutas de invitado: si ya hay sesión, no tiene sentido el login. */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) return <FullScreenLoader />
  if (isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}

function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center" role="status">
      <span className="sr-only">Cargando…</span>
      <svg
        className="text-ink-muted size-6 animate-spin"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        <path
          d="M14 8a6 6 0 0 0-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
