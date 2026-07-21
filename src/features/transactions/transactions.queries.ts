import { graphql } from '@/graphql/generated'

/**
 * Gastos e ingresos comparten casi todos los campos; los ingresos añaden
 * `source` y los gastos `merchant`. Se consultan por separado porque el
 * esquema los expone como raíces distintas.
 */

export const ExpensesQuery = graphql(`
  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {
    expenses(userId: $userId, filter: $filter) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      merchant
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const IncomesQuery = graphql(`
  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {
    incomes(userId: $userId, filter: $filter) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      source
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const CreateExpenseMutation = graphql(`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      merchant
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const CreateIncomeMutation = graphql(`
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      source
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const UpdateExpenseMutation = graphql(`
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      merchant
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
    }
  }
`)

export const UpdateIncomeMutation = graphql(`
  mutation UpdateIncome($input: UpdateIncomeInput!) {
    updateIncome(input: $input) {
      id
      description
      amount
      currency
      exchangeRate
      occurredOn
      source
      notes
      recurrence
      categoryId
      category {
        id
        name
        icon
      }
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
