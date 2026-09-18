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
