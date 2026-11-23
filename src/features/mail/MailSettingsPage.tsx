import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { AccountsQuery } from '@/features/accounts/accounts.queries'
import { CategoriesQuery } from '@/features/categories/categories.queries'
import { evictMovements } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  MailBackfillStatus,
  MailMessageStatus,
  MailSenderKind,
} from '@/graphql/generated/graphql'
import { formatOperations, SENDER_KIND_SHORT } from './mail-sender'
import { MailSenderForm, type MailSender } from './MailSenderForm'
import {
  BackfillMailSenderMutation,
  DeleteMailSenderMutation,
  DisconnectMailConnectionMutation,
  GmailAuthUrlQuery,
  MailConnectionsQuery,
  MailInvestmentAccountsQuery,
  MailMessagesQuery,
  MailSendersQuery,
  RetryMailMessageMutation,
  SyncMailConnectionMutation,
  UpdateMailSenderMutation,
} from './mail.queries'
import { PasswordBadge } from './PasswordBadge'

const MESSAGE_LABELS: Record<MailMessageStatus, string> = {
  PROCESSING: 'Procesando',
  REGISTERED: 'Registrada',
  DUPLICATE: 'Duplicada',
  NO_INVOICE: 'Sin factura',
  FAILED: 'Fallida',
}

/** Un correo de XTB trae órdenes, no una factura: mismos estados, otras palabras. */
const XTB_MESSAGE_LABELS: Record<MailMessageStatus, string> = {
  PROCESSING: 'Procesando',
  REGISTERED: 'Registrado',
  DUPLICATE: 'Ya registrado',
  NO_INVOICE: 'Sin confirmación',
  FAILED: 'Fallido',
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
  const investmentAccounts = useQuery(MailInvestmentAccountsQuery)
  const [editingSender, setEditingSender] = useState<MailSender | null>(null)
  const [getAuthUrl, authUrlState] = useLazyQuery(GmailAuthUrlQuery, {
    fetchPolicy: 'network-only',
  })
  const [updateSender] = useMutation(UpdateMailSenderMutation)
  const [deleteSender] = useMutation(DeleteMailSenderMutation)
  const [backfillSender] = useMutation(BackfillMailSenderMutation)
  const [disconnect] = useMutation(DisconnectMailConnectionMutation)
  const [syncConnection] = useMutation(SyncMailConnectionMutation)
  // Reprocesar puede registrar un gasto (factura): saldos, listas y presupuestos.
  const [retryMessage] = useMutation(RetryMailMessageMutation, {
    update: evictMovements,
  })

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
  const senderKinds = useMemo(
    () =>
      new Map<string, MailSenderKind>(
        (senders.data?.mailSenders ?? []).map((row) => [row.id, row.kind]),
      ),
    [senders.data?.mailSenders],
  )
  const formAccounts = useMemo(
    () => (accounts.data?.accounts ?? []).filter((account) => account.isActive),
    [accounts.data?.accounts],
  )
  const formCategories = useMemo(
    () => (categories.data?.categories ?? []).filter((item) => item.isActive),
    [categories.data?.categories],
  )
  const formInvestmentAccounts = investmentAccounts.data?.investmentAccounts ?? []
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
        <section
          className="border-border bg-surface-raised mt-8 rounded-lg border p-4"
          aria-labelledby="new-sender-title"
        >
          <h2 id="new-sender-title" className="text-ink font-semibold">
            Agregar remitente
          </h2>
          <p className="text-ink-secondary mt-1 text-sm">
            Solo se descargan mensajes enviados desde direcciones configuradas aquí. Las
            facturas se registran como gasto; las confirmaciones de XTB, como
            operaciones en tu cuenta de inversión.
          </p>
          <div className="mt-4">
            <MailSenderForm
              connections={activeConnections}
              accounts={formAccounts}
              categories={formCategories}
              investmentAccounts={formInvestmentAccounts}
              onSaved={async (message) => {
                setNotice(message)
                await refreshMail()
              }}
            />
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="senders-title">
        <h2 id="senders-title" className="text-ink font-semibold">
          Remitentes autorizados
        </h2>
        {senderRows.length === 0 ? (
          <EmptyState text="Agrega la dirección desde la que cada comercio envía sus facturas o XTB sus confirmaciones." />
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
                    <p className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="bg-surface-sunken text-ink-secondary rounded-full px-2.5 py-1 text-xs">
                        {SENDER_KIND_SHORT[sender.kind]}
                      </span>
                      {sender.kind === 'XTB_ORDER_CONFIRMATION' &&
                        (sender.hasAttachmentPassword ? (
                          <PasswordBadge />
                        ) : (
                          <span className="border-warning/40 text-ink rounded-full border px-2.5 py-1 text-xs">
                            Falta la contraseña del PDF
                          </span>
                        ))}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${sender.active ? 'bg-income/10 text-income' : 'bg-surface-sunken text-ink-muted'}`}
                  >
                    {sender.active ? 'Activo' : 'Pausado'}
                  </span>
                </div>
                {sender.kind === 'XTB_ORDER_CONFIRMATION' && (
                  <p className="text-ink-secondary mt-3 text-sm">
                    {sender.investmentAccount
                      ? `Cuenta de inversión: ${sender.investmentAccount.name}`
                      : 'Sin cuenta de inversión: sus correos fallarán hasta asignarla.'}
                  </p>
                )}
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
                  <Button variant="secondary" onClick={() => setEditingSender(sender)}>
                    Editar
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
                            message: `Se dejarán de leer los correos enviados desde ${sender.emailAddress}.`,
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
              {messageRows.map((message) => {
                const isXtb =
                  (message.senderId && senderKinds.get(message.senderId)) ===
                    'XTB_ORDER_CONFIRMATION' || message.operationsRecorded != null
                return (
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
                        {(isXtb ? XTB_MESSAGE_LABELS : MESSAGE_LABELS)[message.status]}
                        {isXtb && ' · Órdenes XTB'}
                        {message.operationsRecorded != null &&
                          ` · ${formatOperations(message.operationsRecorded)}`}
                      </p>
                      {message.error && (
                        <p className="text-expense mt-1 text-xs">{message.error}</p>
                      )}
                    </div>
                    {message.status === 'FAILED' && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          void (async () => {
                            try {
                              const { data } = await retryMessage({
                                variables: { id: message.id },
                              })
                              await messages.refetch()
                              const result = data?.retryMailMessage
                              // Reintentar no garantiza éxito: si vuelve a fallar
                              // (p. ej. contraseña aún incorrecta) se dice así.
                              setNotice(
                                result?.status === 'FAILED'
                                  ? `Volvió a fallar: ${result.error ?? 'error desconocido'}`
                                  : result?.operationsRecorded != null
                                    ? `Correo reprocesado: ${formatOperations(result.operationsRecorded)}.`
                                    : 'Correo reprocesado.',
                              )
                            } catch (error) {
                              setNotice(getFirstErrorMessage(error))
                            }
                          })()
                        }
                      >
                        Reintentar
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
      <Sheet
        isOpen={editingSender !== null}
        onClose={() => setEditingSender(null)}
        title="Editar remitente"
      >
        {editingSender && (
          <MailSenderForm
            key={editingSender.id}
            sender={editingSender}
            connections={activeConnections}
            accounts={formAccounts}
            categories={formCategories}
            investmentAccounts={formInvestmentAccounts}
            onCancel={() => setEditingSender(null)}
            onSaved={async (message) => {
              setEditingSender(null)
              setNotice(message)
              await senders.refetch()
            }}
          />
        )}
      </Sheet>
      {dialog}
    </main>
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
