import { graphql } from '@/graphql/generated'

/**
 * Inflación REAL de precios: cómo varía el precio unitario de lo que compras,
 * agregado en un índice. NO confundir con `expenseInflation`, que mide la
 * variación del gasto total (que se mueve también por cuánto consumes).
 *
 * Nombres de campos verificados contra el esquema en vivo.
 */
export const ArticleInflationQuery = graphql(`
  query ArticleInflation($filter: ArticleInflationFilterInput) {
    articleInflation(filter: $filter) {
      latestMonthlyRate
      latestAnnualRate
      averageMonthlyRate
      points {
        period
        monthlyRate
        annualRate
        basketSize
      }
      articles {
        articleId
        name
        latestMonthlyRate
        latestAnnualRate
        points {
          period
          avgUnitPrice
          quantity
          monthlyRate
          annualRate
        }
      }
      categories {
        categoryId
        categoryName
        latestMonthlyRate
        latestAnnualRate
        points {
          period
          monthlyRate
          annualRate
        }
      }
    }
  }
`)
