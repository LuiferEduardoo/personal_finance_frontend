import type { ApiScope, ApiKeysQuery } from '@/graphql/generated/graphql'

export type ManagedApiKey = ApiKeysQuery['apiKeys'][number]

export const SCOPE_GROUPS: ReadonlyArray<{
  label: string
  options: ReadonlyArray<{ value: ApiScope; label: string }>
}> = [
  {
    label: 'Gastos e Ingresos',
    options: [
      { value: 'EXPENSES_READ', label: 'Consultar gastos' },
      { value: 'EXPENSES_WRITE', label: 'Crear y modificar gastos' },
      { value: 'INCOMES_READ', label: 'Consultar ingresos' },
      { value: 'INCOMES_WRITE', label: 'Crear y modificar ingresos' },
      { value: 'ACCOUNTS_READ', label: 'Consultar cuentas' },
      { value: 'ACCOUNTS_WRITE', label: 'Gestionar cuentas' },
      { value: 'CATEGORIES_READ', label: 'Consultar categorías' },
      { value: 'CATEGORIES_WRITE', label: 'Gestionar categorías' },
      { value: 'RECURRING_READ', label: 'Consultar gastos recurrentes' },
      { value: 'RECURRING_WRITE', label: 'Gestionar gastos recurrentes' },
      { value: 'ARTICLES_READ', label: 'Consultar artículos' },
      { value: 'ARTICLES_WRITE', label: 'Gestionar artículos' },
      { value: 'PRODUCTS_READ', label: 'Consultar productos' },
      { value: 'PRODUCTS_WRITE', label: 'Gestionar productos' },
      { value: 'INVENTORY_READ', label: 'Consultar inventario' },
      { value: 'INVENTORY_WRITE', label: 'Gestionar inventario' },
      { value: 'INFLATION_READ', label: 'Consultar inflación' },
      { value: 'INVOICES_WRITE', label: 'Procesar facturas' },
    ],
  },
  {
    label: 'Inversiones',
    options: [
      { value: 'INVESTMENTS_READ', label: 'Consultar cartera y operaciones' },
      { value: 'INVESTMENTS_WRITE', label: 'Gestionar operaciones e importaciones' },
      { value: 'MARKET_DATA_READ', label: 'Consultar instrumentos y mercado' },
    ],
  },
]

export const ALLOWED_API_SCOPES = SCOPE_GROUPS.flatMap((group) =>
  group.options.map((option) => option.value),
)

const SCOPE_LABELS = new Map(
  SCOPE_GROUPS.flatMap((group) =>
    group.options.map((option) => [option.value, option.label]),
  ),
)

export function scopeLabel(scope: ApiScope): string {
  return SCOPE_LABELS.get(scope) ?? scope
}

export function toggleScope(scopes: ApiScope[], scope: ApiScope): ApiScope[] {
  return scopes.includes(scope)
    ? scopes.filter((value) => value !== scope)
    : [...scopes, scope]
}

export function allowedScopes(scopes: ApiScope[]): ApiScope[] {
  return scopes.filter((scope) => ALLOWED_API_SCOPES.includes(scope))
}

export function expirationInputValue(expiresAt: string | null | undefined): string {
  return expiresAt?.slice(0, 10) ?? ''
}

export function expirationPayload(value: string): string | null {
  return value ? `${value}T23:59:59.999Z` : null
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'Nunca'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
