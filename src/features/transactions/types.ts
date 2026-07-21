import type {
  ArticleType,
  ExpensesQuery,
  IncomesQuery,
} from '@/graphql/generated/graphql'
import type { MoneyDirection } from '@/lib/money'

export type Expense = ExpensesQuery['expenses'][number]
export type Income = IncomesQuery['incomes'][number]

/**
 * Vista unificada de gastos e ingresos para las listas.
 *
 * `kind` conserva el origen: es lo que decide a qué mutación va una edición y
 * de qué color y signo se pinta el importe. Nunca se infiere del signo del
 * importe — el backend guarda ambos como positivos.
 */
export type Transaction = {
  id: string
  kind: 'EXPENSE' | 'INCOME'
  description: string
  amount: number
  currency: string
  exchangeRate: number
  occurredOn: string
  /** `merchant` en gastos, `source` en ingresos: dónde se gastó / de dónde vino. */
  counterparty: string | null
  notes: string | null
  categoryId: string | null
  categoryName: string | null
  categoryIcon: string | null
  /** Artículo vinculado y cantidad. Solo gastos; en ingresos van en null. */
  articleId: string | null
  articleName: string | null
  articleType: ArticleType | null
  quantity: number | null
  unitPrice: number | null
}

export function directionOf(kind: Transaction['kind']): MoneyDirection {
  return kind === 'INCOME' ? 'in' : 'out'
}

export function expenseToTransaction(expense: Expense): Transaction {
  return {
    id: expense.id,
    kind: 'EXPENSE',
    description: expense.description,
    amount: expense.amount,
    currency: expense.currency,
    exchangeRate: expense.exchangeRate,
    occurredOn: expense.occurredOn,
    counterparty: expense.merchant ?? null,
    notes: expense.notes ?? null,
    categoryId: expense.categoryId ?? null,
    categoryName: expense.category?.name ?? null,
    categoryIcon: expense.category?.icon ?? null,
    articleId: expense.articleId ?? null,
    articleName: expense.article?.name ?? null,
    articleType: expense.article?.type ?? null,
    quantity: expense.quantity ?? null,
    unitPrice: expense.unitPrice ?? null,
  }
}

export function incomeToTransaction(income: Income): Transaction {
  return {
    id: income.id,
    kind: 'INCOME',
    description: income.description,
    amount: income.amount,
    currency: income.currency,
    exchangeRate: income.exchangeRate,
    occurredOn: income.occurredOn,
    counterparty: income.source ?? null,
    notes: income.notes ?? null,
    categoryId: income.categoryId ?? null,
    categoryName: income.category?.name ?? null,
    categoryIcon: income.category?.icon ?? null,
    // Los ingresos no llevan artículo.
    articleId: null,
    articleName: null,
    articleType: null,
    quantity: null,
    unitPrice: null,
  }
}
