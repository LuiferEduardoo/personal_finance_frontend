import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/utilities'
import { refreshSession } from '@/features/auth/refresh'
import { clearTokens, getAccessToken } from '@/features/auth/tokenStore'
import { GRAPHQL_ENDPOINT } from './env'
import { getErrorCode } from './errors'

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT })

/** Adjunta el access token vigente. Se lee en cada petición, no se captura. */
const authLink = setContext((_operation, { headers }) => {
  const token = getAccessToken()
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

/**
 * Operaciones cuyo UNAUTHENTICATED NO significa "token caducado":
 * en login son credenciales incorrectas, en register un fallo de alta, y el
 * propio refresh no puede renovarse a sí mismo.
 */
const OPERATIONS_WITHOUT_REFRESH = new Set(['Login', 'Register', 'RefreshTokens'])

/**
 * Reintenta una vez tras renovar el token.
 *
 * `refreshSession` ya serializa las renovaciones concurrentes, así que varias
 * operaciones caducadas a la vez comparten una sola llamada al backend en lugar
 * de revocarse el token entre ellas.
 */
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const isAuthError = graphQLErrors?.some(
    (error) => getErrorCode(error) === 'UNAUTHENTICATED',
  )
  if (!isAuthError) return

  // OJO: el backend devuelve UNAUTHENTICATED también cuando fallan las
  // credenciales de `login` (verificado: "Credenciales inválidas" llega con ese
  // código, no con UNAUTHORIZED como sugiere la doc de la API). Renovar ahí no
  // tiene sentido y además taparía el mensaje real del backend con un error de
  // red. Estas operaciones se dejan pasar con su error intacto.
  if (OPERATIONS_WITHOUT_REFRESH.has(operation.operationName)) return

  // Sin tokens no hay nada que renovar: el 401 es legítimo.
  if (!getAccessToken()) return

  // Marca de un solo reintento. Sin esto, un token que el backend rechaza
  // siempre produciría un bucle infinito de renovar y reintentar.
  const context = operation.getContext()
  if (context.hasRetriedAfterRefresh) {
    clearTokens()
    return
  }

  return new Observable((observer) => {
    let subscription: { unsubscribe: () => void } | undefined

    refreshSession()
      .then((tokens) => {
        if (!tokens) {
          // Sesión irrecuperable: propagar el error original para que el guard
          // de rutas lleve al login.
          observer.error(new Error('UNAUTHENTICATED'))
          return
        }

        operation.setContext({ ...context, hasRetriedAfterRefresh: true })
        subscription = forward(operation).subscribe(observer)
      })
      .catch((error: unknown) => observer.error(error))

    return () => subscription?.unsubscribe()
  })
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Estas listas se filtran por argumentos; cachearlas por sus
          // variables evita que un filtro pise el resultado de otro.
          expenses: { keyArgs: ['userId', 'filter'] },
          incomes: { keyArgs: ['userId', 'filter'] },
          categories: { keyArgs: ['userId', 'kind'] },
          products: { keyArgs: ['search', 'includeInactive'] },
          productPurchases: { keyArgs: ['productId'] },
          consumptionCycles: { keyArgs: ['productId'] },
          articles: { keyArgs: ['search', 'type', 'includeInactive'] },
        },
      },
    },
  }),
})
