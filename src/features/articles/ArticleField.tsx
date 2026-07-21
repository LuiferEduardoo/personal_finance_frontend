import { useQuery } from '@apollo/client'
import { useId, useState } from 'react'
import { Select } from '@/components/Select'
import { useCategories } from '@/features/categories/useCategories'
import type { ArticleType } from '@/graphql/generated/graphql'
import { useDebouncedValue } from '@/lib/useDebouncedValue'
import { ARTICLE_TYPE_OPTIONS, type ArticleSelection } from './article'
import { ArticlesQuery } from './articles.queries'

export type { ArticleSelection }

type ArticleFieldProps = {
  value: ArticleSelection
  onChange: (value: ArticleSelection) => void
}

/**
 * Clasifica y elige el artículo de un gasto.
 *
 * El select "Tipo" (producto / servicio / otro) está SIEMPRE visible: es la
 * distinción principal de qué se compró. Filtra la búsqueda y clasifica lo que
 * se crea. Debajo, un combobox "elegir o crear": se busca en el catálogo y, si
 * no aparece, se ofrece crearlo con el tipo elegido. Todo es opcional: el estado
 * inicial `none` no envía ningún campo de artículo.
 */
export function ArticleField({ value, onChange }: ArticleFieldProps) {
  const id = useId()
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  // Tipo "en borrador" mientras aún no hay artículo elegido: gobierna la
  // búsqueda y el alta. Cuando ya hay uno, el tipo lo lleva la propia selección.
  const [draftType, setDraftType] = useState<ArticleType>('PRODUCT')

  const effectiveType = value.mode === 'none' ? draftType : value.type
  const debouncedTerm = useDebouncedValue(term.trim(), 250)

  const { data, loading } = useQuery(ArticlesQuery, {
    variables: { search: debouncedTerm || undefined, type: draftType },
    // Sin al menos dos letras la búsqueda no acota nada útil.
    skip: value.mode !== 'none' || debouncedTerm.length < 2,
  })
  const results = data?.articles ?? []

  const hasExactMatch = results.some(
    (article) => article.name.toLowerCase() === debouncedTerm.toLowerCase(),
  )
  const canCreate = value.mode === 'none' && debouncedTerm.length >= 2 && !hasExactMatch

  return (
    <div className="flex flex-col gap-3">
      <TypeSelect
        value={effectiveType}
        // Con un artículo existente el tipo es intrínseco: se muestra pero no
        // se cambia (cambiarlo no altera el artículo en el servidor).
        disabled={value.mode === 'existing'}
        onChange={(type) => {
          if (value.mode === 'new') onChange({ ...value, type })
          else setDraftType(type)
        }}
      />

      {value.mode === 'existing' ? (
        <SelectedRow label={value.label} onClear={() => onChange({ mode: 'none' })} />
      ) : value.mode === 'new' ? (
        <NewArticleFields value={value} onChange={onChange} />
      ) : (
        <div className="relative">
          <label htmlFor={id} className="text-ink-secondary block text-sm font-medium">
            Nombres articulos (opcional)
          </label>
          <input
            id={id}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            autoComplete="off"
            value={term}
            placeholder="Buscar o crear…"
            onChange={(event) => {
              setTerm(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            // Retraso para que el click en una opción llegue antes del cierre.
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="border-border bg-surface-raised text-ink placeholder:text-ink-muted focus:border-ink mt-1.5 min-h-11 w-full rounded-lg border px-3 text-base outline-none"
          />

          {open && (term.trim().length >= 2 || results.length > 0) && (
            <ul className="border-border bg-surface-raised absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg">
              {results.map((article) => (
                <li key={article.id}>
                  <button
                    type="button"
                    // onMouseDown, no onClick: se dispara antes que el blur del input.
                    onMouseDown={() =>
                      onChange({
                        mode: 'existing',
                        articleId: article.id,
                        type: article.type,
                        label: article.brand
                          ? `${article.name} · ${article.brand}`
                          : article.name,
                      })
                    }
                    className="hover:bg-surface-sunken flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left text-sm"
                  >
                    <span className="text-ink truncate">{article.name}</span>
                    {article.brand && (
                      <span className="text-ink-muted shrink-0 text-xs">
                        {article.brand}
                      </span>
                    )}
                  </button>
                </li>
              ))}

              {loading && results.length === 0 && (
                <li className="text-ink-muted px-3 py-2.5 text-sm">Buscando…</li>
              )}

              {canCreate && (
                <li className="border-border border-t">
                  <button
                    type="button"
                    onMouseDown={() =>
                      onChange({
                        mode: 'new',
                        name: term.trim(),
                        type: draftType,
                        categoryId: null,
                      })
                    }
                    className="hover:bg-surface-sunken min-h-11 w-full px-3 text-left text-sm"
                  >
                    Crear «<span className="text-ink font-medium">{term.trim()}</span>»
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function TypeSelect({
  value,
  disabled,
  onChange,
}: {
  value: ArticleType
  disabled: boolean
  onChange: (type: ArticleType) => void
}) {
  return (
    <Select
      label="Tipo"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as ArticleType)}
    >
      {ARTICLE_TYPE_OPTIONS.map(([type, label]) => (
        <option key={type} value={type}>
          {label}
        </option>
      ))}
    </Select>
  )
}

function SelectedRow({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div>
      <span className="text-ink-secondary block text-sm font-medium">Artículo</span>
      <div className="border-border bg-surface-sunken mt-1.5 flex min-h-11 items-center justify-between gap-2 rounded-lg border px-3">
        <span className="text-ink truncate text-sm">{label}</span>
        <button
          type="button"
          onClick={onClear}
          className="text-ink-secondary hover:text-ink shrink-0 text-sm underline"
        >
          Quitar
        </button>
      </div>
    </div>
  )
}

function NewArticleFields({
  value,
  onChange,
}: {
  value: Extract<ArticleSelection, { mode: 'new' }>
  onChange: (value: ArticleSelection) => void
}) {
  const { tree } = useCategories('EXPENSE')

  return (
    <div className="border-border bg-surface-sunken flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink text-sm font-medium">
          Nuevo artículo: {value.name}
        </span>
        <button
          type="button"
          onClick={() => onChange({ mode: 'none' })}
          className="text-ink-secondary hover:text-ink shrink-0 text-sm underline"
        >
          Quitar
        </button>
      </div>

      <Select
        label="Categoría (opcional)"
        value={value.categoryId ?? ''}
        onChange={(event) =>
          onChange({ ...value, categoryId: event.target.value || null })
        }
      >
        <option value="">Sin categoría</option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

      <p className="text-ink-muted text-xs">
        Si el tipo es «Producto», el gasto lo añadirá a tu inventario.
      </p>
    </div>
  )
}
