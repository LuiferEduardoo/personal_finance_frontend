import { useApolloClient, useQuery } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LogoutMutation, MeQuery } from './auth.queries'
import { SessionContext, type SessionValue } from './SessionContext'
import { clearTokens, getTokens, subscribeToTokens } from './tokenStore'

export function SessionProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [hasTokens, setHasTokens] = useState(() => getTokens() !== null)

  // Los tokens cambian fuera de React (el errorLink los renueva, el store los
  // limpia si la sesión muere), así que hay que suscribirse.
  useEffect(() => subscribeToTokens((tokens) => setHasTokens(tokens !== null)), [])

  const { data, loading } = useQuery(MeQuery, {
    // Sin tokens no hay a quién preguntar; la query pediría un 401 seguro.
    skip: !hasTokens,
    // Si `me` falla, el errorLink ya habrá intentado renovar. Que llegue aquí
    // significa que la sesión no es recuperable.
    onError: () => clearTokens(),
  })

  const logout = useCallback(async () => {
    const tokens = getTokens()
    if (tokens) {
      try {
        await client.mutate({
          mutation: LogoutMutation,
          variables: { refreshToken: tokens.refreshToken },
        })
      } catch {
        // Si la revocación falla (red caída, token ya expirado), la sesión
        // local se cierra igual: dejar al usuario dentro sería peor.
      }
    }
    clearTokens()
    // La caché guarda datos del usuario que se va.
    await client.clearStore()
  }, [client])

  const value = useMemo<SessionValue>(
    () => ({
      user: data?.me ?? null,
      // Con tokens pero sin datos aún, la sesión sigue resolviéndose.
      isLoading: hasTokens && loading,
      isAuthenticated: hasTokens && data?.me != null,
      logout,
    }),
    [data?.me, hasTokens, loading, logout],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}
