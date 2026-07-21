import { createContext, use } from 'react'
import type { MeQuery } from '@/graphql/generated/graphql'

export type SessionUser = MeQuery['me']

export type SessionValue = {
  user: SessionUser | null
  /** True mientras se resuelve la sesión inicial: aún no se sabe si hay usuario. */
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

export const SessionContext = createContext<SessionValue | null>(null)

export function useSession(): SessionValue {
  const value = use(SessionContext)
  if (!value) {
    throw new Error('useSession debe usarse dentro de <SessionProvider>')
  }
  return value
}

/**
 * El `userId` que exigen categorías, gastos e ingresos.
 *
 * Estos hooks lo inyectan solos: ningún componente debe pasar el userId a mano
 * o acabará olvidado en alguna llamada. Lanza si no hay sesión, porque llamar a
 * esas operaciones sin usuario es un bug de rutas, no un caso a manejar.
 */
export function useCurrentUserId(): string {
  const { user } = useSession()
  if (!user) {
    throw new Error('No hay usuario en sesión: ¿falta un guard de ruta?')
  }
  return user.id
}
