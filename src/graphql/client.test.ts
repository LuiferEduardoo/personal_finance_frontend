import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRefreshForTests } from '@/features/auth/refresh'
import { resetTokenStoreForTests, setTokens } from '@/features/auth/tokenStore'
import { LoginMutation } from '@/features/auth/auth.queries'
import { MeQuery } from '@/features/auth/auth.queries'
import { apolloClient } from './client'

/**
 * El backend devuelve UNAUTHENTICATED en dos situaciones muy distintas:
 * credenciales incorrectas en `login`, y access token caducado en el resto.
 * Confundirlas hace que el usuario vea "revisa tu conexión" cuando en realidad
 * escribió mal la contraseña.
 */

function unauthenticatedResponse(message: string) {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: async () =>
      JSON.stringify({
        data: null,
        errors: [{ message, extensions: { code: 'UNAUTHENTICATED' } }],
      }),
  } as Response
}

describe('errorLink', () => {
  beforeEach(() => {
    resetTokenStoreForTests()
    resetRefreshForTests()
    apolloClient.stop()
    void apolloClient.clearStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('no intenta renovar cuando fallan las credenciales de login', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(unauthenticatedResponse('Credenciales inválidas'))

    await expect(
      apolloClient.mutate({
        mutation: LoginMutation,
        variables: { input: { email: 'a@b.com', password: 'mala' } },
        fetchPolicy: 'no-cache',
      }),
    ).rejects.toSatisfy((error: { graphQLErrors?: { message: string }[] }) => {
      // El mensaje real del backend debe sobrevivir hasta el formulario.
      return error.graphQLErrors?.[0]?.message === 'Credenciales inválidas'
    })

    // Una sola llamada: la del login. Si hubiese intento de refresh, serían dos.
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('no intenta renovar si no hay sesión', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(unauthenticatedResponse('No autenticado'))

    await expect(
      apolloClient.query({ query: MeQuery, fetchPolicy: 'no-cache' }),
    ).rejects.toThrow()

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('renueva y reintenta una vez cuando el access token caducó', async () => {
    setTokens({ accessToken: 'access-v1', refreshToken: 'refresh-v1' })

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      // 1: la query falla por token caducado
      .mockResolvedValueOnce(unauthenticatedResponse('Token expirado'))
      // 2: el refresh (fetch directo, no pasa por Apollo)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            refreshTokens: { accessToken: 'access-v2', refreshToken: 'refresh-v2' },
          },
        }),
      } as Response)
      // 3: el reintento, ya con el token nuevo
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () =>
          JSON.stringify({
            data: {
              me: {
                __typename: 'User',
                id: 'u1',
                email: 'a@b.com',
                firstName: 'Ana',
                lastName: null,
                avatar: null,
                baseCurrency: 'COP',
                financeBaseCurrency: 'COP',
                investmentBaseCurrency: 'USD',
                timezone: 'America/Bogota',
              },
            },
          }),
      } as Response)

    const result = await apolloClient.query({ query: MeQuery, fetchPolicy: 'no-cache' })

    expect(result.data.me.id).toBe('u1')
    expect(fetchSpy).toHaveBeenCalledTimes(3)

    // El reintento debe llevar el token renovado, no el caducado.
    // Apollo normaliza los nombres de cabecera a minúsculas.
    const retryCall = fetchSpy.mock.calls[2]
    expect(retryCall).toBeDefined()

    const retryHeaders = (retryCall![1] as RequestInit).headers as Record<
      string,
      string
    >
    expect(retryHeaders.authorization).toBe('Bearer access-v2')
  })
})
