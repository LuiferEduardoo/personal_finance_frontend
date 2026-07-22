import { graphql } from '@/graphql/generated'

/**
 * Catálogo de artículos. Se usa tanto para el selector del formulario de gasto
 * (búsqueda) como para la pantalla de gestión de Artículos. Usa el token, no
 * `userId`. Incluye los campos de inventario (`inStock`, `isConsumable`, …) que
 * la pantalla de Productos necesita — para artículos que no son producto vienen
 * en null/false, sin coste.
 */
export const ArticlesQuery = graphql(`
  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {
    articles(search: $search, type: $type, includeInactive: $includeInactive) {
      id
      name
      type
      brand
      unit
      packageSize
      barcode
      isConsumable
      inStock
      isActive
      notes
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const CreateArticleMutation = graphql(`
  mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
      id
      name
      type
      brand
      unit
      isActive
    }
  }
`)

export const UpdateArticleMutation = graphql(`
  mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
      id
      name
      type
      brand
      unit
      isActive
      notes
      categoryId
    }
  }
`)

export const RemoveArticleMutation = graphql(`
  mutation RemoveArticle($id: ID!) {
    removeArticle(id: $id)
  }
`)
