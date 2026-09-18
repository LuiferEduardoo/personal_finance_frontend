import { useState, type FormEvent } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import type { ApiScope } from '@/graphql/generated/graphql'
import { todayIso } from '@/lib/dates'
import {
  expirationInputValue,
  expirationPayload,
  SCOPE_GROUPS,
  toggleScope,
  type ManagedApiKey,
} from './api-key'

export type ApiKeyFormValue = {
  name: string
  scopes: ApiScope[]
  expiresAt: string | null
}

export function ApiKeyForm({
  apiKey,
  isSaving,
  serverError,
  onSubmit,
}: {
  apiKey?: ManagedApiKey
  isSaving: boolean
  serverError?: string | null
  onSubmit: (value: ApiKeyFormValue) => Promise<void>
}) {
  const [name, setName] = useState(apiKey?.name ?? '')
  const [scopes, setScopes] = useState<ApiScope[]>(apiKey?.scopes ?? [])
  const [expiresAt, setExpiresAt] = useState(expirationInputValue(apiKey?.expiresAt))
  const [formError, setFormError] = useState<string | null>(null)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setFormError('Escribe un nombre para reconocer esta clave.')
      return
    }
    if (scopes.length === 0) {
      setFormError('Selecciona al menos un permiso.')
      return
    }
    setFormError(null)
    await onSubmit({
      name: trimmedName,
      scopes,
      expiresAt: expirationPayload(expiresAt),
    })
  }

  return (
    <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-5">
      <Field
        label="Nombre"
        placeholder="Automatización de Notion"
        maxLength={100}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <Field
        label="Fecha de expiración (opcional)"
        type="date"
        min={todayIso()}
        value={expiresAt}
        onChange={(event) => setExpiresAt(event.target.value)}
      />

      <fieldset>
        <legend className="text-ink text-sm font-medium">Permisos</legend>
        <p className="text-ink-muted mt-1 text-xs">
          Concede únicamente lo que necesite la integración.
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {SCOPE_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-ink-secondary text-xs font-medium tracking-wide uppercase">
                {group.label}
              </p>
              <div className="mt-1 grid gap-1 sm:grid-cols-2">
                {group.options.map((option) => (
                  <label
                    key={option.value}
                    className="hover:bg-surface-sunken flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={scopes.includes(option.value)}
                      onChange={() =>
                        setScopes((current) => toggleScope(current, option.value))
                      }
                      className="size-4"
                    />
                    <span className="text-ink">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {(formError || serverError) && (
        <p role="alert" className="text-expense text-sm">
          {formError ?? serverError}
        </p>
      )}

      <Button type="submit" isLoading={isSaving}>
        {apiKey ? 'Guardar cambios' : 'Crear clave'}
      </Button>
    </form>
  )
}
