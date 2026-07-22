import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { useCategories } from '@/features/categories/useCategories'
import { UNIT_OPTIONS } from '@/features/products/units'
import { evictInventory } from '@/graphql/cache'
import { getFirstErrorMessage } from '@/graphql/errors'
import type {
  ArticleType,
  ArticlesQuery,
  UnitOfMeasure,
} from '@/graphql/generated/graphql'
import { ARTICLE_TYPE_OPTIONS } from './article'
import { CreateArticleMutation, UpdateArticleMutation } from './articles.queries'

type Article = ArticlesQuery['articles'][number]

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.enum(['PRODUCT', 'SERVICE', 'OTHER']),
  brand: z.string().optional(),
  unit: z.string().optional(),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

type ArticleFormProps = {
  /** Presente al editar; ausente al crear. */
  article?: Article
  /** Tipo por defecto al crear (la pestaña activa). */
  defaultType: ArticleType
  onDone: () => void
}

export function ArticleForm({ article, defaultType, onDone }: ArticleFormProps) {
  const isEditing = article != null
  const [formError, setFormError] = useState<string | null>(null)

  // Eviction: refresca el catálogo en todas las vistas (pestañas de Artículos,
  // el buscador del formulario de gasto), no solo la lista activa.
  const [createArticle] = useMutation(CreateArticleMutation, { update: evictInventory })
  const [updateArticle] = useMutation(UpdateArticleMutation, { update: evictInventory })

  const { tree } = useCategories('EXPENSE')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: article?.name ?? '',
      type: article?.type ?? defaultType,
      brand: article?.brand ?? '',
      unit: article?.unit ?? 'UNIT',
      categoryId: article?.categoryId ?? '',
      notes: article?.notes ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const optional = (value: string | undefined) => value?.trim() || undefined
    const base = {
      name: values.name,
      type: values.type,
      brand: optional(values.brand),
      unit: (values.unit as UnitOfMeasure) || undefined,
      categoryId: optional(values.categoryId),
      notes: optional(values.notes),
    }

    try {
      if (isEditing) {
        await updateArticle({ variables: { input: { id: article.id, ...base } } })
      } else {
        // Nombre único por usuario: si choca, el backend responde con el error
        // crudo de Postgres; se muestra tal cual (mejor que tragárselo).
        await createArticle({ variables: { input: base } })
      }
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Nombre"
        placeholder="Shampoo Head & Shoulders"
        error={errors.name?.message}
        {...register('name')}
      />

      <Select label="Tipo" error={errors.type?.message} {...register('type')}>
        {ARTICLE_TYPE_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Marca (opcional)" placeholder="P&G" {...register('brand')} />
        <Select label="Unidad" {...register('unit')}>
          {UNIT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Select label="Categoría (opcional)" {...register('categoryId')}>
        <option value="">Sin categoría</option>
        {tree.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {depth > 0 ? '  ' : ''}
            {category.icon ? `${category.icon} ` : ''}
            {category.name}
          </option>
        ))}
      </Select>

      <Field label="Notas (opcional)" {...register('notes')} />

      {formError && (
        <p role="alert" className="text-expense text-sm">
          {formError}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="secondary" onClick={onDone} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          {isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
