import { graphql } from '@/graphql/generated'

/**
 * Inventario. Un "producto" es un artículo `type: PRODUCT`; el tipo GraphQL que
 * devuelven estos endpoints es `Article` (ya no existe `Product`). Todos los
 * args de inventario son `articleId`. Usan token, no `userId`.
 *
 * `inStock` = "¿hay?": true si el artículo tiene un ciclo de consumo abierto.
 */
export const ProductsQuery = graphql(`
  query Products($search: String, $includeInactive: Boolean) {
    products(search: $search, includeInactive: $includeInactive) {
      id
      name
      brand
      packageSize
      unit
      barcode
      isConsumable
      isActive
      inStock
      notes
      category {
        id
        name
        icon
      }
    }
  }
`)

export const ProductStatsQuery = graphql(`
  query ProductStats {
    productStats {
      articleId
      name
      closedCycles
      avgDaysLasted
      minDaysLasted
      maxDaysLasted
      avgUnitPrice
      lastPurchasedOn
      estimatedDepletionDate
    }
  }
`)

export const ProductPurchasesQuery = graphql(`
  query ProductPurchases($articleId: ID) {
    productPurchases(articleId: $articleId) {
      id
      purchasedOn
      quantity
      unitPrice
      totalPrice
      store
      expenseId
      article {
        id
        name
      }
    }
  }
`)

export const ConsumptionCyclesQuery = graphql(`
  query ConsumptionCycles($articleId: ID!) {
    consumptionCycles(articleId: $articleId) {
      id
      startedOn
      depletedOn
      daysLasted
      quantity
      purchaseId
    }
  }
`)

/**
 * Compra manual. Abre/reabre el ciclo de consumo del producto → `inStock: true`.
 * `articleId` **o** `newArticle`, nunca ambos.
 */
export const RegisterProductPurchaseMutation = graphql(`
  mutation RegisterProductPurchase($input: RegisterProductPurchaseInput!) {
    registerProductPurchase(input: $input) {
      id
      purchasedOn
      quantity
      unitPrice
      totalPrice
      store
      article {
        id
        name
        inStock
      }
    }
  }
`)

export const MarkProductDepletedMutation = graphql(`
  mutation MarkProductDepleted($articleId: ID!, $depletedOn: String) {
    markProductDepleted(articleId: $articleId, depletedOn: $depletedOn) {
      id
      name
      inStock
    }
  }
`)

/** Edita el artículo-producto. Acepta campos de inventario (packageSize, etc.). */
export const UpdateProductMutation = graphql(`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      brand
      packageSize
      unit
      barcode
      isConsumable
      isActive
    }
  }
`)

export const RemoveProductMutation = graphql(`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id)
  }
`)
