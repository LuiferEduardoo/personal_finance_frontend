import { graphql } from '@/graphql/generated'

/**
 * Gastos e ingresos comparten cabecera (importe, fecha, cuenta, categoría). El
 * gasto añade `merchant` y una lista de `items`; el ingreso añade `source` y no
 * tiene ítems. Los campos comunes viven en fragmentos para no repetirlos.
 *
 * El gasto pasó de "un artículo + cantidad" a **una lista de ítems**: `article`,
 * `quantity` y `unitPrice` ya no están en el gasto, sino en `items[]`.
 */

export const ExpenseFields = graphql(`
  fragment ExpenseFields on Expense {
    id
    description
    amount
    currency
    exchangeRate
    occurredOn
    merchant
    notes
    recurrence
    accountId
    account {
      id
      name
    }
    categoryId
    category {
      id
      name
      icon
    }
    items {
      id
      articleId
      description
      unitPrice
      quantity
      subtotal
      article {
        id
        name
        type
      }
    }
  }
`)

export const IncomeFields = graphql(`
  fragment IncomeFields on Income {
    id
    description
    amount
    currency
    exchangeRate
    occurredOn
    source
    notes
    recurrence
    accountId
    account {
      id
      name
    }
    categoryId
    category {
      id
      name
      icon
    }
  }
`)

export const ExpensesQuery = graphql(`
  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {
    expenses(userId: $userId, filter: $filter) {
      ...ExpenseFields
    }
  }
`)

export const IncomesQuery = graphql(`
  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {
    incomes(userId: $userId, filter: $filter) {
      ...IncomeFields
    }
  }
`)

export const CreateExpenseMutation = graphql(`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ...ExpenseFields
    }
  }
`)

export const CreateIncomeMutation = graphql(`
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
      ...IncomeFields
    }
  }
`)

export const UpdateExpenseMutation = graphql(`
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
      ...ExpenseFields
    }
  }
`)

export const UpdateIncomeMutation = graphql(`
  mutation UpdateIncome($input: UpdateIncomeInput!) {
    updateIncome(input: $input) {
      ...IncomeFields
    }
  }
`)

export const RemoveExpenseMutation = graphql(`
  mutation RemoveExpense($id: ID!) {
    removeExpense(id: $id)
  }
`)

export const RemoveIncomeMutation = graphql(`
  mutation RemoveIncome($id: ID!) {
    removeIncome(id: $id)
  }
`)
