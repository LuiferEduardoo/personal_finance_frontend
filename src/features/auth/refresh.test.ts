import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { refreshSession, resetRefreshForTests } from './refresh'
import { getTokens, resetTokenStoreForTests, setTokens } from './tokenStore'

/**
 * Estos tests cubren la rotación del refresh token, que es donde un fallo se
 * manifiesta como "me cierra la sesión sola" y cuesta reproducir a mano.
 */

function mockRefreshResponse(tokens: { accessToken: string; refreshToken: string }) {
  return {
    ok: true,
    json: async () => ({ data: { refreshTokens: tokens } }),
  } as Response
}

function mockErrorResponse() {
  return {
    ok: true,
    json: async () => ({
      data: null,
      errors: [
        { message: 'Refresh token inválido', extensions: { code: 'UNAUTHENTICATED' } },
      ],
    }),
  } as Response
}

describe('refreshSession', () => {
  beforeEach(() => {
    resetTokenStoreForTests()
    resetRefreshForTests()
    setTokens({ accessToken: 'access-v1', refreshToken: 'refresh-v1' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('guarda los tokens nuevos que devuelve el backend', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockRefreshResponse({ accessToken: 'access-v2', refreshToken: 'refresh-v2' }),
    )

    const tokens = await refreshSession()

    expect(tokens).toEqual({ accessToken: 'access-v2', refreshToken: 'refresh-v2' })
    expect(getTokens()).toEqual({
      accessToken: 'access-v2',
      refreshToken: 'refresh-v2',
    })
  })

  it('serializa las renovaciones concurrentes en una sola petición', async () => {
    // El escenario que rompe la sesión: tres peticiones caducan a la vez.
    // Si cada una renovase por su cuenta, la primera revocaría el token que
    // las otras dos van a enviar.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        mockRefreshResponse({ accessToken: 'access-v2', refreshToken: 'refresh-v2' }),
      )

    const results = await Promise.all([
      refreshSession(),
      refreshSession(),
      refreshSession(),
    ])

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    // Las tres reciben el mismo resultado, no un token ya revocado.
    for (const result of results) {
      expect(result).toEqual({ accessToken: 'access-v2', refreshToken: 'refresh-v2' })
    }
  })

  it('envía el refresh token más reciente, no el original', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        mockRefreshResponse({ accessToken: 'access-v2', refreshToken: 'refresh-v2' }),
      )
      .mockResolvedValueOnce(
        mockRefreshResponse({ accessToken: 'access-v3', refreshToken: 'refresh-v3' }),
      )

    await refreshSession()
    await refreshSession()

    const secondCall = fetchSpy.mock.calls[1]
    expect(secondCall).toBeDefined()

    const secondCallBody = JSON.parse((secondCall![1] as RequestInit).body as string)
    expect(secondCallBody.variables.refreshToken).toBe('refresh-v2')
  })

  it('permite renovar de nuevo tras un fallo', async () => {
    // Si el hueco de la promesa en vuelo no se liberase, un fallo dejaría la
    // app sin poder renovar nunca más.
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(mockErrorResponse())
      .mockResolvedValueOnce(
        mockRefreshResponse({ accessToken: 'access-v2', refreshToken: 'refresh-v2' }),
      )

    expect(await refreshSession()).toBeNull()

    setTokens({ accessToken: 'access-v1', refreshToken: 'refresh-v1' })
    expect(await refreshSession()).not.toBeNull()
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('limpia la sesión cuando el refresh token ya no vale', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockErrorResponse())

    const tokens = await refreshSession()

    expect(tokens).toBeNull()
    // Sin esto el guard de rutas reintentaría en bucle en vez de ir al login.
    expect(getTokens()).toBeNull()
  })

  it('no llama al backend si no hay sesión', async () => {
    resetTokenStoreForTests()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    expect(await refreshSession()).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('trata un fallo de red como sesión no recuperable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'))

    await expect(refreshSession()).resolves.toBeNull()
  })
})
