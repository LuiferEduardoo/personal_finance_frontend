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

export type ConsumptionCycle = {
  __typename?: 'ConsumptionCycle';
  createdAt: Scalars['DateTime']['output'];
  daysLasted?: Maybe<Scalars['Int']['output']>;
  depletedOn?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  productId: Scalars['ID']['output'];
  purchaseId?: Maybe<Scalars['ID']['output']>;
  quantity: Scalars['Float']['output'];
  startedOn: Scalars['String']['output'];
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
  amount: Scalars['Float']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del gasto (YYYY-MM-DD) */
  occurredOn: Scalars['String']['input'];
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Recurrence>;
  userId: Scalars['ID']['input'];
};

export type CreateIncomeInput = {
  amount: Scalars['Float']['input'];
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del ingreso (YYYY-MM-DD) */
  occurredOn: Scalars['String']['input'];
  /** Cuenta destino */
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  recurrence?: InputMaybe<Recurrence>;
  source?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** false = bien durable, sin ciclo de agotamiento */
  isConsumable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  packageSize?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<UnitOfMeasure>;
};

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  exchangeRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  merchant?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occurredOn: Scalars['String']['output'];
  paymentMethodId?: Maybe<Scalars['ID']['output']>;
  receiptUrl?: Maybe<Scalars['String']['output']>;
  recurrence: Recurrence;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type Income = {
  __typename?: 'Income';
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
  paymentMethodId?: Maybe<Scalars['ID']['output']>;
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
  createCategory: Category;
  createExpense: Expense;
  createIncome: Income;
  createProduct: Product;
  login: AuthPayload;
  /** Revoca el refresh token (cierra la sesión) */
  logout: Scalars['Boolean']['output'];
  /** Marca el producto como agotado: cierra el ciclo de consumo y lo agrega a la lista de compras */
  markProductDepleted: Product;
  /** Rota el refresh token y emite un nuevo par de tokens */
  refreshTokens: AuthPayload;
  register: AuthPayload;
  /** Registra una compra. Acepta un producto existente (productId) o crea uno nuevo (newProduct). Abre ciclo de consumo si no hay uno y marca la lista de compras. */
  registerProductPurchase: ProductPurchase;
  removeCategory: Scalars['Boolean']['output'];
  removeExpense: Scalars['Boolean']['output'];
  removeIncome: Scalars['Boolean']['output'];
  removeProduct: Scalars['Boolean']['output'];
  updateCategory: Category;
  updateExpense: Expense;
  updateIncome: Income;
  updateProduct: Product;
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


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationMarkProductDepletedArgs = {
  depletedOn?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
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

export type Product = {
  __typename?: 'Product';
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
  unit: UnitOfMeasure;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ProductPurchase = {
  __typename?: 'ProductPurchase';
  createdAt: Scalars['DateTime']['output'];
  expenseId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  product: Product;
  productId: Scalars['ID']['output'];
  purchasedOn: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  store?: Maybe<Scalars['String']['output']>;
  totalPrice?: Maybe<Scalars['Float']['output']>;
  unitPrice?: Maybe<Scalars['Float']['output']>;
};

export type ProductStatsView = {
  __typename?: 'ProductStatsView';
  avgDaysLasted?: Maybe<Scalars['Float']['output']>;
  avgUnitPrice?: Maybe<Scalars['Float']['output']>;
  closedCycles: Scalars['Int']['output'];
  /** Fecha estimada de agotamiento del ciclo abierto */
  estimatedDepletionDate?: Maybe<Scalars['String']['output']>;
  lastPurchasedOn?: Maybe<Scalars['String']['output']>;
  maxDaysLasted?: Maybe<Scalars['Int']['output']>;
  minDaysLasted?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  productId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Categorías del sistema + las del usuario */
  categories: Array<Category>;
  category: Category;
  /** Ciclos de consumo de un producto */
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
  product: Product;
  /** Historial de compras de productos (opcional por producto) */
  productPurchases: Array<ProductPurchase>;
  /** Estadísticas por producto: duración promedio, costo y fecha estimada de agotamiento */
  productStats: Array<ProductStatsView>;
  /** Catálogo de productos del usuario */
  products: Array<Product>;
};


export type QueryCategoriesArgs = {
  kind?: InputMaybe<TransactionKind>;
  userId: Scalars['ID']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryConsumptionCyclesArgs = {
  productId: Scalars['ID']['input'];
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
  productId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
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

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RegisterProductPurchaseInput = {
  /** Gasto asociado (ej. la ida al supermercado) */
  expenseId?: InputMaybe<Scalars['ID']['input']>;
  /** Crear el producto en el catálogo en la misma compra (si no existe aún) */
  newProduct?: InputMaybe<CreateProductInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Producto existente del catálogo */
  productId?: InputMaybe<Scalars['ID']['input']>;
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
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** Desde (YYYY-MM-DD), inclusive */
  from?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
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
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  merchant?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del gasto (YYYY-MM-DD) */
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<Recurrence>;
};

export type UpdateIncomeInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  exchangeRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Fecha del ingreso (YYYY-MM-DD) */
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  /** Cuenta destino */
  paymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  recurrence?: InputMaybe<Recurrence>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  barcode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** false = bien durable, sin ciclo de agotamiento */
  isConsumable?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  packageSize?: InputMaybe<Scalars['Float']['input']>;
  unit?: InputMaybe<UnitOfMeasure>;
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

export type ExpensesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type ExpensesQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type IncomesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type IncomesQuery = { __typename?: 'Query', incomes: Array<{ __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type CreateExpenseMutationVariables = Exact<{
  input: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type CreateIncomeMutationVariables = Exact<{
  input: CreateIncomeInput;
}>;


export type CreateIncomeMutation = { __typename?: 'Mutation', createIncome: { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type UpdateExpenseMutationVariables = Exact<{
  input: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type UpdateIncomeMutationVariables = Exact<{
  input: UpdateIncomeInput;
}>;


export type UpdateIncomeMutation = { __typename?: 'Mutation', updateIncome: { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

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


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionKind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const ExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Expenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<ExpensesQuery, ExpensesQueryVariables>;
export const IncomesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Incomes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<IncomesQuery, IncomesQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const CreateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<CreateIncomeMutation, CreateIncomeMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const UpdateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateIncomeMutation, UpdateIncomeMutationVariables>;
export const RemoveExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveExpenseMutation, RemoveExpenseMutationVariables>;
export const RemoveIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveIncomeMutation, RemoveIncomeMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;