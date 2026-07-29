import { refreshSession } from '@/features/auth/refresh'
import { getAccessToken } from '@/features/auth/tokenStore'
import { API_BASE_URL } from './env'

/**
 * Cliente REST para los endpoints que no son GraphQL (`/invoices/*`).
 *
 * Reproduce las dos garantías que da el link de Apollo, porque el token y su
 * rotación son los mismos: adjunta el access token vigente (leído en cada
 * petición, no capturado) y, ante un 401, renueva UNA vez y reintenta. La
 * renovación pasa por `refreshSession`, que serializa las llamadas concurrentes
 * — si no, una petición REST y una GraphQL caducadas a la vez se revocarían el
 * refresh token entre ellas.
 */

export class ApiError extends Error {
  readonly status: number
  /** Texto crudo del backend, antes de sustituirlo por uno presentable. */
  readonly rawMessage: string

  constructor(status: number, message: string, rawMessage: string = message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.rawMessage = rawMessage
  }
}

/**
 * Mensajes por código. Solo el 400 trae del backend un texto que el usuario
 * pueda accionar ("Falta el campo image"); el resto describe fallos internos
 * que hay que traducir a algo útil.
 */
const FALLBACK_MESSAGES: Record<number, string> = {
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  413: 'La imagen pesa demasiado. Usa una foto de menos de 10 MB.',
  502: 'No pudimos leer la factura. Prueba con otra foto o pega el texto.',
  503: 'El servidor no tiene configurada la lectura de facturas. Avisa a quien lo administre.',
}

const GENERIC_MESSAGE = 'Algo falló en el servidor. Inténtalo de nuevo.'

/** El cuerpo de error de Nest: `{ statusCode, error, message }`. */
type ErrorBody = {
  statusCode?: number
  error?: string
  /** Nest devuelve un array cuando falla la validación de varios campos. */
  message?: string | string[]
}

function messageFromBody(body: ErrorBody | null): string | null {
  const message = body?.message
  if (Array.isArray(message)) return message.join('. ') || null
  return typeof message === 'string' && message ? message : null
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: ErrorBody | null = null
  try {
    body = (await response.json()) as ErrorBody
  } catch {
    // Un 502 de un proxy puede llegar en HTML: seguimos con el código.
  }

  const raw = messageFromBody(body) ?? response.statusText
  const fallback = FALLBACK_MESSAGES[response.status]
  if (fallback) return new ApiError(response.status, fallback, raw)

  // 400 (y 409, 404…) traen mensajes del backend ya en español y específicos.
  if (response.status < 500 && messageFromBody(body)) {
    return new ApiError(response.status, raw, raw)
  }
  return new ApiError(response.status, GENERIC_MESSAGE, raw)
}

export type ApiRequest = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  /** Cuerpo JSON. Excluyente con `form`. */
  json?: unknown
  /**
   * Cuerpo multipart. NO se le pone `Content-Type` a mano: el navegador añade
   * el boundary, y fijarlo rompe el parseo en el servidor.
   */
  form?: FormData
  signal?: AbortSignal
}

function send(path: string, request: ApiRequest, token: string | null) {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (request.json !== undefined) headers['Content-Type'] = 'application/json'

  return fetch(`${API_BASE_URL}${path}`, {
    method:
      request.method ?? (request.json !== undefined || request.form ? 'POST' : 'GET'),
    headers,
    body:
      request.form ??
      (request.json !== undefined ? JSON.stringify(request.json) : undefined),
    signal: request.signal,
  })
}

/**
 * Lanza `ApiError` con el mensaje ya presentable si la respuesta no es 2xx.
 * Los fallos de red salen como `TypeError` de fetch, igual que en Apollo.
 */
export async function apiFetch<T>(path: string, request: ApiRequest = {}): Promise<T> {
  let response = await send(path, request, getAccessToken())

  if (response.status === 401 && getAccessToken()) {
    const tokens = await refreshSession()
    // Sin tokens la sesión está muerta; `refreshSession` ya los limpió, así que
    // el guard de rutas llevará al login en cuanto se repinte.
    if (!tokens) throw await toApiError(response)
    // Un solo reintento: si el token recién emitido tampoco vale, el 401 es real.
    response = await send(path, request, tokens.accessToken)
  }

  if (!response.ok) throw await toApiError(response)

  return (await response.json()) as T
}

/** Texto que se muestra al usuario ante cualquier fallo de una llamada REST. */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'No se pudo conectar con el servidor. Revisa tu conexión.'
}
