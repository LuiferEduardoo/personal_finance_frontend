import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { AccountsQuery } from '@/features/accounts/accounts.queries'
import { CategoriesQuery } from '@/features/categories/categories.queries'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { MailBackfillStatus, MailMessageStatus } from '@/graphql/generated/graphql'
import {
  BackfillMailSenderMutation,
  CreateMailSenderMutation,
  DeleteMailSenderMutation,
  DisconnectMailConnectionMutation,
  GmailAuthUrlQuery,
  MailConnectionsQuery,
  MailMessagesQuery,
  MailSendersQuery,
  RetryMailMessageMutation,
  SyncMailConnectionMutation,
  UpdateMailSenderMutation,
} from './mail.queries'

const MESSAGE_LABELS: Record<MailMessageStatus, string> = {
  PROCESSING: 'Procesando',
  REGISTERED: 'Registrada',
  DUPLICATE: 'Duplicada',
  NO_INVOICE: 'Sin factura',
  FAILED: 'Fallida',
}

const BACKFILL_LABELS: Record<MailBackfillStatus, string> = {
  IDLE: 'Sin ejecutar',
  RUNNING: 'Leyendo correos',
  DONE: 'Completada',
  FAILED: 'Falló',
}

export function MailSettingsPage() {
  const { confirm, dialog } = useConfirm()
  const [params] = useSearchParams()
  const callbackStatus = params.get('status')
  const callbackDetail = params.get('detail')
  const [notice, setNotice] = useState<string | null>(null)
  const connections = useQuery(MailConnectionsQuery)
  const senders = useQuery(MailSendersQuery)
  const messages = useQuery(MailMessagesQuery, { variables: { filter: { limit: 50 } } })
  const accounts = useQuery(AccountsQuery, { variables: { includeInactive: false } })
  const categories = useQuery(CategoriesQuery, {
    variables: { kind: 'EXPENSE' },
  })
  const [getAuthUrl, authUrlState] = useLazyQuery(GmailAuthUrlQuery, {
    fetchPolicy: 'network-only',
  })
  const [createSender, creating] = useMutation(CreateMailSenderMutation)
  const [updateSender] = useMutation(UpdateMailSenderMutation)
  const [deleteSender] = useMutation(DeleteMailSenderMutation)
  const [backfillSender] = useMutation(BackfillMailSenderMutation)
  const [disconnect] = useMutation(DisconnectMailConnectionMutation)
  const [syncConnection] = useMutation(SyncMailConnectionMutation)
  const [retryMessage] = useMutation(RetryMailMessageMutation)

  const refreshMail = async () => {
    await Promise.all([connections.refetch(), senders.refetch(), messages.refetch()])
  }

  const run = async (action: () => Promise<unknown>, success: string) => {
    try {
      await action()
      setNotice(success)
      return true
    } catch (error) {
      setNotice(getFirstErrorMessage(error))
      return false
    }
  }

  const activeConnections = connections.data?.mailConnections ?? []
  const senderRows = senders.data?.mailSenders ?? []
  const messageRows = messages.data?.mailMessages ?? []
  const isInitialLoading = connections.loading && !connections.data

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/ajustes" className="text-ink-secondary text-sm hover:underline">
            ← Perfil y ajustes
          </Link>
          <h1 className="text-ink mt-2 text-2xl font-semibold">Facturas por correo</h1>
          <p className="text-ink-secondary mt-1 max-w-2xl text-sm">
            Conecta Gmail y registra automáticamente las facturas electrónicas de los
            remitentes que autorices. El acceso al correo es de solo lectura.
          </p>
        </div>
        <Button
          isLoading={authUrlState.loading}
          onClick={() =>
            void run(async () => {
              const result = await getAuthUrl()
              const url = result.data?.gmailAuthUrl
              if (!url) throw new Error('No se pudo iniciar la conexión con Google.')
              window.location.assign(url)
            }, 'Redirigiendo a Google…')
          }
        >
          Conectar Gmail
        </Button>
      </div>

      {callbackStatus && (
        <p
          role="status"
          className={`mt-5 rounded-lg border p-3 text-sm ${
            callbackStatus === 'connected'
              ? 'border-income/30 bg-income/10 text-ink'
              : 'border-expense/30 bg-expense/10 text-ink'
          }`}
        >
          {callbackStatus === 'connected'
            ? `Gmail conectado${callbackDetail ? `: ${callbackDetail}` : ''}.`
            : `No fue posible conectar Gmail${callbackDetail ? `: ${callbackDetail}` : '.'}`}
        </p>
      )}
      {notice && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {notice}
        </p>
      )}

      <section className="mt-8" aria-labelledby="mailboxes-title">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 id="mailboxes-title" className="text-ink font-semibold">
              Buzones conectados
            </h2>
            <p className="text-ink-secondary mt-1 text-sm">
              Puedes sincronizar manualmente si no quieres esperar al proceso
              automático.
            </p>
          </div>
        </div>
        {isInitialLoading ? (
          <LoadingRows />
        ) : activeConnections.length === 0 ? (
          <EmptyState text="Aún no has conectado un buzón." />
        ) : (
          <div className="mt-4 grid gap-3">
            {activeConnections.map((connection) => (
              <article
                key={connection.id}
                className="border-border bg-surface-raised rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-ink truncate font-medium">
                        {connection.emailAddress}
                      </h3>
                      <StatusPill status={connection.status} />
                    </div>
                    <p className="text-ink-muted mt-1 text-xs">
                      {connection.lastSyncedAt
                        ? `Última sincronización: ${formatDateTime(connection.lastSyncedAt)}`
                        : 'Todavía no se ha sincronizado.'}
                    </p>
                    {connection.lastError && (
                      <p className="text-expense mt-2 text-sm">
                        {connection.lastError}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        void run(async () => {
                          await syncConnection({ variables: { id: connection.id } })
                          await refreshMail()
                        }, 'Sincronización completada.')
                      }
                    >
                      Sincronizar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        void (async () => {
                          if (
                            !(await confirm({
                              title: '¿Desconectar este buzón?',
                              message:
                                'Se borrarán sus remitentes y la bitácora. Los gastos registrados se conservarán.',
                              confirmLabel: 'Desconectar',
                            }))
                          )
                            return
                          await run(async () => {
                            await disconnect({ variables: { id: connection.id } })
                            await refreshMail()
                          }, 'Buzón desconectado.')
                        })()
                      }
                    >
                      Desconectar
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeConnections.length > 0 && (
        <SenderForm
          connections={activeConnections}
          accounts={accounts.data?.accounts ?? []}
          categories={(categories.data?.categories ?? []).filter(
            (item) => item.isActive,
          )}
          loading={creating.loading}
          onSubmit={(input) =>
            run(
              async () => {
                await createSender({ variables: { input } })
                await refreshMail()
              },
              input.backfillFrom
                ? 'Remitente creado; iniciamos la lectura histórica.'
                : 'Remitente creado.',
            )
          }
        />
      )}

      <section className="mt-8" aria-labelledby="senders-title">
        <h2 id="senders-title" className="text-ink font-semibold">
          Remitentes autorizados
        </h2>
        {senderRows.length === 0 ? (
          <EmptyState text="Agrega la dirección desde la que cada comercio envía sus facturas." />
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {senderRows.map((sender) => (
              <article
                key={sender.id}
                className="border-border bg-surface-raised rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-ink truncate font-medium">
                      {sender.merchantName}
                    </h3>
                    <p className="text-ink-secondary truncate text-sm">
                      {sender.emailAddress}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${sender.active ? 'bg-income/10 text-income' : 'bg-surface-sunken text-ink-muted'}`}
                  >
                    {sender.active ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                <p className="text-ink-muted mt-3 text-xs">
                  Histórico: {BACKFILL_LABELS[sender.backfillStatus]}
                  {sender.backfillFrom ? ` desde ${sender.backfillFrom}` : ''}
                </p>
                {sender.backfillError && (
                  <p className="text-expense mt-1 text-xs">{sender.backfillError}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      void run(
                        async () => {
                          await updateSender({
                            variables: {
                              input: { id: sender.id, active: !sender.active },
                            },
                          })
                          await senders.refetch()
                        },
                        sender.active ? 'Remitente pausado.' : 'Remitente activado.',
                      )
                    }
                  >
                    {sender.active ? 'Pausar' : 'Activar'}
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={sender.backfillStatus === 'RUNNING'}
                    onClick={() =>
                      void run(async () => {
                        await backfillSender({ variables: { id: sender.id } })
                        await senders.refetch()
                      }, 'La lectura histórica se ejecuta en segundo plano.')
                    }
                  >
                    Leer históricos
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      void (async () => {
                        if (
                          !(await confirm({
                            title: `¿Eliminar ${sender.merchantName}?`,
                            message: `Se dejarán de leer las facturas enviadas desde ${sender.emailAddress}.`,
                          }))
                        )
                          return
                        await run(async () => {
                          await deleteSender({ variables: { id: sender.id } })
                          await refreshMail()
                        }, 'Remitente eliminado.')
                      })()
                    }
                  >
                    Eliminar
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8" aria-labelledby="messages-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="messages-title" className="text-ink font-semibold">
              Actividad reciente
            </h2>
            <p className="text-ink-secondary mt-1 text-sm">
              Últimos 50 correos procesados.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => void messages.refetch()}
            isLoading={messages.loading}
          >
            Actualizar
          </Button>
        </div>
        {messageRows.length === 0 ? (
          <EmptyState text="La actividad aparecerá cuando llegue o sincronices un correo." />
        ) : (
          <div className="border-border bg-surface-raised mt-4 overflow-hidden rounded-lg border">
            <ul className="divide-border divide-y">
              {messageRows.map((message) => (
                <li
                  key={message.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-ink truncate text-sm font-medium">
                      {message.subject || 'Sin asunto'}
                    </p>
                    <p className="text-ink-muted mt-1 text-xs">
                      {formatDateTime(message.receivedAt ?? message.createdAt)} ·{' '}
                      {MESSAGE_LABELS[message.status]}
                    </p>
                    {message.error && (
                      <p className="text-expense mt-1 text-xs">{message.error}</p>
                    )}
                  </div>
                  {message.status === 'FAILED' && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        void run(async () => {
                          await retryMessage({ variables: { id: message.id } })
                          await messages.refetch()
                        }, 'Correo reprocesado.')
                      }
                    >
                      Reintentar
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {dialog}
    </main>
  )
}

type SenderInput = {
  connectionId: string
  emailAddress: string
  merchantName: string
  defaultAccountId?: string
  defaultCategoryId?: string
  backfillFrom?: string
}

function SenderForm({
  connections,
  accounts,
  categories,
  loading,
  onSubmit,
}: {
  connections: ReadonlyArray<{ id: string; emailAddress: string }>
  accounts: ReadonlyArray<{ id: string; name: string; isActive: boolean }>
  categories: ReadonlyArray<{ id: string; name: string }>
  loading: boolean
  onSubmit: (input: SenderInput) => Promise<boolean>
}) {
  const [emailAddress, setEmailAddress] = useState('')
  const [merchantName, setMerchantName] = useState('')
  const [connectionId, setConnectionId] = useState(connections[0]?.id ?? '')
  const [defaultAccountId, setDefaultAccountId] = useState('')
  const [defaultCategoryId, setDefaultCategoryId] = useState('')
  const [backfillFrom, setBackfillFrom] = useState('')
  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.isActive),
    [accounts],
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const saved = await onSubmit({
      connectionId,
      emailAddress,
      merchantName,
      ...(defaultAccountId ? { defaultAccountId } : {}),
      ...(defaultCategoryId ? { defaultCategoryId } : {}),
      ...(backfillFrom ? { backfillFrom } : {}),
    })
    if (!saved) return
    setEmailAddress('')
    setMerchantName('')
    setBackfillFrom('')
  }

  return (
    <section
      className="border-border bg-surface-raised mt-8 rounded-lg border p-4"
      aria-labelledby="new-sender-title"
    >
      <h2 id="new-sender-title" className="text-ink font-semibold">
        Agregar remitente
      </h2>
      <p className="text-ink-secondary mt-1 text-sm">
        Solo se descargan mensajes enviados desde direcciones configuradas aquí.
      </p>
      <form
        className="mt-4 grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => void submit(event)}
      >
        <Select
          label="Buzón"
          value={connectionId}
          onChange={(event) => setConnectionId(event.target.value)}
          required
        >
          {connections.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.emailAddress}
            </option>
          ))}
        </Select>
        <Field
          label="Correo del remitente"
          type="email"
          value={emailAddress}
          onChange={(event) => setEmailAddress(event.target.value)}
          placeholder="facturas@comercio.com"
          required
        />
        <Field
          label="Nombre del comercio"
          value={merchantName}
          onChange={(event) => setMerchantName(event.target.value)}
          required
        />
        <Select
          label="Cuenta predeterminada (opcional)"
          value={defaultAccountId}
          onChange={(event) => setDefaultAccountId(event.target.value)}
        >
          <option value="">Sin cuenta</option>
          {activeAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
        <Select
          label="Categoría predeterminada (opcional)"
          value={defaultCategoryId}
          onChange={(event) => setDefaultCategoryId(event.target.value)}
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Field
          label="Leer correos desde (opcional)"
          type="date"
          value={backfillFrom}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setBackfillFrom(event.target.value)}
        />
        <div className="sm:col-span-2">
          <Button type="submit" isLoading={loading}>
            Guardar remitente
          </Button>
        </div>
      </form>
    </section>
  )
}

function StatusPill({ status }: { status: string }) {
  const label =
    status === 'ACTIVE'
      ? 'Activa'
      : status === 'NEEDS_REAUTH'
        ? 'Requiere autorización'
        : status === 'ERROR'
          ? 'Con error'
          : 'Desactivada'
  return (
    <span className="bg-surface-sunken text-ink-secondary rounded-full px-2.5 py-1 text-xs">
      {label}
    </span>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="border-border text-ink-muted mt-4 rounded-lg border border-dashed p-6 text-center text-sm">
      {text}
    </p>
  )
}

function LoadingRows() {
  return (
    <div className="mt-4 grid gap-3" aria-label="Cargando buzones">
      <div className="bg-surface-sunken h-24 animate-pulse rounded-lg" />
    </div>
  )
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
