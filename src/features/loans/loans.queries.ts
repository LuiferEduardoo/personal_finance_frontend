import { graphql } from '@/graphql/generated'

/**
 * Créditos personales. Las condiciones financieras (capital, tasa, plazo,
 * cargos) son inmutables: `updateLoan` solo cambia nombre, entidad, categoría
 * y cuenta de pagos. La tabla, los saldos y la próxima cuota los deriva el
 * backend.
 */

export const LoanSummaryFields = graphql(`
  fragment LoanSummaryFields on Loan {
    id
    name
    lender
    currency
    principalAmount
    rateType
    rate
    monthlyRate
    installmentCount
    disbursedOn
    firstDueDate
    disbursementAccountId
    paymentAccountId
    categoryId
    status
    outstandingPrincipal
    nextInstallment {
      id
      sequenceNumber
      dueDate
      amount
    }
    installments {
      id
      status
    }
  }
`)

export const LoansQuery = graphql(`
  query Loans {
    loans {
      ...LoanSummaryFields
    }
  }
`)

export const LoanQuery = graphql(`
  query Loan($id: ID!) {
    loan(id: $id) {
      ...LoanSummaryFields
      totalInterest
      totalCharges
      charges {
        id
        name
        kind
        mode
        value
      }
      installments {
        id
        sequenceNumber
        dueDate
        openingBalance
        principalAmount
        interestAmount
        chargesAmount
        amount
        status
        paidOn
        expenseId
      }
      prepayments {
        id
        amount
        mode
        paidOn
        createdAt
      }
    }
  }
`)

export const CreateLoanMutation = graphql(`
  mutation CreateLoan($input: CreateLoanInput!) {
    createLoan(input: $input) {
      ...LoanSummaryFields
    }
  }
`)

export const UpdateLoanMutation = graphql(`
  mutation UpdateLoan($input: UpdateLoanInput!) {
    updateLoan(input: $input) {
      ...LoanSummaryFields
    }
  }
`)

export const RemoveLoanMutation = graphql(`
  mutation RemoveLoan($id: ID!) {
    removeLoan(id: $id)
  }
`)

/** Solo se puede pagar la cuota pendiente más antigua (`nextInstallment`). */
export const PayLoanInstallmentMutation = graphql(`
  mutation PayLoanInstallment($input: PayLoanInstallmentInput!) {
    payLoanInstallment(input: $input) {
      id
      status
      paidOn
      expenseId
    }
  }
`)

export const PrepayLoanMutation = graphql(`
  mutation PrepayLoan($input: PrepayLoanInput!) {
    prepayLoan(input: $input) {
      id
      status
      outstandingPrincipal
    }
  }
`)
