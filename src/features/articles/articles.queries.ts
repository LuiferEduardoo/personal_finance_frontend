import { graphql } from '@/graphql/generated'

/**
 * Búsqueda de artículos para el selector del formulario de gasto.
 *
 * Es la única operación de artículos que necesita el frontend: la creación se
 * hace con `newArticle` dentro de `CreateExpenseInput`, no con una mutación
 * aparte, y no hay pantalla de gestión. Usa el token, no `userId`.
 */
export const ArticlesQuery = graphql(`
  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {
    articles(search: $search, type: $type, includeInactive: $includeInactive) {
      id
      name
      type
      brand
      unit
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)
