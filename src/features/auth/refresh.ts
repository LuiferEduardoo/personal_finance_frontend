import { GRAPHQL_ENDPOINT } from '@/graphql/env'
import { clearTokens, getTokens, setTokens, type Tokens } from './tokenStore'

/**
 * Renovación del access token.
 *
 * EL PUNTO DELICADO: el refresh token ROTA. Cada llamada a `refreshTokens`
 * revoca el token enviado y emite uno nuevo; reutilizar el anterior devuelve
 * UNAUTHORIZED y mata la sesión.
 *
 * Si tres peticiones caducan a la vez y cada una dispara su propia renovación,
 * la primera invalida el token que las otras dos están a punto de usar y el
 * usuario acaba en el login sin motivo aparente. Por eso hay UNA sola promesa
 * en vuelo: quien llegue mientras hay una renovación en curso espera a esa
 * misma promesa en lugar de lanzar la suya.
 */

let inFlight: Promise<Tokens | null> | null = null

/**
 * La mutación se envía con fetch directo, no con Apollo, a propósito: usar el
 * cliente aquí crearía un ciclo (el errorLink que reacciona al 401 es justo
 * quien llama a esta función).
 */
async function requestNewTokens(refreshToken: string): Promise<Tokens | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation RefreshTokens($refreshToken: String!) {
            refreshTokens(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    })

    if (!response.ok) return null

    const body: {
      data?: { refreshTokens?: Tokens | null } | null
      errors?: unknown[]
    } = await response.json()

    if (body.errors?.length) return null

    const tokens = body.data?.refreshTokens
    if (!tokens?.accessToken || !tokens.refreshToken) return null

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
  } catch {
    // Fallo de red: no distinguible aquí de un token revocado, pero el efecto
    // para el llamante es el mismo — no hay tokens nuevos.
    return null
  }
}

/**
 * Devuelve tokens nuevos, o `null` si la sesión ya no es recuperable.
 * Llamadas concurrentes comparten la misma renovación.
 */
export function refreshSession(): Promise<Tokens | null> {
  // Ya hay una renovación en curso: engancharse a ella.
  if (inFlight) return inFlight

  const current = getTokens()
  if (!current) return Promise.resolve(null)

  inFlight = requestNewTokens(current.refreshToken)
    .then((tokens) => {
      if (tokens) setTokens(tokens)
      // Sin tokens la sesión está muerta: limpiar para que el guard de rutas
      // redirija al login en vez de reintentar en bucle.
      else clearTokens()
      return tokens
    })
    .finally(() => {
      // Liberar el hueco pase lo que pase, o un fallo dejaría la app sin poder
      // volver a renovar nunca.
      inFlight = null
    })

  return inFlight
}

/** Solo para tests. */
export function resetRefreshForTests(): void {
  inFlight = null
}
