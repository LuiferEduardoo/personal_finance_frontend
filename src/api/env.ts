import { GRAPHQL_ENDPOINT } from '@/graphql/env'

/**
 * Base de la API REST del backend.
 *
 * La API sigue siendo GraphQL salvo el análisis de facturas, que necesita subir
 * un fichero y vive en `/invoices/*`. Como corre en el MISMO servidor, la base
 * se deriva del endpoint de GraphQL quitándole `/graphql`: así una sola variable
 * sigue bastando para apuntar a otro backend. `VITE_API_BASE_URL` permite
 * separarlos si algún día dejan de compartir host.
 */
const configured = import.meta.env.VITE_API_BASE_URL as string | undefined

function deriveFromGraphql(endpoint: string): string {
  return endpoint.replace(/\/graphql\/?$/, '')
}

export const API_BASE_URL: string = (
  configured?.trim() || deriveFromGraphql(GRAPHQL_ENDPOINT)
).replace(/\/$/, '')
