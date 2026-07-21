/**
 * Almacenamiento de los tokens de sesión.
 *
 * Se guarda en localStorage para que la sesión sobreviva a un recargo. El
 * refresh token rota en cada uso, así que aquí SIEMPRE vive el último emitido:
 * escribir uno viejo encima invalidaría la sesión en la siguiente renovación.
 */

const ACCESS_KEY = 'pf.accessToken'
const REFRESH_KEY = 'pf.refreshToken'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

/** Suscriptores a los cambios de sesión (el provider de React repinta con esto). */
type Listener = (tokens: Tokens | null) => void
const listeners = new Set<Listener>()

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // localStorage bloqueado (Safari en modo privado): la sesión funciona,
    // pero solo en memoria durante esta pestaña.
    return null
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Ver read(): sin persistencia, seguimos adelante.
  }
}

/**
 * Copia en memoria: es la fuente de verdad durante la sesión. Evita releer
 * localStorage en cada petición y funciona aunque el almacenamiento falle.
 */
let cache: Tokens | null = null
let hydrated = false

function hydrate(): void {
  if (hydrated) return
  hydrated = true
  const accessToken = read(ACCESS_KEY)
  const refreshToken = read(REFRESH_KEY)
  // Media sesión no es sesión: si falta cualquiera de los dos, no hay nada.
  cache = accessToken && refreshToken ? { accessToken, refreshToken } : null
}

export function getTokens(): Tokens | null {
  hydrate()
  return cache
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null
}

export function setTokens(tokens: Tokens | null): void {
  hydrated = true
  cache = tokens
  write(ACCESS_KEY, tokens?.accessToken ?? null)
  write(REFRESH_KEY, tokens?.refreshToken ?? null)
  for (const listener of listeners) listener(tokens)
}

export function clearTokens(): void {
  setTokens(null)
}

export function subscribeToTokens(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Solo para tests: devuelve el módulo a su estado inicial.
 * Limpia también el almacenamiento — si no, el siguiente `getTokens()`
 * rehidrataría la sesión que se acaba de borrar.
 */
export function resetTokenStoreForTests(): void {
  cache = null
  hydrated = false
  listeners.clear()
  write(ACCESS_KEY, null)
  write(REFRESH_KEY, null)
}
