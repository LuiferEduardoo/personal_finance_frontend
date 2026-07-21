/** Códigos de error que devuelve el backend en `extensions.code`. */
export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'GRAPHQL_VALIDATION_FAILED'
  | 'INTERNAL_SERVER_ERROR'

/** Mensajes genéricos para los códigos cuyo texto del backend no sirve al usuario. */
const FALLBACK_MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  INTERNAL_SERVER_ERROR: 'Algo falló en el servidor. Inténtalo de nuevo.',
  // Una query desalineada con el esquema es un bug nuestro: el usuario no puede
  // hacer nada con el mensaje real, así que no se lo mostramos.
  GRAPHQL_VALIDATION_FAILED: 'Algo falló en la aplicación. Inténtalo de nuevo.',
}

type GraphQLErrorLike = {
  message: string
  extensions?: { code?: unknown } | null
}

export function getErrorCode(error: GraphQLErrorLike): ApiErrorCode | null {
  const code = error.extensions?.code
  return typeof code === 'string' ? (code as ApiErrorCode) : null
}

/**
 * Texto que se muestra al usuario.
 *
 * Los mensajes de BAD_REQUEST y CONFLICT vienen del backend ya en español y son
 * específicos ("Las categorías del sistema no se pueden eliminar"), así que se
 * muestran tal cual. Los demás se sustituyen.
 */
export function getUserMessage(error: GraphQLErrorLike): string {
  const code = getErrorCode(error)
  if (code && FALLBACK_MESSAGES[code]) return FALLBACK_MESSAGES[code]
  return error.message || 'Algo falló. Inténtalo de nuevo.'
}

/** Extrae el mensaje presentable del primer error de una respuesta de Apollo. */
export function getFirstErrorMessage(error: unknown): string {
  const graphQLErrors = (error as { graphQLErrors?: GraphQLErrorLike[] })?.graphQLErrors
  const first = graphQLErrors?.[0]
  if (first) return getUserMessage(first)

  // Sin errores de GraphQL, el fallo es de red.
  return 'No se pudo conectar con el servidor. Revisa tu conexión.'
}
