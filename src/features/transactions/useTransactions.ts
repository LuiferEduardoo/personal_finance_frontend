import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { ExpensesQuery, IncomesQuery } from './transactions.queries'
import { expenseToTransaction, incomeToTransaction, type Transaction } from './types'

export type TransactionsFilter = {
  from?: string
  to?: string
  categoryId?: string
}

/** Qué mostrar: solo gastos, solo ingresos, o ambos mezclados. */
export type TransactionsScope = 'ALL' | 'EXPENSE' | 'INCOME'

/**
 * Gastos e ingresos combinados y ordenados por fecha descendente.
 *
 * El backend ordena cada lista por su cuenta, así que la mezcla hay que
 * reordenarla aquí: concatenar dos listas ordenadas no da una lista ordenada.
 */
export function useTransactions(
  scope: TransactionsScope,
  filter: TransactionsFilter = {},
) {
  const variables = { filter }

  const expenses = useQuery(ExpensesQuery, {
    variables,
    skip: scope === 'INCOME',
  })
  const incomes = useQuery(IncomesQuery, {
    variables,
    skip: scope === 'EXPENSE',
  })

  const transactions = useMemo<Transaction[]>(() => {
    const combined = [
      ...(expenses.data?.expenses ?? []).map(expenseToTransaction),
      ...(incomes.data?.incomes ?? []).map(incomeToTransaction),
    ]
    // Las fechas son YYYY-MM-DD, así que el orden lexicográfico es el
    // cronológico y no hace falta parsearlas.
    return combined.sort((a, b) => b.occurredOn.localeCompare(a.occurredOn))
  }, [expenses.data?.expenses, incomes.data?.incomes])

  return {
    transactions,
    loading: expenses.loading || incomes.loading,
    error: expenses.error ?? incomes.error,
  }
}
