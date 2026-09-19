import { useMutation } from '@apollo/client'
import QRCode from 'qrcode'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { useSession } from '@/features/auth/SessionContext'
import {
  BeginTwoFactorMutation,
  ChangePasswordMutation,
  ConfirmTwoFactorMutation,
  DisableTwoFactorMutation,
  MeQuery,
} from '@/features/auth/auth.queries'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { TwoFactorMethod } from '@/graphql/generated/graphql'

export function SettingsPage() {
  const { user } = useSession()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [method, setMethod] = useState<TwoFactorMethod>('TOTP')
  const [code, setCode] = useState('')
  const [secret, setSecret] = useState<string | null>(null)
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [showDisableForm, setShowDisableForm] = useState(false)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [setupStarted, setSetupStarted] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [changePassword, changing] = useMutation(ChangePasswordMutation)
  const [begin, beginning] = useMutation(BeginTwoFactorMutation)
  const [confirm, confirming] = useMutation(ConfirmTwoFactorMutation)
  const [disable, disabling] = useMutation(DisableTwoFactorMutation)
  const activeMethod = user?.authentication?.twoFactorMethod

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action()
      setMessage(success)
    } catch (error) {
      setMessage(getFirstErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-ink text-2xl font-semibold">Perfil y ajustes</h1>

      {user && (
        <dl className="border-border bg-surface-raised divide-border mt-6 divide-y rounded-lg border">
          <Row
            label="Nombre"
            value={[user.firstName, user.lastName].filter(Boolean).join(' ')}
          />
          <Row label="Correo" value={user.email} />
          <Row label="Moneda base" value={user.baseCurrency} />
          <Row label="Zona horaria" value={user.timezone} />
        </dl>
      )}

      <section className="border-border bg-surface-raised mt-6 rounded-lg border p-4">
        <h2 className="text-ink font-semibold">Contraseña</h2>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            void run(
              () =>
                changePassword({
                  variables: { input: { currentPassword, newPassword } },
                }),
              'Contraseña actualizada; las demás sesiones fueron cerradas.',
            )
          }}
        >
          <Field
            label="Contraseña actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Field
            label="Nueva contraseña"
            type="password"
            minLength={10}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div>
            <Button type="submit" isLoading={changing.loading}>
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </section>

      <section className="border-border bg-surface-raised mt-6 rounded-lg border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-ink font-semibold">Autenticación en dos pasos</h2>
            <p className="text-ink-secondary mt-1 text-sm">
              {activeMethod
                ? 'Tu cuenta solicita un código adicional al iniciar sesión.'
                : 'Añade una segunda comprobación al iniciar sesión.'}
            </p>
          </div>
          {activeMethod && (
            <span className="bg-income/10 text-income inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium">
              Activada
            </span>
          )}
        </div>
        {activeMethod && (
          <div className="border-border bg-surface-sunken mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-ink text-sm font-medium">
                {activeMethod === 'TOTP'
                  ? 'Aplicación autenticadora'
                  : 'Código por correo'}
              </p>
              <p className="text-ink-secondary mt-1 text-xs">
                {activeMethod === 'TOTP'
                  ? 'Usa el código temporal generado por tu aplicación.'
                  : `Los códigos se envían a ${user?.email ?? 'tu correo'}.`}
              </p>
            </div>
            {!showDisableForm && !showChangeForm && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMethod(activeMethod === 'TOTP' ? 'EMAIL' : 'TOTP')
                    setCode('')
                    setSecret(null)
                    setOtpauthUri(null)
                    setQrCodeUrl(null)
                    setSetupStarted(false)
                    setShowChangeForm(true)
                  }}
                >
                  Cambiar método
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCode('')
                    setShowDisableForm(true)
                    if (activeMethod === 'EMAIL') {
                      void run(
                        () => begin({ variables: { method: 'EMAIL' } }),
                        'Enviamos un código a tu correo para confirmar.',
                      )
                    }
                  }}
                >
                  Desactivar 2FA
                </Button>
              </div>
            )}
          </div>
        )}
        {(!activeMethod || showChangeForm) && (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="text-ink-secondary mb-1 block">
                {activeMethod ? 'Nuevo método' : 'Método'}
              </span>
              <select
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value as TwoFactorMethod)
                  setSecret(null)
                  setOtpauthUri(null)
                  setQrCodeUrl(null)
                  setCode('')
                  setSetupStarted(false)
                }}
                className="border-border bg-surface min-h-11 rounded-lg border px-3"
              >
                <option value="TOTP" disabled={activeMethod === 'TOTP'}>
                  Aplicación autenticadora
                </option>
                <option value="EMAIL" disabled={activeMethod === 'EMAIL'}>
                  Código por correo
                </option>
              </select>
            </label>
            <Button
              isLoading={beginning.loading}
              onClick={() =>
                void run(
                  async () => {
                    const result = await begin({ variables: { method } })
                    const setup = result.data?.beginTwoFactorSetup
                    const uri = setup?.otpauthUri ?? null
                    setSecret(setup?.secret ?? null)
                    setOtpauthUri(uri)
                    setQrCodeUrl(
                      uri
                        ? await QRCode.toDataURL(uri, {
                            width: 224,
                            margin: 2,
                            errorCorrectionLevel: 'M',
                          })
                        : null,
                    )
                    setSetupStarted(true)
                  },
                  method === 'EMAIL'
                    ? 'Enviamos un código a tu correo.'
                    : 'Escanea o copia el secreto en tu aplicación.',
                )
              }
            >
              {activeMethod ? 'Configurar nuevo método' : 'Configurar'}
            </Button>
            {showChangeForm && (
              <Button
                variant="ghost"
                onClick={() => {
                  setShowChangeForm(false)
                  setSecret(null)
                  setOtpauthUri(null)
                  setQrCodeUrl(null)
                  setCode('')
                  setSetupStarted(false)
                }}
              >
                Cancelar cambio
              </Button>
            )}
          </div>
        )}
        {secret && (
          <div className="border-border bg-surface-sunken mt-4 grid gap-4 rounded-lg border p-4 sm:grid-cols-[auto_1fr] sm:items-center">
            {qrCodeUrl && (
              <div className="border-border w-fit rounded-lg border bg-white p-2">
                <img
                  src={qrCodeUrl}
                  alt="Código QR para configurar Kairos en una aplicación autenticadora"
                  className="size-52"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-ink text-sm font-medium">Escanea el código QR</h3>
              <p className="text-ink-secondary mt-1 text-xs">
                Usa Google Authenticator, Microsoft Authenticator, 1Password u otra
                aplicación compatible con TOTP.
              </p>
              {otpauthUri && (
                <a
                  href={otpauthUri}
                  className="text-ink mt-3 inline-block text-sm font-medium underline"
                >
                  Abrir aplicación autenticadora
                </a>
              )}
              <p className="text-ink-muted mt-4 text-xs">
                Si no puedes escanearlo, introduce este secreto manualmente:
              </p>
              <code className="text-ink mt-1 block text-sm break-all">{secret}</code>
            </div>
          </div>
        )}
        {((!activeMethod || showChangeForm) && setupStarted) ||
        (activeMethod && showDisableForm) ? (
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Field
              label="Código de 6 dígitos"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {activeMethod ? (
              <>
                <Button
                  isLoading={disabling.loading}
                  onClick={() =>
                    void run(async () => {
                      await disable({
                        variables: { code },
                        refetchQueries: [{ query: MeQuery }],
                        awaitRefetchQueries: true,
                      })
                      setShowDisableForm(false)
                      setCode('')
                    }, 'Autenticación en dos pasos desactivada.')
                  }
                >
                  Confirmar desactivación
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowDisableForm(false)
                    setCode('')
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                isLoading={confirming.loading}
                onClick={() =>
                  void run(
                    async () => {
                      await confirm({
                        variables: { method, code },
                        refetchQueries: [{ query: MeQuery }],
                        awaitRefetchQueries: true,
                      })
                      setShowChangeForm(false)
                      setSecret(null)
                      setOtpauthUri(null)
                      setQrCodeUrl(null)
                      setCode('')
                      setSetupStarted(false)
                    },
                    activeMethod
                      ? 'Método de autenticación actualizado.'
                      : 'Autenticación en dos pasos activada.',
                  )
                }
              >
                {activeMethod ? 'Confirmar cambio' : 'Confirmar'}
              </Button>
            )}
          </div>
        ) : null}
      </section>
      {message && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-ink-secondary text-sm">{label}</dt>
      <dd className="text-ink text-sm font-medium">{value}</dd>
    </div>
  )
}
