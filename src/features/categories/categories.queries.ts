import { graphql } from '@/graphql/generated'

/**
 * Devuelve las categorías del sistema (`userId: null`) más las del usuario.
 * El usuario se obtiene del token de acceso; la consulta no acepta `userId`.
 */
export const CategoriesQuery = graphql(`
  query Categories($kind: TransactionKind) {
    categories(kind: $kind) {
      id
      name
      icon
      color
      kind
      parentId
      userId
      isActive
    }
  }
`)

export const CreateCategoryMutation = graphql(`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      icon
      color
      kind
      parentId
      userId
      isActive
    }
  }
`)

export const UpdateCategoryMutation = graphql(`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
      icon
      color
      isActive
    }
  }
`)

export const RemoveCategoryMutation = graphql(`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id)
  }
`)
