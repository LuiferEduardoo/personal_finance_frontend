import { graphql } from '@/graphql/generated'

/**
 * Presupuestos mensuales por categoría con lo gastado en `month` (`YYYY-MM`).
 * `spent` incluye las subcategorías y viene en moneda base.
 */
export const CategoryBudgetsQuery = graphql(`
  query CategoryBudgets($month: String) {
    categoryBudgets(month: $month) {
      id
      period
      amount
      currency
      spent
      remaining
      percentage
      exceeded
      category {
        id
        name
        icon
        parentId
      }
    }
  }
`)

/** Upsert: crea o reemplaza el tope de la categoría. */
export const SetCategoryBudgetMutation = graphql(`
  mutation SetCategoryBudget($input: SetCategoryBudgetInput!) {
    setCategoryBudget(input: $input) {
      id
      period
      amount
      currency
    }
  }
`)

export const RemoveCategoryBudgetMutation = graphql(`
  mutation RemoveCategoryBudget($categoryId: ID!) {
    removeCategoryBudget(categoryId: $categoryId)
  }
`)
