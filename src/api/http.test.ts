import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetRefreshForTests } from '@/features/auth/refresh'
import {
  getTokens,
  resetTokenStoreForTests,
  setTokens,
} from '@/features/auth/tokenStore'
import { apiFetch, ApiError } from './http'

/**
 * El cliente REST comparte tokens con Apollo, así que lo que se prueba aquí es
 * justo lo que se rompe al duplicar capa de red: que adjunte el token, que
 * renueve UNA vez ante un 401, y que no le enseñe al usuario el texto crudo de
 * un 502 de OpenAI.
 */

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    json: async () => body,
  } as Response
}

function tokenOf(call: unknown[]): string | undefined {
  const init = call[1] as RequestInit
  return (init.headers as Record<string, string>).Authorization
}

describe('apiFetch', () => {
  beforeEach(() => {
    resetTokenStoreForTests()
    resetRefreshForTests()
    setTokens({ accessToken: 'access-v1', refreshToken: 'refresh-v1' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adjunta el access token vigente', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse(201, { id: 'expense-1' }))

    await apiFetch('/invoices/expense', { json: { description: 'x' } })

    expect(tokenOf(fetchSpy.mock.calls[0] ?? [])).toBe('Bearer access-v1')
  })

  it('renueva y reintenta una vez ante un 401', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      // 1) la petición original caduca
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Unauthorized' }))
      // 2) el refresh (GraphQL) devuelve tokens nuevos
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: {
            refreshTokens: { accessToken: 'access-v2', refreshToken: 'refresh-v2' },
          },
        }),
      )
      // 3) el reintento, ya con el token nuevo
      .mockResolvedValueOnce(jsonResponse(201, { id: 'expense-1' }))

    const result = await apiFetch<{ id: string }>('/invoices/expense', { json: {} })

    expect(result).toEqual({ id: 'expense-1' })
    expect(tokenOf(fetchSpy.mock.calls[2] ?? [])).toBe('Bearer access-v2')
    expect(getTokens()?.refreshToken).toBe('refresh-v2')
  })

  it('no reintenta en bucle si el refresh falla', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Unauthorized' }))
      .mockResolvedValueOnce(
        jsonResponse(200, { errors: [{ message: 'Refresh token inválido' }] }),
      )

    await expect(apiFetch('/invoices/expense', { json: {} })).rejects.toMatchObject({
      status: 401,
    })
    // Original + refresh, sin tercer intento.
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(getTokens()).toBeNull()
  })

  it('muestra el mensaje del backend en un 400', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(400, { statusCode: 400, message: 'Falta el campo image' }),
    )

    await expect(
      apiFetch('/invoices/analyze-image', { form: new FormData() }),
    ).rejects.toThrow('Falta el campo image')
  })

  it('traduce el 502 de la lectura: el texto de OpenAI no le sirve al usuario', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(502, { statusCode: 502, message: 'model returned invalid JSON' }),
    )

    const error = await apiFetch('/invoices/analyze-image', {
      form: new FormData(),
    }).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).message).toContain('No pudimos leer la factura')
    // El texto crudo se conserva para depurar, pero no se muestra.
    expect((error as ApiError).rawMessage).toBe('model returned invalid JSON')
  })

  it('avisa de la configuración cuando el servidor no tiene la clave (503)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse(503, { statusCode: 503, message: 'OPENAI_API_KEY is not set' }),
    )

    await expect(
      apiFetch('/invoices/analyze-text', { json: { text: 'x' } }),
    ).rejects.toThrow(/no tiene configurada la lectura de facturas/)
  })

  it('no pone Content-Type en multipart: el boundary lo añade el navegador', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse(201, {}))

    await apiFetch('/invoices/analyze-image', { form: new FormData() })

    const init = (fetchSpy.mock.calls[0] ?? [])[1] as RequestInit
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined()
  })
})
