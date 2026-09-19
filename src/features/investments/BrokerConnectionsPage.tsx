import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useConfirm } from '@/components/ConfirmDialog'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  BrokerConnectionsQuery as ConnectionsData,
  BrokerKind,
} from '@/graphql/generated/graphql'
import { BROKER_LABELS } from './investment-ui'
import {
  BrokerConnectionsQuery,
  CreateBrokerConnectionMutation,
  DeleteBrokerConnectionMutation,
  SyncAllBrokerConnectionsMutation,
  SyncBrokerConnectionMutation,
  UpdateBrokerConnectionMutation,
  VerifyBrokerConnectionMutation,
} from './investments.queries'

type Connection = ConnectionsData['brokerConnections'][number]
const STATUS = {
  ACTIVE: 'Activa',
  DISABLED: 'Desactivada',
  ERROR: 'Con error',
  NEEDS_REAUTH: 'Requiere acceso',
} as const

export function BrokerConnectionsPage() {
  const { data, loading, error, refetch } = useQuery(BrokerConnectionsQuery)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Connection | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [remove] = useMutation(DeleteBrokerConnectionMutation)
  const [verify] = useMutation(VerifyBrokerConnectionMutation)
  const [sync] = useMutation(SyncBrokerConnectionMutation)
  const [syncAll, syncing] = useMutation(SyncAllBrokerConnectionsMutation)
  const { confirm, dialog } = useConfirm()
  const run = async (fn: () => Promise<unknown>, success: string) => {
    try {
      await fn()
      setNotice(success)
      await refetch()
    } catch (caught) {
      setNotice(getFirstErrorMessage(caught))
    }
  }
  const removeOne = async (item: Connection) => {
    if (await confirm({ title: `¿Eliminar la conexión “${item.label}”?` }))
      await run(() => remove({ variables: { id: item.id } }), 'Conexión eliminada.')
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-ink-muted text-sm">Sincronización segura</p>
          <h1 className="text-ink text-2xl font-semibold">Conexiones con brókers</h1>
        </div>
        <div className="flex gap-2">
          {!!data?.brokerConnections.length && (
            <Button
              variant="secondary"
              disabled={syncing.loading}
              onClick={() =>
                void run(() => syncAll(), 'Todas las conexiones fueron sincronizadas.')
              }
            >
              Sincronizar todas
            </Button>
          )}
          <Button onClick={() => setCreating(true)}>Nueva conexión</Button>
        </div>
      </div>
      <p className="text-ink-secondary mt-2 max-w-2xl text-sm">
        Las credenciales se cifran en el servidor y nunca vuelven a mostrarse.
      </p>
      {notice && (
        <p role="status" className="border-border mt-4 rounded-lg border p-3 text-sm">
          {notice}
        </p>
      )}
      <div className="mt-5">
        {loading ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : !data?.brokerConnections.length ? (
          <EmptyState
            title="Sin conexiones"
            description="Conecta Binance, eToro, Interactive Brokers o XTB para sincronizar operaciones."
            action={<Button onClick={() => setCreating(true)}>Conectar bróker</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {data.brokerConnections.map((item) => (
              <li
                key={item.id}
                className="border-border bg-surface-raised rounded-xl border p-4"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <p className="text-ink font-medium">{item.label}</p>
                    <p className="text-ink-muted text-xs">
                      {BROKER_LABELS[item.broker]}
                      {item.isDemo ? ' · Demo' : ''} · {STATUS[item.status]}
                    </p>
                    {item.lastSyncedAt && (
                      <p className="text-ink-muted mt-1 text-xs">
                        Última sincronización:{' '}
                        {new Date(item.lastSyncedAt).toLocaleString('es-CO')}
                      </p>
                    )}
                    {item.lastError && (
                      <p className="text-expense mt-1 text-xs">{item.lastError}</p>
                    )}
                  </div>
                  <span
                    className={`h-fit rounded-full px-2 py-1 text-xs ${item.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-800' : 'bg-surface-sunken text-ink-secondary'}`}
                  >
                    {item.autoSync ? 'Automática' : 'Manual'}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Action
                    onClick={() =>
                      void run(
                        () => sync({ variables: { id: item.id } }),
                        'Operaciones sincronizadas.',
                      )
                    }
                  >
                    Sincronizar
                  </Action>
                  <Action
                    onClick={() =>
                      void run(
                        () => verify({ variables: { id: item.id } }),
                        'Credenciales verificadas.',
                      )
                    }
                  >
                    Verificar
                  </Action>
                  <Action onClick={() => setEditing(item)}>Editar</Action>
                  <Action danger onClick={() => void removeOne(item)}>
                    Eliminar
                  </Action>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Sheet
        isOpen={creating || !!editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
        title={editing ? 'Editar conexión' : 'Conectar bróker'}
      >
        {(creating || editing) && (
          <ConnectionForm
            connection={editing ?? undefined}
            onDone={async () => {
              setCreating(false)
              setEditing(null)
              await refetch()
            }}
          />
        )}
      </Sheet>
      {dialog}
    </div>
  )
}
function ConnectionForm({
  connection,
  onDone,
}: {
  connection?: Connection
  onDone: () => Promise<void>
}) {
  const [broker, setBroker] = useState<BrokerKind>(connection?.broker ?? 'BINANCE')
  const [label, setLabel] = useState(connection?.label ?? '')
  const [demo, setDemo] = useState(connection?.isDemo ?? false)
  const [autoSync, setAutoSync] = useState(connection?.autoSync ?? true)
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [create, creating] = useMutation(CreateBrokerConnectionMutation)
  const [update, updating] = useMutation(UpdateBrokerConnectionMutation)
  const credentialNames: Record<BrokerKind, [string, string, string, string]> = {
    BINANCE: ['API key', 'API secret', 'apiKey', 'apiSecret'],
    ETORO: ['API key', 'User key', 'apiKey', 'userKey'],
    INTERACTIVE_BROKERS: ['Token', 'Query ID', 'token', 'queryId'],
    XTB: ['Usuario', 'Contraseña', 'userId', 'password'],
    MANUAL: ['Clave', 'Secreto', 'key', 'secret'],
  }
  const names = credentialNames[broker]
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const credentials =
        first || second ? { [names[2]]: first, [names[3]]: second } : undefined
      if (connection)
        await update({
          variables: {
            input: { id: connection.id, label, isDemo: demo, autoSync, credentials },
          },
        })
      else {
        if (!credentials) throw new Error('Ingresa las credenciales.')
        await create({
          variables: { input: { broker, label, isDemo: demo, autoSync, credentials } },
        })
      }
      await onDone()
    } catch (caught) {
      setMessage(getFirstErrorMessage(caught))
    }
  }
  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <label className="block text-sm">
        <span className="text-ink-secondary mb-1 block">Bróker</span>
        <select
          disabled={!!connection}
          value={broker}
          onChange={(e) => setBroker(e.target.value as BrokerKind)}
          className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
        >
          {(Object.entries(BROKER_LABELS) as [BrokerKind, string][])
            .filter(([v]) => v !== 'MANUAL')
            .map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
        </select>
      </label>
      <Field
        label="Nombre de la conexión"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
      <Field
        label={names[0]}
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        required={!connection}
        autoComplete="off"
      />
      <Field
        label={names[1]}
        type="password"
        value={second}
        onChange={(e) => setSecond(e.target.value)}
        required={!connection}
        autoComplete="new-password"
      />
      <p className="text-ink-muted text-xs">
        {connection
          ? 'Déjalas vacías para conservar las credenciales actuales.'
          : 'Se enviarán una sola vez al servidor.'}
      </p>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={demo}
            onChange={(e) => setDemo(e.target.checked)}
          />
          Cuenta demo
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
          />
          Sincronización automática
        </label>
      </div>
      {message && <ErrorState message={message} />}
      <Button type="submit" disabled={creating.loading || updating.loading}>
        {connection ? 'Guardar' : 'Conectar'}
      </Button>
    </form>
  )
}
function Action({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hover:bg-surface-sunken min-h-10 rounded-lg px-3 text-sm ${danger ? 'text-expense' : 'text-ink-secondary'}`}
    >
      {children}
    </button>
  )
}
