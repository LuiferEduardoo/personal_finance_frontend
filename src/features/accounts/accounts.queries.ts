import { graphql } from '@/graphql/generated'

/**
 * Cuentas (banco, efectivo, tarjeta, billetera). Guardadas por token: no
 * reciben `userId`.
 *
 * `balance` lo mantiene el backend: ingresos suben, gastos bajan, transferencias
 * mueven. `availableCredit` (`= creditLimit + balance`) es null salvo en tarjetas
 * de crédito. Los campos de crédito solo tienen sentido cuando `type = CREDIT`.
 */
export const AccountFields = graphql(`
  fragment AccountFields on Account {
    id
    name
    type
    currency
    openingBalance
    balance
    availableCredit
    creditLimit
    statementDay
    dueDay
    monthlyRate
    issuer
    lastFour
    isActive
  }
`)

export const AccountsQuery = graphql(`
  query Accounts($includeInactive: Boolean) {
    accounts(includeInactive: $includeInactive) {
      ...AccountFields
    }
  }
`)

export const AccountQuery = graphql(`
  query Account($id: ID!) {
    account(id: $id) {
      ...AccountFields
    }
  }
`)

export const AccountTransfersQuery = graphql(`
  query AccountTransfers($accountId: ID) {
    accountTransfers(accountId: $accountId) {
      id
      amount
      occurredOn
      note
      fromAccount {
        id
        name
        type
      }
      toAccount {
        id
        name
        type
      }
    }
  }
`)

export const CreateAccountMutation = graphql(`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ...AccountFields
    }
  }
`)

export const UpdateAccountMutation = graphql(`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      ...AccountFields
    }
  }
`)

export const RemoveAccountMutation = graphql(`
  mutation RemoveAccount($id: ID!) {
    removeAccount(id: $id)
  }
`)

/**
 * La respuesta trae ambas cuentas con su `balance` ya actualizado, así que se
 * puede escribir directo en caché sin refetch.
 */
export const TransferMutation = graphql(`
  mutation Transfer($input: TransferInput!) {
    transferBetweenAccounts(input: $input) {
      id
      amount
      occurredOn
      note
      fromAccount {
        ...AccountFields
      }
      toAccount {
        ...AccountFields
      }
    }
  }
`)

export const RecalculateAccountBalanceMutation = graphql(`
  mutation RecalculateAccountBalance($id: ID!) {
    recalculateAccountBalance(id: $id) {
      id
      balance
    }
  }
`)
