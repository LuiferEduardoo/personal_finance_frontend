/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['DateTime']['output'];
  creditLimit?: Maybe<Scalars['Float']['output']>;
  currency: Scalars['String']['output'];
  dueDay?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  issuer?: Maybe<Scalars['String']['output']>;
  lastFour?: Maybe<Scalars['String']['output']>;
  monthlyRate?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  /** Saldo inicial de la cuenta */
  openingBalance: Scalars['Float']['output'];
  statementDay?: Maybe<Scalars['Int']['output']>;
  type: PaymentMethodType;
  userId: Scalars['ID']['output'];
};

export type Article = {
  __typename?: 'Article';
  barcode?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** "hay producto": tiene un ciclo de consumo abierto (comprado y sin agotar) */
  inStock: Scalars['Boolean']['output'];
  isActive: Scalars['Boolean']['output'];
  isConsumable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  packageSize?: Maybe<Scalars['Float']['output']>;
  type: ArticleType;
  unit?: Maybe<UnitOfMeasure>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ArticleInflationFilterInput = {
  /** Un solo artículo */
  articleId?: InputMaybe<Scalars['ID']['input']>;
  /** Una categoría (incluye subcategorías) */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Mes inicial YYYY-MM (inclusive) */
  from?: InputMaybe<Scalars['String']['input']>;
  /** Mes final YYYY-MM (inclusive) */
  to?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ArticleType>;
};

/** Inflación real (índice de precios) sobre los artículos comprados. NO confundir con expenseInflation (variación de gasto). */
export type ArticleInflationReport = {
  __typename?: 'ArticleInflationReport';
  /** Desglose por artículo */
  articles: Array<ArticlePriceSeries>;
  /** Promedio de las inflaciones mensuales del índice agregado */
  averageMonthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Desglose por categoría */
  categories: Array<CategoryPriceSeries>;
  latestAnnualRate?: Maybe<Scalars['Float']['output']>;
  latestMonthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Índice agregado sobre todos los artículos */
  points: Array<InflationIndexPoint>;
};

/** Precio de un artículo en un mes y su variación */
export type ArticlePricePoint = {
  __typename?: 'ArticlePricePoint';
  annualRate?: Maybe<Scalars['Float']['output']>;
  /** Precio unitario promedio del mes */
  avgUnitPrice: Scalars['Float']['output'];
  monthlyRate?: Maybe<Scalars['Float']['output']>;
  period: Scalars['String']['output'];
  /** Cantidad comprada en el mes */
  quantity: Scalars['Float']['output'];
};

/** Serie de precios e inflación de un artículo */
export type ArticlePriceSeries = {
  __typename?: 'ArticlePriceSeries';
  articleId: Scalars['ID']['output'];
  latestAnnualRate?: Maybe<Scalars['Float']['output']>;
  latestMonthlyRate?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  points: Array<ArticlePricePoint>;
};

export type ArticleType =
  | 'OTHER'
  | 'PRODUCT'
  | 'SERVICE';

export type AuthPayload = {
  __typename?: 'AuthPayload';
  /** JWT de acceso (20 minutos) */
  accessToken: Scalars['String']['output'];
  /** Refresh token opaco (6 meses) */
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type AuthProvider =
  | 'GOOGLE'
  | 'LOCAL';

export type Authentication = {
  __typename?: 'Authentication';
  emailVerified: Scalars['Boolean']['output'];
  provider: AuthProvider;
};

export type Category = {
  __typename?: 'Category';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  kind: TransactionKind;
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  /** null = categoría del sistema */
  userId?: Maybe<Scalars['ID']['output']>;
};

/** Índice de inflación de una categoría (roll-up) */
export type CategoryPriceSeries = {
  __typename?: 'CategoryPriceSeries';
  categoryId?: Maybe<Scalars['ID']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  latestAnnualRate?: Maybe<Scalars['Float']['output']>;
  latestMonthlyRate?: Maybe<Scalars['Float']['output']>;
  points: Array<InflationIndexPoint>;
};

export type ConsumptionCycle = {
  __typename?: 'ConsumptionCycle';
  article: Article;
  articleId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  daysLasted?: Maybe<Scalars['Int']['output']>;
  depletedOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  purchaseId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  startedOn: Scalars['String']['output'];
};

export type CreateAccountInput = {
  /** Solo tarjetas de crédito */
  creditLimit?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDay?: InputMaybe<Scalars['Int']['input']>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  lastFour?: InputMaybe<Scalars['String']['input']>;
  monthlyRate?: InputMaybe<Scalars['Float']['input']>;
  /** Nombre de la cuenta (ej. "Bancolombia", "Efectivo") */
  name: Scalars['String']['input'];
  openingBalance?: InputMaybe<Scalars['Float']['input']>;
  statementDay?: InputMaybe<Scalars['Int']['input']>;
  type: PaymentMethodType;
};

export type CreateArticleInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  /** producto / servicio / otro */
  type?: InputMaybe<ArticleType>;
  unit?: InputMaybe<UnitOfMeasure>;
};

export type CreateCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  kind: TransactionKind;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateExpenseInput = {
  /** Cuenta de la que sale el gasto */
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Requerido si el gasto no tiene ítems; si hay ítems se ignora y se calcula como la suma */
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  /** Artículos comprados (opcional). El importe = suma de sus subtotales. */
  items?: InputMaybe<Array<ExpenseItemInput>>;
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del gasto (YYYY-MM-DD) */
  occurredOn: Scalars['String']['input'];
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Recurrence>;
  userId: Scalars['ID']['input'];
};

export type CreateIncomeInput = {
  /** Cuenta destino a la que entra el ingreso */
  accountId?: InputMaybe<Scalars['ID']['input']>;
  amount: Scalars['Float']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del ingreso (YYYY-MM-DD) */
  occurredOn: Scalars['String']['input'];
  recurrence?: InputMaybe<Recurrence>;
  source?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateRecurringExpenseInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Importe fijo; requerido si no hay ítems */
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  /** Fecha límite (YYYY-MM-DD) */
  endOn?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  items?: InputMaybe<Array<ExpenseItemInput>>;
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Frecuencia (no puede ser ONCE) */
  recurrence: Recurrence;
  /** Primera ocurrencia (YYYY-MM-DD) */
  startOn: Scalars['String']['input'];
};

export type Expense = {
  __typename?: 'Expense';
  account?: Maybe<Account>;
  accountId?: Maybe<Scalars['ID']['output']>;
  amount: Scalars['Float']['output'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  exchangeRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  items: Array<ExpenseItem>;
  merchant?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occurredOn: Scalars['String']['output'];
  receiptUrl?: Maybe<Scalars['String']['output']>;
  recurrence: Recurrence;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ExpenseItem = {
  __typename?: 'ExpenseItem';
  article?: Maybe<Article>;
  articleId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expenseId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  quantity: Scalars['Float']['output'];
  /** unit_price * quantity */
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type ExpenseItemInput = {
  /** Artículo existente del catálogo */
  articleId?: InputMaybe<Scalars['ID']['input']>;
  /** Etiqueta libre de la línea */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Crear el artículo en la misma línea (si no existe aún) */
  newArticle?: InputMaybe<CreateArticleInput>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  /** Precio unitario del artículo */
  unitPrice: Scalars['Float']['input'];
};

export type Income = {
  __typename?: 'Income';
  account?: Maybe<Account>;
  accountId?: Maybe<Scalars['ID']['output']>;
  amount: Scalars['Float']['output'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  exchangeRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  occurredOn: Scalars['String']['output'];
  recurrence: Recurrence;
  source?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type InflationFilterInput = {
  /** Calcular solo sobre una categoría (incluye sus subcategorías) */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Mes inicial YYYY-MM (inclusive). Por defecto, el primer gasto */
  from?: InputMaybe<Scalars['String']['input']>;
  /** Mes final YYYY-MM (inclusive). Por defecto, el mes actual */
  to?: InputMaybe<Scalars['String']['input']>;
};

/** Punto de un índice de precios (Laspeyres) en un mes */
export type InflationIndexPoint = {
  __typename?: 'InflationIndexPoint';
  /** Inflación % vs mismo mes del año anterior */
  annualRate?: Maybe<Scalars['Float']['output']>;
  /** Nº de artículos comparables en el mes (canasta) */
  basketSize: Scalars['Int']['output'];
  /** Inflación % vs mes anterior (solo efecto precio) */
  monthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Mes YYYY-MM */
  period: Scalars['String']['output'];
};

/** Gasto de un mes y su variación frente a periodos previos */
export type InflationPoint = {
  __typename?: 'InflationPoint';
  /** Variación % frente al mismo mes del año anterior. null si no hay dato */
  annualRate?: Maybe<Scalars['Float']['output']>;
  /** Cantidad de gastos registrados en el mes */
  count: Scalars['Int']['output'];
  /** Variación % frente al mes anterior. null si no hay mes previo con datos */
  monthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Mes en formato YYYY-MM */
  period: Scalars['String']['output'];
  /** Total gastado en el mes, en la moneda base del usuario */
  total: Scalars['Float']['output'];
};

/** Inflación personal calculada sobre los gastos registrados del usuario */
export type InflationReport = {
  __typename?: 'InflationReport';
  /** Promedio de las variaciones mensuales de la serie (inflación mensual promedio) */
  averageMonthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Variación anual del último periodo de la serie */
  latestAnnualRate?: Maybe<Scalars['Float']['output']>;
  /** Variación mensual del último periodo de la serie */
  latestMonthlyRate?: Maybe<Scalars['Float']['output']>;
  /** Serie mensual ordenada */
  points: Array<InflationPoint>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createArticle: Article;
  createCategory: Category;
  createExpense: Expense;
  createIncome: Income;
  createRecurringExpense: RecurringExpense;
  login: AuthPayload;
  /** Revoca el refresh token (cierra la sesión) */
  logout: Scalars['Boolean']['output'];
  /** Marca el artículo como agotado: cierra el ciclo de consumo y lo agrega a la lista de compras */
  markProductDepleted: Article;
  /** Rota el refresh token y emite un nuevo par de tokens */
  refreshTokens: AuthPayload;
  register: AuthPayload;
  /** Registra una compra. Acepta un artículo existente (articleId) o crea uno nuevo (newArticle). Abre ciclo de consumo si no hay uno y marca la lista de compras. */
  registerProductPurchase: ProductPurchase;
  removeAccount: Scalars['Boolean']['output'];
  removeArticle: Scalars['Boolean']['output'];
  removeCategory: Scalars['Boolean']['output'];
  removeExpense: Scalars['Boolean']['output'];
  removeIncome: Scalars['Boolean']['output'];
  removeProduct: Scalars['Boolean']['output'];
  removeRecurringExpense: Scalars['Boolean']['output'];
  /** Genera los gastos recurrentes vencidos (lo hace también un job diario). Devuelve cuántos se crearon. */
  runDueRecurringExpenses: Scalars['Int']['output'];
  updateAccount: Account;
  updateArticle: Article;
  updateCategory: Category;
  updateExpense: Expense;
  updateIncome: Income;
  updateProduct: Article;
  updateRecurringExpense: RecurringExpense;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateExpenseArgs = {
  input: CreateExpenseInput;
};


export type MutationCreateIncomeArgs = {
  input: CreateIncomeInput;
};


export type MutationCreateRecurringExpenseArgs = {
  input: CreateRecurringExpenseInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationMarkProductDepletedArgs = {
  articleId: Scalars['ID']['input'];
  depletedOn?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRefreshTokensArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRegisterProductPurchaseArgs = {
  input: RegisterProductPurchaseInput;
};


export type MutationRemoveAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveExpenseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveIncomeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveRecurringExpenseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateExpenseArgs = {
  input: UpdateExpenseInput;
};


export type MutationUpdateIncomeArgs = {
  input: UpdateIncomeInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateRecurringExpenseArgs = {
  input: UpdateRecurringExpenseInput;
};

export type PaymentMethodType =
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'CREDIT'
  | 'DEBIT'
  | 'DIGITAL_WALLET'
  | 'OTHER';

export type ProductPurchase = {
  __typename?: 'ProductPurchase';
  article: Article;
  articleId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  expenseId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  purchasedOn: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  store?: Maybe<Scalars['String']['output']>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type ProductStatsView = {
  __typename?: 'ProductStatsView';
  articleId: Scalars['ID']['output'];
  avgDaysLasted?: Maybe<Scalars['Float']['output']>;
  avgUnitPrice?: Maybe<Scalars['Float']['output']>;
  closedCycles: Scalars['Int']['output'];
  /** Fecha estimada de agotamiento del ciclo abierto */
  estimatedDepletionDate?: Maybe<Scalars['String']['output']>;
  lastPurchasedOn?: Maybe<Scalars['String']['output']>;
  maxDaysLasted?: Maybe<Scalars['Int']['output']>;
  minDaysLasted?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  account: Account;
  /** Cuentas del usuario (efectivo, banco, tarjeta, etc.) */
  accounts: Array<Account>;
  article: Article;
  /** Inflación real (índice de precios) por artículo y categoría. NO es expenseInflation (variación de gasto). */
  articleInflation: ArticleInflationReport;
  /** Catálogo de artículos del usuario (productos, servicios, etc.) */
  articles: Array<Article>;
  /** Categorías del sistema + las del usuario */
  categories: Array<Category>;
  category: Category;
  /** Ciclos de consumo de un artículo */
  consumptionCycles: Array<ConsumptionCycle>;
  expense: Expense;
  /** Inflación personal sobre los gastos: variación mensual y anual del gasto del usuario */
  expenseInflation: InflationReport;
  expenses: Array<Expense>;
  /** Healthcheck de la API */
  health: Scalars['String']['output'];
  income: Income;
  incomes: Array<Income>;
  /** Usuario autenticado (requiere Bearer) */
  me: User;
  product: Article;
  /** Historial de compras (opcional por artículo) */
  productPurchases: Array<ProductPurchase>;
  /** Estadísticas por producto: duración promedio, costo y fecha estimada de agotamiento */
  productStats: Array<ProductStatsView>;
  /** Catálogo de productos (artículos tipo producto) del usuario */
  products: Array<Article>;
  /** Plantillas de gastos recurrentes del usuario */
  recurringExpenses: Array<RecurringExpense>;
};


export type QueryAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAccountsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryArticleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryArticleInflationArgs = {
  filter?: InputMaybe<ArticleInflationFilterInput>;
};


export type QueryArticlesArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ArticleType>;
};


export type QueryCategoriesArgs = {
  kind?: InputMaybe<TransactionKind>;
  userId: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryConsumptionCyclesArgs = {
  articleId: Scalars['ID']['input'];
};


export type QueryExpenseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExpenseInflationArgs = {
  filter?: InputMaybe<InflationFilterInput>;
};


export type QueryExpensesArgs = {
  filter?: InputMaybe<TransactionsFilterInput>;
  userId: Scalars['ID']['input'];
};


export type QueryIncomeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIncomesArgs = {
  filter?: InputMaybe<TransactionsFilterInput>;
  userId: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductPurchasesArgs = {
  articleId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRecurringExpensesArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Recurrence =
  | 'ANNUAL'
  | 'BIMONTHLY'
  | 'BIWEEKLY'
  | 'DAILY'
  | 'MONTHLY'
  | 'ONCE'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'WEEKLY';

export type RecurringExpense = {
  __typename?: 'RecurringExpense';
  account?: Maybe<Account>;
  accountId?: Maybe<Scalars['ID']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  /** Fecha límite; al superarla la plantilla se desactiva */
  endOn?: Maybe<Scalars['String']['output']>;
  exchangeRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  items: Array<RecurringExpenseItem>;
  merchant?: Maybe<Scalars['String']['output']>;
  /** Próxima fecha en la que se generará un gasto */
  nextRunOn: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  /** Frecuencia (no puede ser ONCE) */
  recurrence: Recurrence;
  /** Fecha de la primera ocurrencia (YYYY-MM-DD) */
  startOn: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type RecurringExpenseItem = {
  __typename?: 'RecurringExpenseItem';
  article?: Maybe<Article>;
  articleId?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  quantity: Scalars['Float']['output'];
  recurringExpenseId: Scalars['ID']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RegisterProductPurchaseInput = {
  /** Artículo existente del catálogo */
  articleId?: InputMaybe<Scalars['ID']['input']>;
  /** Gasto asociado (ej. la ida al supermercado) */
  expenseId?: InputMaybe<Scalars['ID']['input']>;
  /** Crear el artículo en el catálogo en la misma compra (si no existe aún) */
  newArticle?: InputMaybe<CreateArticleInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha de compra (YYYY-MM-DD) */
  purchasedOn: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Float']['input']>;
  store?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type TransactionKind =
  | 'EXPENSE'
  | 'INCOME';

export type TransactionsFilterInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Desde (YYYY-MM-DD), inclusive */
  from?: InputMaybe<Scalars['String']['input']>;
  /** Hasta (YYYY-MM-DD), inclusive */
  to?: InputMaybe<Scalars['String']['input']>;
};

export type UnitOfMeasure =
  | 'GRAM'
  | 'KILOGRAM'
  | 'LITER'
  | 'MILLILITER'
  | 'OTHER'
  | 'PACK'
  | 'PAIR'
  | 'ROLL'
  | 'UNIT';

export type UpdateAccountInput = {
  /** Solo tarjetas de crédito */
  creditLimit?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDay?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  issuer?: InputMaybe<Scalars['String']['input']>;
  lastFour?: InputMaybe<Scalars['String']['input']>;
  monthlyRate?: InputMaybe<Scalars['Float']['input']>;
  /** Nombre de la cuenta (ej. "Bancolombia", "Efectivo") */
  name?: InputMaybe<Scalars['String']['input']>;
  openingBalance?: InputMaybe<Scalars['Float']['input']>;
  statementDay?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<PaymentMethodType>;
};

export type UpdateArticleInput = {
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** producto / servicio / otro */
  type?: InputMaybe<ArticleType>;
  unit?: InputMaybe<UnitOfMeasure>;
};

export type UpdateCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<TransactionKind>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateExpenseInput = {
  /** Cuenta de la que sale el gasto */
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Requerido si el gasto no tiene ítems; si hay ítems se ignora y se calcula como la suma */
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  /** Artículos comprados (opcional). El importe = suma de sus subtotales. */
  items?: InputMaybe<Array<ExpenseItemInput>>;
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del gasto (YYYY-MM-DD) */
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Recurrence>;
};

export type UpdateIncomeInput = {
  /** Cuenta destino a la que entra el ingreso */
  accountId?: InputMaybe<Scalars['ID']['input']>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del ingreso (YYYY-MM-DD) */
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Recurrence>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isConsumable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  packageSize?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<UnitOfMeasure>;
};

export type UpdateRecurringExpenseInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Importe fijo; requerido si no hay ítems */
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Fecha límite (YYYY-MM-DD) */
  endOn?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  items?: InputMaybe<Array<ExpenseItemInput>>;
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Frecuencia (no puede ser ONCE) */
  recurrence?: InputMaybe<Recurrence>;
  /** Primera ocurrencia (YYYY-MM-DD) */
  startOn?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  authentication?: Maybe<Authentication>;
  avatar?: Maybe<Scalars['String']['output']>;
  baseCurrency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  timezone: Scalars['String']['output'];
};

export type AccountsQueryVariables = Exact<{
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, isActive: boolean, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null }> };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, isActive: boolean } };

export type UpdateAccountMutationVariables = Exact<{
  input: UpdateAccountInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, isActive: boolean, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null } };

export type RemoveAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveAccountMutation = { __typename?: 'Mutation', removeAccount: boolean };

export type ArticlesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ArticleType>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', id: string, name: string, type: ArticleType, brand?: string | null, unit?: UnitOfMeasure | null, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: string, email: string, firstName: string } } };

export type LogoutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, firstName: string, lastName?: string | null, avatar?: string | null, baseCurrency: string, timezone: string } };

export type CategoriesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  kind?: InputMaybe<TransactionKind>;
}>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, icon?: string | null, color?: string | null, kind: TransactionKind, parentId?: string | null, userId?: string | null, isActive: boolean }> };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string, name: string, icon?: string | null, color?: string | null, kind: TransactionKind, parentId?: string | null, userId?: string | null, isActive: boolean } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string, icon?: string | null, color?: string | null, isActive: boolean } };

export type RemoveCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveCategoryMutation = { __typename?: 'Mutation', removeCategory: boolean };

export type ArticleInflationQueryVariables = Exact<{
  filter?: InputMaybe<ArticleInflationFilterInput>;
}>;


export type ArticleInflationQuery = { __typename?: 'Query', articleInflation: { __typename?: 'ArticleInflationReport', latestMonthlyRate?: number | null, latestAnnualRate?: number | null, averageMonthlyRate?: number | null, points: Array<{ __typename?: 'InflationIndexPoint', period: string, monthlyRate?: number | null, annualRate?: number | null, basketSize: number }>, articles: Array<{ __typename?: 'ArticlePriceSeries', articleId: string, name: string, latestMonthlyRate?: number | null, latestAnnualRate?: number | null, points: Array<{ __typename?: 'ArticlePricePoint', period: string, avgUnitPrice: number, quantity: number, monthlyRate?: number | null, annualRate?: number | null }> }>, categories: Array<{ __typename?: 'CategoryPriceSeries', categoryId?: string | null, categoryName?: string | null, latestMonthlyRate?: number | null, latestAnnualRate?: number | null, points: Array<{ __typename?: 'InflationIndexPoint', period: string, monthlyRate?: number | null, annualRate?: number | null }> }> } };

export type ExpenseInflationQueryVariables = Exact<{
  filter?: InputMaybe<InflationFilterInput>;
}>;


export type ExpenseInflationQuery = { __typename?: 'Query', expenseInflation: { __typename?: 'InflationReport', latestMonthlyRate?: number | null, latestAnnualRate?: number | null, averageMonthlyRate?: number | null, points: Array<{ __typename?: 'InflationPoint', period: string, total: number, count: number, monthlyRate?: number | null, annualRate?: number | null }> } };

export type ProductsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Article', id: string, name: string, brand?: string | null, packageSize?: number | null, unit?: UnitOfMeasure | null, barcode?: string | null, isConsumable: boolean, isActive: boolean, inStock: boolean, notes?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type ProductStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductStatsQuery = { __typename?: 'Query', productStats: Array<{ __typename?: 'ProductStatsView', articleId: string, name: string, closedCycles: number, avgDaysLasted?: number | null, minDaysLasted?: number | null, maxDaysLasted?: number | null, avgUnitPrice?: number | null, lastPurchasedOn?: string | null, estimatedDepletionDate?: string | null }> };

export type ProductPurchasesQueryVariables = Exact<{
  articleId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ProductPurchasesQuery = { __typename?: 'Query', productPurchases: Array<{ __typename?: 'ProductPurchase', id: string, purchasedOn: string, quantity: number, unitPrice?: number | null, totalPrice?: number | null, store?: string | null, expenseId?: string | null, article: { __typename?: 'Article', id: string, name: string } }> };

export type ConsumptionCyclesQueryVariables = Exact<{
  articleId: Scalars['ID']['input'];
}>;


export type ConsumptionCyclesQuery = { __typename?: 'Query', consumptionCycles: Array<{ __typename?: 'ConsumptionCycle', id: string, startedOn: string, depletedOn?: string | null, daysLasted?: number | null, quantity: number, purchaseId?: string | null }> };

export type RegisterProductPurchaseMutationVariables = Exact<{
  input: RegisterProductPurchaseInput;
}>;


export type RegisterProductPurchaseMutation = { __typename?: 'Mutation', registerProductPurchase: { __typename?: 'ProductPurchase', id: string, purchasedOn: string, quantity: number, unitPrice?: number | null, totalPrice?: number | null, store?: string | null, article: { __typename?: 'Article', id: string, name: string, inStock: boolean } } };

export type MarkProductDepletedMutationVariables = Exact<{
  articleId: Scalars['ID']['input'];
  depletedOn?: InputMaybe<Scalars['String']['input']>;
}>;


export type MarkProductDepletedMutation = { __typename?: 'Mutation', markProductDepleted: { __typename?: 'Article', id: string, name: string, inStock: boolean } };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Article', id: string, name: string, brand?: string | null, packageSize?: number | null, unit?: UnitOfMeasure | null, barcode?: string | null, isConsumable: boolean, isActive: boolean } };

export type RemoveProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveProductMutation = { __typename?: 'Mutation', removeProduct: boolean };

export type RecurringFieldsFragment = { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> };

export type RecurringExpensesQueryVariables = Exact<{
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type RecurringExpensesQuery = { __typename?: 'Query', recurringExpenses: Array<{ __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> }> };

export type CreateRecurringExpenseMutationVariables = Exact<{
  input: CreateRecurringExpenseInput;
}>;


export type CreateRecurringExpenseMutation = { __typename?: 'Mutation', createRecurringExpense: { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type UpdateRecurringExpenseMutationVariables = Exact<{
  input: UpdateRecurringExpenseInput;
}>;


export type UpdateRecurringExpenseMutation = { __typename?: 'Mutation', updateRecurringExpense: { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type RemoveRecurringExpenseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveRecurringExpenseMutation = { __typename?: 'Mutation', removeRecurringExpense: boolean };

export type RunDueRecurringExpensesMutationVariables = Exact<{ [key: string]: never; }>;


export type RunDueRecurringExpensesMutation = { __typename?: 'Mutation', runDueRecurringExpenses: number };

export type ExpenseFieldsFragment = { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> };

export type IncomeFieldsFragment = { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null };

export type ExpensesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type ExpensesQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> }> };

export type IncomesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type IncomesQuery = { __typename?: 'Query', incomes: Array<{ __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type CreateExpenseMutationVariables = Exact<{
  input: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type CreateIncomeMutationVariables = Exact<{
  input: CreateIncomeInput;
}>;


export type CreateIncomeMutation = { __typename?: 'Mutation', createIncome: { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type UpdateExpenseMutationVariables = Exact<{
  input: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type UpdateIncomeMutationVariables = Exact<{
  input: UpdateIncomeInput;
}>;


export type UpdateIncomeMutation = { __typename?: 'Mutation', updateIncome: { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type RemoveExpenseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveExpenseMutation = { __typename?: 'Mutation', removeExpense: boolean };

export type RemoveIncomeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveIncomeMutation = { __typename?: 'Mutation', removeIncome: boolean };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: string };

export const RecurringFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<RecurringFieldsFragment, unknown>;
export const ExpenseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ExpenseFieldsFragment, unknown>;
export const IncomeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<IncomeFieldsFragment, unknown>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}}]}}]}}]} as unknown as DocumentNode<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const RemoveAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveAccountMutation, RemoveAccountMutationVariables>;
export const ArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Articles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<ArticlesQuery, ArticlesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionKind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const ArticleInflationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArticleInflation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleInflationFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleInflation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}},{"kind":"Field","name":{"kind":"Name","value":"basketSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"articles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"avgUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryName"}},{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArticleInflationQuery, ArticleInflationQueryVariables>;
export const ExpenseInflationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExpenseInflation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InflationFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenseInflation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}}]}}]} as unknown as DocumentNode<ExpenseInflationQuery, ExpenseInflationQueryVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"packageSize"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"isConsumable"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closedCycles"}},{"kind":"Field","name":{"kind":"Name","value":"avgDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"minDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"maxDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"avgUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDepletionDate"}}]}}]}}]} as unknown as DocumentNode<ProductStatsQuery, ProductStatsQueryVariables>;
export const ProductPurchasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductPurchases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productPurchases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"expenseId"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProductPurchasesQuery, ProductPurchasesQueryVariables>;
export const ConsumptionCyclesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConsumptionCycles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumptionCycles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedOn"}},{"kind":"Field","name":{"kind":"Name","value":"depletedOn"}},{"kind":"Field","name":{"kind":"Name","value":"daysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseId"}}]}}]}}]} as unknown as DocumentNode<ConsumptionCyclesQuery, ConsumptionCyclesQueryVariables>;
export const RegisterProductPurchaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterProductPurchase"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterProductPurchaseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerProductPurchase"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterProductPurchaseMutation, RegisterProductPurchaseMutationVariables>;
export const MarkProductDepletedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkProductDepleted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"depletedOn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markProductDepleted"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"depletedOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"depletedOn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}}]}}]}}]} as unknown as DocumentNode<MarkProductDepletedMutation, MarkProductDepletedMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"packageSize"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"isConsumable"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const RemoveProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveProductMutation, RemoveProductMutationVariables>;
export const RecurringExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecurringExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<RecurringExpensesQuery, RecurringExpensesQueryVariables>;
export const CreateRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRecurringExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRecurringExpenseMutation, CreateRecurringExpenseMutationVariables>;
export const UpdateRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRecurringExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRecurringExpenseMutation, UpdateRecurringExpenseMutationVariables>;
export const RemoveRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveRecurringExpenseMutation, RemoveRecurringExpenseMutationVariables>;
export const RunDueRecurringExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunDueRecurringExpenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runDueRecurringExpenses"}}]}}]} as unknown as DocumentNode<RunDueRecurringExpensesMutation, RunDueRecurringExpensesMutationVariables>;
export const ExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Expenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ExpensesQuery, ExpensesQueryVariables>;
export const IncomesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Incomes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<IncomesQuery, IncomesQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const CreateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<CreateIncomeMutation, CreateIncomeMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const UpdateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<UpdateIncomeMutation, UpdateIncomeMutationVariables>;
export const RemoveExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveExpenseMutation, RemoveExpenseMutationVariables>;
export const RemoveIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveIncomeMutation, RemoveIncomeMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;