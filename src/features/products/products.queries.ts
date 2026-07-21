import { graphql } from '@/graphql/generated'

/**
 * Todo el módulo de productos usa el token: no lleva `userId`.
 *
 * `inStock` responde a "¿hay champú?": es true si el producto tiene un ciclo de
 * consumo abierto.
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
      productId
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
  query ProductPurchases($productId: ID) {
    productPurchases(productId: $productId) {
      id
      purchasedOn
      quantity
      unitPrice
      totalPrice
      store
      expenseId
      product {
        id
        name
      }
    }
  }
`)

export const ConsumptionCyclesQuery = graphql(`
  query ConsumptionCycles($productId: ID!) {
    consumptionCycles(productId: $productId) {
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
 * Registrar una compra tiene efectos en cadena: abre ciclo si no había,
 * marca como comprados los ítems pendientes de la lista, y calcula totalPrice.
 * Por eso la respuesta incluye `product { inStock }`.
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
      product {
        id
        name
        inStock
      }
    }
  }
`)

export const MarkProductDepletedMutation = graphql(`
  mutation MarkProductDepleted($productId: ID!, $depletedOn: String) {
    markProductDepleted(productId: $productId, depletedOn: $depletedOn) {
      id
      name
      inStock
    }
  }
`)

export const CreateProductMutation = graphql(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      brand
      unit
      isConsumable
      isActive
      inStock
    }
  }
`)

export const RemoveProductMutation = graphql(`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id)
  }
`)
