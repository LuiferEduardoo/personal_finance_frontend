import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import type { CategoriesQuery as CategoriesQueryType } from '@/graphql/generated/graphql'
import type { TransactionKind } from '@/graphql/generated/graphql'
import { CategoriesQuery } from './categories.queries'

export type Category = CategoriesQueryType['categories'][number]

/** Una categoría del sistema no se puede editar ni borrar (el backend lo rechaza). */
export function isSystemCategory(category: Pick<Category, 'userId'>): boolean {
  return category.userId == null
}

/**
 * Categorías del usuario más las del sistema.
 * El backend obtiene el propietario directamente del token de acceso.
 */
export function useCategories(kind?: TransactionKind) {
  const { data, loading, error } = useQuery(CategoriesQuery, {
    variables: { kind },
  })

  const categories = useMemo(() => data?.categories ?? [], [data?.categories])

  /**
   * Categorías ordenadas como árbol: cada padre seguido de sus hijos, con
   * `depth` para indentarlas en un `<select>` plano.
   */
  const tree = useMemo(() => {
    const roots = categories.filter((category) => !category.parentId)
    const childrenOf = new Map<string, Category[]>()
    for (const category of categories) {
      if (!category.parentId) continue
      const siblings = childrenOf.get(category.parentId) ?? []
      siblings.push(category)
      childrenOf.set(category.parentId, siblings)
    }

    return roots.flatMap((root) => [
      { category: root, depth: 0 },
      ...(childrenOf.get(root.id) ?? []).map((child) => ({
        category: child,
        depth: 1,
      })),
    ])
  }, [categories])

  return { categories, tree, loading, error }
}
