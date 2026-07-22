import { graphql } from '@/graphql/generated'

/**
 * Gastos recurrentes: plantillas que generan gastos automáticamente. Reusan la
 * forma del gasto (importe o ítems + cuenta) más `recurrence` (obligatorio, no
 * `ONCE`), `startOn` y `endOn` opcional. `nextRunOn` lo maneja el backend.
 * Guardados por token: no reciben `userId`.
 */
export const RecurringFields = graphql(`
  fragment RecurringFields on RecurringExpense {
    id
    description
    amount
    currency
    recurrence
    startOn
    endOn
    nextRunOn
    isActive
    merchant
    notes
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
      article {
        id
        name
        type
      }
    }
  }
`)

export const RecurringExpensesQuery = graphql(`
  query RecurringExpenses($includeInactive: Boolean) {
    recurringExpenses(includeInactive: $includeInactive) {
      ...RecurringFields
    }
  }
`)

export const CreateRecurringExpenseMutation = graphql(`
  mutation CreateRecurringExpense($input: CreateRecurringExpenseInput!) {
    createRecurringExpense(input: $input) {
      ...RecurringFields
    }
  }
`)

export const UpdateRecurringExpenseMutation = graphql(`
  mutation UpdateRecurringExpense($input: UpdateRecurringExpenseInput!) {
    updateRecurringExpense(input: $input) {
      ...RecurringFields
    }
  }
`)

export const RemoveRecurringExpenseMutation = graphql(`
  mutation RemoveRecurringExpense($id: ID!) {
    removeRecurringExpense(id: $id)
  }
`)

export const RunDueRecurringExpensesMutation = graphql(`
  mutation RunDueRecurringExpenses {
    runDueRecurringExpenses
  }
`)
