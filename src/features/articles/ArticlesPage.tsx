import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { Button } from '@/components/Button'
import { useConfirm } from '@/components/ConfirmDialog'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  ArticleType,
  ArticlesQuery as ArticlesQueryType,
} from '@/graphql/generated/graphql'
import {
  MarkProductDepletedMutation,
  ProductPurchasesQuery,
  ProductStatsQuery,
} from '@/features/products/products.queries'
import { PurchaseForm } from '@/features/products/PurchaseForm'
import { formatPackage } from '@/features/products/units'
import { evictInventory } from '@/graphql/cache'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import { ArticleForm } from './ArticleForm'
import { ArticlesQuery, RemoveArticleMutation } from './articles.queries'

type Article = ArticlesQueryType['articles'][number]

const TYPE_TABS: { type: ArticleType; label: string }[] = [
  { type: 'PRODUCT', label: 'Productos' },
  { type: 'SERVICE', label: 'Servicios' },
  { type: 'OTHER', label: 'Otros' },
]

/**
 * Gestión del catálogo de artículos, con pestañas por tipo. Bajo "Productos" se
 * añade el inventario: estado de stock, "se acabó", registrar compra, la lista
 * de compras ("Por reponer") e historial. Los otros tipos son solo catálogo.
 */
export function ArticlesPage() {
  const { user } = useSession()
  const currency = user?.baseCurrency ?? 'COP'

  const [type, setType] = useState<ArticleType>('PRODUCT')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Article | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const { confirm, dialog } = useConfirm()

  const isProduct = type === 'PRODUCT'

  const { data, loading, error } = useQuery(ArticlesQuery, {
    variables: { type, search: search.trim() || undefined },
  })
  const articles = useMemo(() => data?.articles ?? [], [data?.articles])

  const [removeArticle] = useMutation(RemoveArticleMutation, {
    update: evictInventory,
  })

  const handleRemove = async (article: Article) => {
    if (!(await confirm({ title: `¿Eliminar "${article.name}"?` }))) return
    setActionError(null)
    try {
      await removeArticle({ variables: { id: article.id } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const isFormOpen = isCreating || editing !== null
  const closeForm = () => {
    setIsCreating(false)
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Artículos</h1>
        <Button onClick={() => setIsCreating(true)}>Nuevo</Button>
      </div>

      <div
        role="tablist"
        aria-label="Tipo de artículo"
        className="border-border bg-surface-sunken mt-4 flex gap-1 rounded-lg border p-1"
      >
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            role="tab"
            aria-selected={type === tab.type}
            onClick={() => setType(tab.type)}
            className={`min-h-10 flex-1 rounded-md text-sm font-medium ${
              type === tab.type
                ? 'bg-surface-raised text-ink shadow-sm'
                : 'text-ink-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Buscar</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar en el catálogo…"
          className="border-border bg-surface-raised text-ink placeholder:text-ink-muted focus:border-ink min-h-11 w-full rounded-lg border px-3 text-base outline-none"
        />
      </label>

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      {/* Lista de compras: solo aplica a productos consumibles sin stock. */}
      {isProduct && <RestockList articles={articles} />}

      <section className="mt-6">
        {loading ? (
          <LoadingRows rows={4} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : articles.length === 0 ? (
          <EmptyState
            title={search ? 'Sin resultados' : 'Sin artículos de este tipo'}
            description={search ? 'Prueba con otro término.' : 'Crea el primero.'}
            action={
              search ? undefined : (
                <Button onClick={() => setIsCreating(true)}>Nuevo</Button>
              )
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {articles.map((article) => (
              <ArticleRow
                key={article.id}
                article={article}
                currency={currency}
                onEdit={() => setEditing(article)}
                onRemove={() => void handleRemove(article)}
                onError={setActionError}
              />
            ))}
          </ul>
        )}
      </section>

      {isProduct && <PurchaseHistory currency={currency} />}

      <Sheet
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editing ? 'Editar artículo' : 'Nuevo artículo'}
      >
        {isFormOpen && (
          <ArticleForm
            key={editing?.id ?? 'nuevo'}
            article={editing ?? undefined}
            defaultType={type}
            onDone={closeForm}
          />
        )}
      </Sheet>

      {dialog}
    </div>
  )
}

function RestockList({ articles }: { articles: Article[] }) {
  const [isBuying, setIsBuying] = useState<string | null>(null)
  const toRestock = articles.filter((a) => a.isConsumable && !a.inStock)
  if (toRestock.length === 0) return null

  return (
    <section className="mt-6">
      <h2 className="text-ink text-base font-semibold">Por reponer</h2>
      <p className="text-ink-muted mt-0.5 text-xs">
        Consumibles que marcaste como agotados.
      </p>
      <ul className="border-warning/40 bg-warning/10 mt-3 flex flex-wrap gap-2 rounded-lg border p-3">
        {toRestock.map((article) => (
          <li key={article.id}>
            <button
              type="button"
              onClick={() => setIsBuying(article.id)}
              className="border-border bg-surface-raised text-ink hover:bg-surface-sunken min-h-11 rounded-lg border px-3 text-sm"
            >
              {article.name}
            </button>
          </li>
        ))}
      </ul>

      <Sheet
        isOpen={isBuying !== null}
        onClose={() => setIsBuying(null)}
        title="Registrar compra"
      >
        {isBuying !== null && (
          <PurchaseForm
            products={toRestock}
            defaultProductId={isBuying}
            onDone={() => setIsBuying(null)}
          />
        )}
      </Sheet>
    </section>
  )
}

function ArticleRow({
  article,
  currency,
  onEdit,
  onRemove,
  onError,
}: {
  article: Article
  currency: string
  onEdit: () => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  const [isBuying, setIsBuying] = useState(false)
  const isProduct = article.type === 'PRODUCT'
  const { confirm, dialog } = useConfirm()

  const { data: statsData } = useQuery(ProductStatsQuery, { skip: !isProduct })
  const stats = statsData?.productStats.find((s) => s.articleId === article.id)

  const [markDepleted] = useMutation(MarkProductDepletedMutation, {
    update: evictInventory,
  })

  const handleDepleted = async () => {
    const ok = await confirm({
      title: `¿Marcar "${article.name}" como agotado?`,
      message: 'Entrará a la lista de compras ("Por reponer").',
      confirmLabel: 'Marcar agotado',
      danger: false,
    })
    if (!ok) return
    try {
      await markDepleted({ variables: { articleId: article.id, depletedOn: null } })
    } catch (caught) {
      onError(getFirstErrorMessage(caught))
    }
  }

  return (
    <li className="border-border bg-surface-raised rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink text-sm font-medium">
            {article.name}
            {article.brand && (
              <span className="text-ink-muted font-normal"> · {article.brand}</span>
            )}
          </p>
          <p className="text-ink-muted mt-0.5 text-xs">
            {formatPackage(article.packageSize, article.unit)}
            {article.category && ` · ${article.category.name}`}
          </p>
        </div>
        {isProduct && (
          <StockBadge inStock={article.inStock} isConsumable={article.isConsumable} />
        )}
      </div>

      {stats && stats.closedCycles > 0 && (
        <p className="text-ink-secondary mt-2 text-xs">
          Dura {Math.round(stats.avgDaysLasted ?? 0)} días de media
          {stats.avgUnitPrice != null &&
            ` · ${formatAmount(stats.avgUnitPrice, currency)} por unidad`}
          {stats.estimatedDepletionDate &&
            ` · se estima que se acaba el ${formatDate(stats.estimatedDepletionDate)}`}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        <RowAction onClick={onEdit}>Editar</RowAction>
        {isProduct && <RowAction onClick={() => setIsBuying(true)}>Comprar</RowAction>}
        {isProduct && article.isConsumable && (
          // Sin ciclo abierto el backend responde BAD_REQUEST → se deshabilita.
          <RowAction disabled={!article.inStock} onClick={() => void handleDepleted()}>
            Se acabó
          </RowAction>
        )}
        <RowAction onClick={onRemove}>Eliminar</RowAction>
      </div>

      <Sheet
        isOpen={isBuying}
        onClose={() => setIsBuying(false)}
        title="Registrar compra"
      >
        {isBuying && (
          <PurchaseForm
            products={[article]}
            defaultProductId={article.id}
            onDone={() => setIsBuying(false)}
          />
        )}
      </Sheet>

      {dialog}
    </li>
  )
}

function StockBadge({
  inStock,
  isConsumable,
}: {
  inStock: boolean
  isConsumable: boolean
}) {
  if (!isConsumable) {
    return <span className="text-ink-muted shrink-0 text-xs">durable</span>
  }
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        inStock ? 'bg-income/15 text-income' : 'bg-warning/20 text-warning'
      }`}
    >
      {inStock ? 'Hay' : 'Se acabó'}
    </span>
  )
}

function RowAction({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function PurchaseHistory({ currency }: { currency: string }) {
  const { data, loading } = useQuery(ProductPurchasesQuery, { variables: {} })
  const purchases = data?.productPurchases ?? []
  if (loading || purchases.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="text-ink text-base font-semibold">Últimas compras</h2>
      <div className="border-border mt-3 overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-border text-ink-secondary border-b">
            <tr>
              <th className="px-4 py-2.5 text-xs font-medium">Producto</th>
              <th className="px-4 py-2.5 text-xs font-medium">Fecha</th>
              <th className="px-4 py-2.5 text-xs font-medium">Tienda</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {purchases.slice(0, 10).map((purchase) => (
              <tr key={purchase.id}>
                <td className="text-ink px-4 py-2.5">{purchase.article.name}</td>
                <td className="text-ink-secondary px-4 py-2.5 whitespace-nowrap">
                  {formatDate(purchase.purchasedOn)}
                </td>
                <td className="text-ink-secondary px-4 py-2.5">
                  {purchase.store ?? '—'}
                </td>
                <td className="tabular text-ink px-4 py-2.5 text-right">
                  {purchase.totalPrice == null
                    ? '—'
                    : formatAmount(purchase.totalPrice, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
