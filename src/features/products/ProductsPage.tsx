import { useMutation, useQuery } from '@apollo/client'
import { useMemo, useState } from 'react'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { getFirstErrorMessage } from '@/graphql/errors'
import { formatDate } from '@/lib/dates'
import { formatAmount } from '@/lib/money'
import {
  MarkProductDepletedMutation,
  ProductPurchasesQuery,
  ProductStatsQuery,
  ProductsQuery,
} from './products.queries'
import { PurchaseForm } from './PurchaseForm'
import { formatPackage } from './units'

export function ProductsPage() {
  const { user } = useSession()
  const [search, setSearch] = useState('')
  const [isBuying, setIsBuying] = useState(false)
  const [buyingProductId, setBuyingProductId] = useState<string | undefined>()
  const [actionError, setActionError] = useState<string | null>(null)

  const currency = user?.baseCurrency ?? 'COP'

  const { data, loading, error } = useQuery(ProductsQuery, {
    variables: { search: search.trim() || undefined },
  })
  const { data: statsData } = useQuery(ProductStatsQuery)

  const products = useMemo(() => data?.products ?? [], [data?.products])
  const statsByProduct = useMemo(() => {
    const map = new Map<string, NonNullable<typeof statsData>['productStats'][number]>()
    for (const stat of statsData?.productStats ?? []) map.set(stat.productId, stat)
    return map
  }, [statsData?.productStats])

  /**
   * "Por reponer": consumibles sin ciclo abierto.
   *
   * OJO: el backend mantiene una lista de compras propia (markProductDepleted
   * añade el ítem como autoAdded), pero NO la expone en el esquema — no hay
   * query para leerla. Esta lista se deriva de `inStock`, que da la misma
   * información desde el punto de vista del usuario. Si algún día se expone la
   * lista real, esto debería sustituirse por ella.
   */
  const toRestock = useMemo(
    () => products.filter((product) => product.isConsumable && !product.inStock),
    [products],
  )

  const [markDepleted] = useMutation(MarkProductDepletedMutation, {
    refetchQueries: [
      { query: ProductsQuery, variables: { search: search.trim() || undefined } },
      { query: ProductStatsQuery },
    ],
  })

  const handleDepleted = async (productId: string, name: string) => {
    if (!window.confirm(`¿Marcar "${name}" como agotado?`)) return
    setActionError(null)
    try {
      await markDepleted({ variables: { productId, depletedOn: null } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  const openPurchase = (productId?: string) => {
    setBuyingProductId(productId)
    setIsBuying(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Productos</h1>
        <Button onClick={() => openPurchase()}>Registrar compra</Button>
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Buscar producto</span>
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

      {toRestock.length > 0 && (
        <section className="mt-6">
          <h2 className="text-ink text-base font-semibold">Por reponer</h2>
          <p className="text-ink-muted mt-0.5 text-xs">
            Consumibles que marcaste como agotados.
          </p>
          <ul className="border-warning/40 bg-warning/10 mt-3 flex flex-wrap gap-2 rounded-lg border p-3">
            {toRestock.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => openPurchase(product.id)}
                  className="border-border bg-surface-raised text-ink hover:bg-surface-sunken min-h-11 rounded-lg border px-3 text-sm"
                >
                  {product.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        {loading ? (
          <LoadingRows rows={4} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : products.length === 0 ? (
          <EmptyState
            title={search ? 'Sin resultados' : 'Catálogo vacío'}
            description={
              search
                ? 'Prueba con otro término.'
                : 'Registra una compra para empezar el catálogo.'
            }
            action={
              search ? undefined : (
                <Button onClick={() => openPurchase()}>Registrar compra</Button>
              )
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {products.map((product) => {
              const stats = statsByProduct.get(product.id)
              return (
                <li
                  key={product.id}
                  className="border-border bg-surface-raised rounded-lg border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-ink text-sm font-medium">
                        {product.name}
                        {product.brand && (
                          <span className="text-ink-muted font-normal">
                            {' '}
                            · {product.brand}
                          </span>
                        )}
                      </p>
                      <p className="text-ink-muted mt-0.5 text-xs">
                        {formatPackage(product.packageSize, product.unit)}
                        {product.category && ` · ${product.category.name}`}
                        {/* El artículo suele llamarse igual que el producto; solo
                            se muestra cuando aporta algo distinto. */}
                        {product.article && product.article.name !== product.name && (
                          <> · Artículo: {product.article.name}</>
                        )}
                      </p>
                    </div>
                    <StockBadge
                      inStock={product.inStock}
                      isConsumable={product.isConsumable}
                    />
                  </div>

                  {stats && stats.closedCycles > 0 && (
                    <p className="text-ink-secondary mt-2 text-xs">
                      Dura {Math.round(stats.avgDaysLasted ?? 0)} días de media
                      {stats.avgUnitPrice != null &&
                        ` · ${formatAmount(stats.avgUnitPrice, currency)} por unidad`}
                      {/* Es una proyección, no un dato: se etiqueta como tal. */}
                      {stats.estimatedDepletionDate &&
                        ` · se estima que se acaba el ${formatDate(stats.estimatedDepletionDate)}`}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-1">
                    <RowAction onClick={() => openPurchase(product.id)}>
                      Comprar
                    </RowAction>
                    {/* Sin ciclo abierto el backend responde BAD_REQUEST, así
                        que el botón se deshabilita en vez de dejar fallar. */}
                    {product.isConsumable && (
                      <RowAction
                        disabled={!product.inStock}
                        onClick={() => void handleDepleted(product.id, product.name)}
                      >
                        Se acabó
                      </RowAction>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <PurchaseHistory currency={currency} />

      <Sheet
        isOpen={isBuying}
        onClose={() => setIsBuying(false)}
        title="Registrar compra"
      >
        {isBuying && (
          <PurchaseForm
            key={buyingProductId ?? 'nuevo'}
            products={products}
            defaultProductId={buyingProductId}
            onDone={() => setIsBuying(false)}
          />
        )}
      </Sheet>
    </div>
  )
}

function StockBadge({
  inStock,
  isConsumable,
}: {
  inStock: boolean
  isConsumable: boolean
}) {
  // Los bienes durables no llevan ciclo de agotamiento, así que "hay/no hay"
  // no significa nada para ellos.
  if (!isConsumable) {
    return <span className="text-ink-muted shrink-0 text-xs">durable</span>
  }

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        inStock ? 'bg-income/15 text-income' : 'bg-warning/20 text-warning'
      }`}
    >
      {/* El texto lleva el significado; el color solo refuerza. */}
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
                <td className="text-ink px-4 py-2.5">{purchase.product.name}</td>
                <td className="text-ink-secondary px-4 py-2.5 whitespace-nowrap">
                  {formatDate(purchase.purchasedOn)}
                </td>
                <td className="text-ink-secondary px-4 py-2.5">
                  {purchase.store ?? '—'}
                </td>
                <td className="tabular text-ink px-4 py-2.5 text-right">
                  {/* Se puede registrar una compra sin precio: el total es
                      nullable, y un 0 aquí sería un dato inventado. */}
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
