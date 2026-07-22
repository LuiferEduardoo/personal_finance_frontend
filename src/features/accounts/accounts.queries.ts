import { graphql } from '@/graphql/generated'

/**
 * Cuentas (banco, efectivo, tarjeta, billetera). Guardadas por token: no
 * reciben `userId`. Los campos de crédito solo tienen sentido cuando
 * `type = CREDIT` (el backend valida que solo crédito los lleve).
 */
export const AccountsQuery = graphql(`
  query Accounts($includeInactive: Boolean) {
    accounts(includeInactive: $includeInactive) {
      id
      name
      type
      currency
      openingBalance
      isActive
      creditLimit
      statementDay
      dueDay
      monthlyRate
      issuer
      lastFour
    }
  }
`)

export const CreateAccountMutation = graphql(`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      type
      currency
      openingBalance
      isActive
    }
  }
`)

export const UpdateAccountMutation = graphql(`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      id
      name
      type
      currency
      openingBalance
      isActive
      creditLimit
      statementDay
      dueDay
      monthlyRate
      issuer
      lastFour
    }
  }
`)

export const RemoveAccountMutation = graphql(`
  mutation RemoveAccount($id: ID!) {
    removeAccount(id: $id)
  }
`)
