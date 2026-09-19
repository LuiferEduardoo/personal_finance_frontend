import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { InstrumentAssetClass } from '@/graphql/generated/graphql'
import {
  CreateInstrumentMutation,
  InstrumentSearchQuery,
  SetInstrumentPriceMutation,
  UpdateInstrumentMutation,
} from './investments.queries'

const CLASSES: [InstrumentAssetClass, string][] = [
  ['EQUITY', 'Acción'],
  ['ETF', 'ETF'],
  ['FUND', 'Fondo'],
  ['BOND', 'Bono'],
  ['CRYPTO', 'Cripto'],
  ['FOREX', 'Forex'],
  ['COMMODITY', 'Materia prima'],
  ['CFD', 'CFD'],
  ['CASH', 'Efectivo'],
  ['OTHER', 'Otro'],
]
type Instrument = NonNullable<ReturnType<typeof useInstruments>['data']>[number]
function useInstruments(search: string) {
  const result = useQuery(InstrumentSearchQuery, {
    variables: { query: search || ' ', limit: 25 },
  })
  return { ...result, data: result.data?.instrumentSearch }
}

export function InvestmentMarketPage() {
  const [search, setSearch] = useState('')
  const instruments = useInstruments(search)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Instrument | null>(null)
  const [pricing, setPricing] = useState<Instrument | null>(null)
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-ink-muted text-sm">Datos de referencia</p>
          <h1 className="text-ink text-2xl font-semibold">Instrumentos y precios</h1>
        </div>
        <Button onClick={() => setCreating(true)}>Nuevo activo</Button>
      </div>
      <div className="mt-4">
        <Field
          label="Buscar por ticker o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="AAPL, Bitcoin…"
        />
      </div>
      <div className="mt-4">
        {instruments.loading ? (
          <LoadingRows rows={5} />
        ) : instruments.error ? (
          <ErrorState message={getFirstErrorMessage(instruments.error)} />
        ) : !instruments.data?.length ? (
          <EmptyState
            title="Sin resultados"
            description="Crea el instrumento si aún no existe."
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {instruments.data.map((item) => (
              <li
                key={item.id}
                className="border-border bg-surface-raised rounded-xl border p-4"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-ink font-semibold">{item.symbol}</p>
                    <p className="text-ink-secondary text-sm">{item.name}</p>
                    <p className="text-ink-muted mt-1 text-xs">
                      {CLASSES.find(([v]) => v === item.assetClass)?.[1]} ·{' '}
                      {item.exchange ?? 'Sin bolsa'} · {item.currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-ink font-medium">
                      {item.lastPrice?.toLocaleString('es-CO') ?? 'Sin precio'}
                    </p>
                    <p className="text-ink-muted text-xs">
                      {item.lastPriceOn ?? item.priceSource}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    className="text-ink-secondary min-h-10 px-3 text-sm"
                    onClick={() => setEditing(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-ink-secondary min-h-10 px-3 text-sm"
                    onClick={() => setPricing(item)}
                  >
                    Fijar precio
                  </button>
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
        title={editing ? 'Editar instrumento' : 'Nuevo instrumento'}
      >
        {(creating || editing) && (
          <InstrumentForm
            item={editing ?? undefined}
            onDone={async () => {
              setCreating(false)
              setEditing(null)
              await instruments.refetch()
            }}
          />
        )}
      </Sheet>
      <Sheet
        isOpen={!!pricing}
        onClose={() => setPricing(null)}
        title={`Precio de ${pricing?.symbol ?? ''}`}
      >
        {pricing && (
          <PriceForm
            item={pricing}
            onDone={async () => {
              setPricing(null)
              await instruments.refetch()
            }}
          />
        )}
      </Sheet>
    </div>
  )
}

function InstrumentForm({
  item,
  onDone,
}: {
  item?: Instrument
  onDone: () => Promise<void>
}) {
  const [symbol, setSymbol] = useState(item?.symbol ?? '')
  const [name, setName] = useState(item?.name ?? '')
  const [exchange, setExchange] = useState(item?.exchange ?? '')
  const [assetClass, setAssetClass] = useState<InstrumentAssetClass>(
    item?.assetClass ?? 'EQUITY',
  )
  const [currency, setCurrency] = useState(item?.currency ?? 'USD')
  const [sector, setSector] = useState(item?.sector ?? '')
  const [country, setCountry] = useState(item?.country ?? '')
  const [isin, setIsin] = useState(item?.isin ?? '')
  const [providerSymbol, setProviderSymbol] = useState(item?.twelveDataSymbol ?? '')
  const [message, setMessage] = useState<string | null>(null)
  const [create, creating] = useMutation(CreateInstrumentMutation)
  const [update, updating] = useMutation(UpdateInstrumentMutation)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (item)
        await update({
          variables: {
            input: {
              id: item.id,
              name,
              sector: sector || undefined,
              country: country || undefined,
              isin: isin || undefined,
              twelveDataSymbol: providerSymbol || undefined,
            },
          },
        })
      else
        await create({
          variables: {
            input: {
              symbol: symbol.toUpperCase(),
              name,
              exchange: exchange || undefined,
              assetClass,
              currency: currency.toUpperCase(),
              sector: sector || undefined,
              country: country || undefined,
              isin: isin || undefined,
              twelveDataSymbol: providerSymbol || undefined,
            },
          },
        })
      await onDone()
    } catch (caught) {
      setMessage(getFirstErrorMessage(caught))
    }
  }
  return (
    <form className="space-y-4" onSubmit={(e) => void submit(e)}>
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Ticker"
          value={symbol}
          disabled={!!item}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />
        <Field
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {!item && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="text-ink-secondary mb-1 block">Clase</span>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as InstrumentAssetClass)}
                className="border-border bg-surface min-h-11 w-full rounded-lg border px-3"
              >
                {CLASSES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label="Moneda"
              value={currency}
              maxLength={3}
              onChange={(e) => setCurrency(e.target.value)}
              required
            />
          </div>
          <Field
            label="Bolsa"
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
          />
        </>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Sector"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />
        <Field
          label="País (ISO 2)"
          value={country}
          maxLength={2}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <Field label="ISIN" value={isin} onChange={(e) => setIsin(e.target.value)} />
      <Field
        label="Símbolo en Twelve Data"
        value={providerSymbol}
        onChange={(e) => setProviderSymbol(e.target.value)}
      />
      {message && <ErrorState message={message} />}
      <Button type="submit" disabled={creating.loading || updating.loading}>
        {item ? 'Guardar' : 'Crear activo'}
      </Button>
    </form>
  )
}
function PriceForm({
  item,
  onDone,
}: {
  item: Instrument
  onDone: () => Promise<void>
}) {
  const [close, setClose] = useState(item.lastPrice?.toString() ?? '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [message, setMessage] = useState<string | null>(null)
  const [save, state] = useMutation(SetInstrumentPriceMutation)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await save({
        variables: {
          input: { instrumentId: item.id, close: Number(close), priceOn: date },
        },
      })
      await onDone()
    } catch (caught) {
      setMessage(getFirstErrorMessage(caught))
    }
  }
  return (
    <form className="space-y-4" onSubmit={(e) => void submit(e)}>
      <Field
        label="Precio de cierre"
        type="number"
        step="any"
        min="0"
        value={close}
        onChange={(e) => setClose(e.target.value)}
        required
      />
      <Field
        label="Fecha"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      {message && <ErrorState message={message} />}
      <Button type="submit" disabled={state.loading}>
        Guardar precio
      </Button>
    </form>
  )
}
