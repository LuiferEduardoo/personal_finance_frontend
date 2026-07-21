import { graphql } from '@/graphql/generated'

/**
 * Inflación personal: variación del gasto mensual, ya convertido a la moneda
 * base por el backend. Usa el token, no `userId`.
 */
export const ExpenseInflationQuery = graphql(`
  query ExpenseInflation($filter: InflationFilterInput) {
    expenseInflation(filter: $filter) {
      latestMonthlyRate
      latestAnnualRate
      averageMonthlyRate
      points {
        period
        total
        count
        monthlyRate
        annualRate
      }
    }
  }
`)
