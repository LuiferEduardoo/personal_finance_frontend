import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatDateTime, scopeLabel, type ManagedApiKey } from './api-key'
import { ApiKeyForm, type ApiKeyFormValue } from './ApiKeyForm'
import {
  ApiKeysQuery,
  CreateApiKeyMutation,
  RemoveApiKeyMutation,
  RevokeApiKeyMutation,
  UpdateApiKeyMutation,
} from './api-keys.queries'
import { ApiKeyTokenSheet } from './ApiKeyTokenSheet'

export function ApiKeysPage() {
  const { data, loading, error, refetch } = useQuery(ApiKeysQuery)
  const [isCreating, setIsCreating] = useState(false)
  const [editing, setEditing] = useState<ManagedApiKey | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const { confirm, dialog } = useConfirm()

  const [createApiKey, createState] = useMutation(CreateApiKeyMutation)
  const [updateApiKey, updateState] = useMutation(UpdateApiKeyMutation)
  const [revokeApiKey] = useMutation(RevokeApiKeyMutation)
  const [removeApiKey] = useMutation(RemoveApiKeyMutation)

  const closeForm = () => {
    setIsCreating(false)
    setEditing(null)
    setFormError(null)
  }

  const create = async (value: ApiKeyFormValue) => {
    setFormError(null)
    try {
      const result = await createApiKey({ variables: { input: value } })
      const token = result.data?.createApiKey.token
      if (!token) throw new Error('La API no devolvió el secreto de la clave')
      await refetch()
      closeForm()
      setCreatedToken(token)
    } catch (caught) {
      setFormError(getFirstErrorMessage(caught))
    }
  }

  const update = async (value: ApiKeyFormValue) => {
    if (!editing) return
    setFormError(null)
    try {
      await updateApiKey({ variables: { input: { id: editing.id, ...value } } })
      await refetch()
      closeForm()
    } catch (caught) {
      setFormError(getFirstErrorMessage(caught))
    }
  }

  const revoke = async (apiKey: ManagedApiKey) => {
    const accepted = await confirm({
      title: `¿Revocar "${apiKey.name}"?`,
      message:
        'La integración perderá el acceso de inmediato. Esta acción no se puede deshacer.',
      confirmLabel: 'Revocar',
    })
    if (!accepted) return
    setActionError(null)
    try {
      await revokeApiKey({ variables: { id: apiKey.id } })
      await refetch()
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const remove = async (apiKey: ManagedApiKey) => {
    const accepted = await confirm({
      title: `¿Eliminar "${apiKey.name}"?`,
      message: 'Se quitará de tu historial de claves.',
      confirmLabel: 'Eliminar',
    })
    if (!accepted) return
    setActionError(null)
    try {
      await removeApiKey({ variables: { id: apiKey.id } })
      await refetch()
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const keys = data?.apiKeys ?? []
  const isFormOpen = isCreating || editing !== null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-ink text-2xl font-semibold">API keys</h1>
          <p className="text-ink-secondary mt-1 max-w-xl text-sm">
            Da acceso limitado a automatizaciones y servicios externos sin compartir tu
            contraseña.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>Nueva clave</Button>
      </div>

      {actionError && (
        <div className="mt-5">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState
            message={getFirstErrorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : keys.length === 0 ? (
          <EmptyState
            title="Sin API keys"
            description="Crea una clave cuando quieras conectar Kuantico con otra aplicación."
            action={<Button onClick={() => setIsCreating(true)}>Crear API key</Button>}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {keys.map((apiKey) => (
              <ApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onEdit={() => setEditing(apiKey)}
                onRevoke={() => void revoke(apiKey)}
                onRemove={() => void remove(apiKey)}
              />
            ))}
          </ul>
        )}
      </div>

      <Sheet
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar API key' : 'Nueva API key'}
      >
        {isFormOpen && (
          <ApiKeyForm
            key={editing?.id ?? 'new'}
            apiKey={editing ?? undefined}
            isSaving={createState.loading || updateState.loading}
            serverError={formError}
            onSubmit={editing ? update : create}
          />
        )}
      </Sheet>

      <ApiKeyTokenSheet
        key={createdToken ?? 'closed'}
        token={createdToken}
        onClose={() => setCreatedToken(null)}
      />
      {dialog}
    </div>
  )
}

function ApiKeyCard({
  apiKey,
  onEdit,
  onRevoke,
  onRemove,
}: {
  apiKey: ManagedApiKey
  onEdit: () => void
  onRevoke: () => void
  onRemove: () => void
}) {
  const status = apiKey.revokedAt ? 'Revocada' : apiKey.isActive ? 'Activa' : 'Expirada'

  return (
    <li className="border-border bg-surface-raised rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-ink font-medium">{apiKey.name}</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                apiKey.isActive
                  ? 'bg-income/10 text-income'
                  : 'bg-surface-sunken text-ink-muted'
              }`}
            >
              {status}
            </span>
          </div>
          <code className="text-ink-secondary mt-1 block font-mono text-xs">
            {apiKey.prefix}…
          </code>
          <p className="text-ink-muted mt-2 text-xs">
            Creada {formatDateTime(apiKey.createdAt)} · Último uso{' '}
            {formatDateTime(apiKey.lastUsedAt)} · Expira{' '}
            {formatDateTime(apiKey.expiresAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-1">
          {!apiKey.revokedAt && (
            <Button variant="ghost" onClick={onEdit}>
              Editar
            </Button>
          )}
          {apiKey.isActive && (
            <Button variant="ghost" onClick={onRevoke}>
              Revocar
            </Button>
          )}
          <Button variant="ghost" onClick={onRemove}>
            Eliminar
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Permisos concedidos">
        {apiKey.scopes.map((scope) => (
          <span
            key={scope}
            className="border-border bg-surface-sunken text-ink-secondary rounded-md border px-2 py-1 text-xs"
          >
            {scopeLabel(scope)}
          </span>
        ))}
      </div>
    </li>
  )
}
