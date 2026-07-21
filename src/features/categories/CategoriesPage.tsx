import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useCurrentUserId } from '@/features/auth/SessionContext'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { TransactionKind } from '@/graphql/generated/graphql'
import {
  CategoriesQuery,
  CreateCategoryMutation,
  RemoveCategoryMutation,
} from './categories.queries'
import { isSystemCategory, useCategories } from './useCategories'

export function CategoriesPage() {
  const userId = useCurrentUserId()
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const { tree, loading, error } = useCategories()

  const [removeCategory] = useMutation(RemoveCategoryMutation, {
    refetchQueries: [{ query: CategoriesQuery, variables: { userId } }],
  })

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${name}"?`)) return
    setActionError(null)
    try {
      await removeCategory({ variables: { id } })
    } catch (caught) {
      setActionError(getFirstErrorMessage(caught))
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Categorías</h1>
        <Button onClick={() => setIsCreating(true)}>Nueva</Button>
      </div>

      <p className="text-ink-secondary mt-2 text-sm">
        Las categorías del sistema las ve todo el mundo y no se pueden modificar.
      </p>

      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingRows rows={5} />
        ) : error ? (
          <ErrorState message={getFirstErrorMessage(error)} />
        ) : tree.length === 0 ? (
          <EmptyState title="Sin categorías" />
        ) : (
          <ul className="border-border divide-border divide-y rounded-lg border">
            {tree.map(({ category, depth }) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
                style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
              >
                <span className="text-ink min-w-0 truncate text-sm">
                  {category.icon && `${category.icon} `}
                  {category.name}
                  <span className="text-ink-muted ml-2 text-xs">
                    {category.kind === 'INCOME' ? 'ingreso' : 'gasto'}
                  </span>
                </span>

                {isSystemCategory(category) ? (
                  // El backend responde BAD_REQUEST si se intenta: mejor no
                  // ofrecer la acción que mostrar el error después.
                  <span className="text-ink-muted shrink-0 text-xs">del sistema</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleRemove(category.id, category.name)}
                    className="text-ink-secondary hover:bg-surface-sunken min-h-11 shrink-0 rounded-lg px-3 text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Nueva categoría"
      >
        {isCreating && <CategoryForm onDone={() => setIsCreating(false)} />}
      </Sheet>
    </div>
  )
}

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  kind: z.enum(['EXPENSE', 'INCOME']),
  parentId: z.string().optional(),
  icon: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function CategoryForm({ onDone }: { onDone: () => void }) {
  const userId = useCurrentUserId()
  const [formError, setFormError] = useState<string | null>(null)
  const [createCategory] = useMutation(CreateCategoryMutation, {
    refetchQueries: [{ query: CategoriesQuery, variables: { userId } }],
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { kind: 'EXPENSE', parentId: '', icon: '' },
  })

  const kind = watch('kind')
  // El backend exige que la categoría padre sea del mismo `kind`, así que la
  // lista de padres se filtra en vez de dejar elegir una combinación inválida.
  const { tree } = useCategories(kind as TransactionKind)

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await createCategory({
        variables: {
          input: {
            userId,
            name: values.name,
            kind: values.kind,
            parentId: values.parentId?.trim() || undefined,
            icon: values.icon?.trim() || undefined,
          },
        },
      })
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Nombre"
        placeholder="Videojuegos"
        error={errors.name?.message}
        {...register('name')}
      />

      <Select label="Tipo" error={errors.kind?.message} {...register('kind')}>
        <option value="EXPENSE">Gasto</option>
        <option value="INCOME">Ingreso</option>
      </Select>

      <Select
        label="Categoría padre (opcional)"
        error={errors.parentId?.message}
        {...register('parentId')}
      >
        <option value="">Ninguna</option>
        {tree
          // Solo las raíces: el backend no admite más de un nivel de anidación.
          .filter(({ depth }) => depth === 0)
          .map(({ category }) => (
            <option key={category.id} value={category.id}>
              {category.icon ? `${category.icon} ` : ''}
              {category.name}
            </option>
          ))}
      </Select>

      <Field
        label="Icono (opcional)"
        placeholder="🎮"
        maxLength={4}
        error={errors.icon?.message}
        {...register('icon')}
      />

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
          Crear
        </Button>
      </div>
    </form>
  )
}
