/**
 * Punto único donde se lee la configuración del endpoint.
 * Ningún componente ni hook debe conocer la URL.
 */
const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT

if (!endpoint) {
  // Fallar aquí y no en la primera petición: el error es de configuración y se
  // arregla en el .env, no en el código que hizo la query.
  throw new Error(
    'Falta VITE_GRAPHQL_ENDPOINT. Copia .env.example a .env y ajusta la URL del backend.',
  )
}

export const GRAPHQL_ENDPOINT: string = endpoint
