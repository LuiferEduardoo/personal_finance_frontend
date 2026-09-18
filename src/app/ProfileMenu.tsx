import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useSession } from '@/features/auth/SessionContext'

export function ProfileMenu() {
  const { user, logout } = useSession()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const close = () => detailsRef.current?.removeAttribute('open')
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email ||
    'Perfil'

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) close()
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [])

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        aria-label="Abrir menú de perfil"
        className="border-border bg-surface-raised text-ink hover:bg-surface-sunken flex size-11 cursor-pointer list-none items-center justify-center rounded-full border [&::-webkit-details-marker]:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-6"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      </summary>

      <div className="border-border bg-surface-raised absolute top-[calc(100%+0.5rem)] right-0 z-40 w-64 rounded-lg border p-2 shadow-lg">
        <div className="border-border border-b px-3 py-2.5">
          <p className="text-ink truncate text-sm font-medium">{displayName}</p>
          {user?.email && displayName !== user.email && (
            <p className="text-ink-muted mt-0.5 truncate text-xs">{user.email}</p>
          )}
        </div>

        <MenuLink to="/ajustes" onClick={close}>
          Configuración del perfil
        </MenuLink>

        <div className="lg:hidden">
          <p className="text-ink-muted px-3 pt-3 pb-1 text-[0.6875rem] font-semibold tracking-wider uppercase">
            Organización
          </p>
          <MenuLink to="/categorias" onClick={close}>
            Categorías
          </MenuLink>
          <MenuLink to="/recurrentes" onClick={close}>
            Gastos recurrentes
          </MenuLink>
        </div>

        <p className="text-ink-muted px-3 pt-3 pb-1 text-[0.6875rem] font-semibold tracking-wider uppercase">
          Desarrollador
        </p>
        <MenuLink to="/api-keys" onClick={close}>
          API keys
        </MenuLink>

        <div className="border-border mt-2 border-t pt-2">
          <button
            type="button"
            onClick={() => {
              close()
              void logout()
            }}
            className="text-ink-secondary hover:bg-surface-sunken flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </details>
  )
}

function MenuLink({
  to,
  onClick,
  children,
}: {
  to: string
  onClick: () => void
  children: string
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-ink-secondary hover:bg-surface-sunken flex min-h-11 items-center rounded-md px-3 text-sm font-medium"
    >
      {children}
    </Link>
  )
}
