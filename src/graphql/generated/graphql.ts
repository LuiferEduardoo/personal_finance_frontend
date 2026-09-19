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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  /** Cupo disponible (solo tarjetas de crédito) */
  availableCredit?: Maybe<Scalars['Float']['output']>;
  /** Saldo actual (negativo = deuda en crédito) */
  balance: Scalars['Float']['output'];
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

export type AccountTransfer = {
  __typename?: 'AccountTransfer';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  fromAccount: Account;
  fromAccountId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  occurredOn: Scalars['String']['output'];
  toAccount: Account;
  toAccountId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

/** Eje por el que repartir la cartera */
export type AllocationDimension =
  | 'ASSET_CLASS'
  | 'BROKER'
  | 'COUNTRY'
  | 'CURRENCY'
  | 'INSTRUMENT'
  | 'SECTOR';

/** Reparto de la cartera por un eje */
export type AllocationSlice = {
  __typename?: 'AllocationSlice';
  /** Base de costo en moneda base */
  costBasis: Scalars['Float']['output'];
  /** Clave del grupo (ej. "NASDAQ", "Technology", "US") */
  key: Scalars['String']['output'];
  /** Etiqueta legible del grupo */
  label: Scalars['String']['output'];
  /** Valor de mercado en moneda base */
  marketValue: Scalars['Float']['output'];
  /** Porcentaje sobre el total valorado */
  percentage: Scalars['Float']['output'];
  positionsCount: Scalars['Int']['output'];
};

/** Por qué una rentabilidad anualizada puede venir vacía */
export type AnnualizedStatus =
  | 'NO_BASE'
  | 'OK'
  | 'PERIOD_TOO_SHORT';

export type ApiKey = {
  __typename?: 'ApiKey';
  createdAt: Scalars['DateTime']['output'];
  /** Fecha de expiración */
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** Si la key sigue autenticando (ni revocada ni expirada) */
  isActive: Scalars['Boolean']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Nombre para identificarla (ej. "Dashboard Notion") */
  name: Scalars['String']['output'];
  /** Prefijo público del token (pfk_xxxxxxxxxxxx) */
  prefix: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Permisos concedidos */
  scopes: Array<ApiScope>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ApiKeyCreated = {
  __typename?: 'ApiKeyCreated';
  apiKey: ApiKey;
  /** Token completo. Solo se devuelve aquí: no se puede volver a consultar */
  token: Scalars['String']['output'];
};

/** Permiso que puede otorgarse a una API key */
export type ApiScope =
  | 'ACCOUNTS_READ'
  | 'ACCOUNTS_WRITE'
  | 'ALL'
  | 'ARTICLES_READ'
  | 'ARTICLES_WRITE'
  | 'CATEGORIES_READ'
  | 'CATEGORIES_WRITE'
  | 'EXPENSES_READ'
  | 'EXPENSES_WRITE'
  | 'INCOMES_READ'
  | 'INCOMES_WRITE'
  | 'INFLATION_READ'
  | 'INVENTORY_READ'
  | 'INVENTORY_WRITE'
  | 'INVESTMENTS_READ'
  | 'INVESTMENTS_WRITE'
  | 'INVOICES_WRITE'
  | 'MARKET_DATA_READ'
  | 'PRODUCTS_READ'
  | 'PRODUCTS_WRITE'
  | 'RECURRING_READ'
  | 'RECURRING_WRITE';

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

/** Si la serie del índice incluye dividendos o solo precio */
export type BenchmarkBasis =
  | 'PRICE_ONLY'
  | 'TOTAL_RETURN';

/** Cartera contra índices de referencia */
export type BenchmarkComparison = {
  __typename?: 'BenchmarkComparison';
  baseCurrency: Scalars['String']['output'];
  from: Scalars['String']['output'];
  /** true si las series de los índices se convirtieron a la moneda base del usuario */
  inBaseCurrency: Scalars['Boolean']['output'];
  /** La primera serie es siempre la cartera */
  series: Array<ComparisonSeries>;
  to: Scalars['String']['output'];
  /** Índices pedidos que no se pudieron construir, y por qué */
  warnings: Array<Scalars['String']['output']>;
};

/** Índice de referencia contra el que comparar la cartera */
export type BenchmarkKey =
  | 'MSCI_WORLD'
  | 'NASDAQ100'
  | 'SP500';

export type BrokerConnection = {
  __typename?: 'BrokerConnection';
  /** Se sincroniza sola en el job nocturno */
  autoSync: Scalars['Boolean']['output'];
  broker: BrokerKind;
  createdAt: Scalars['DateTime']['output'];
  /** Versión de clave con la que se cifraron */
  credentialsKeyVersion: Scalars['Int']['output'];
  /** Si la conexión tiene credenciales guardadas */
  hasCredentials: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  /** Cuenta de práctica del bróker */
  isDemo: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  lastError?: Maybe<Scalars['String']['output']>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  status: BrokerConnectionStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

/** Estado de una conexión con un bróker */
export type BrokerConnectionStatus =
  | 'ACTIVE'
  | 'DISABLED'
  | 'ERROR'
  | 'NEEDS_REAUTH';

/** Bróker o exchange de una cuenta de inversión */
export type BrokerKind =
  | 'BINANCE'
  | 'ETORO'
  | 'INTERACTIVE_BROKERS'
  | 'MANUAL'
  | 'XTB';

/** Resultado de sincronizar una conexión */
export type BrokerSyncReport = {
  __typename?: 'BrokerSyncReport';
  connectionId: Scalars['ID']['output'];
  /** Descartadas por ya estar en el libro */
  duplicates: Scalars['Float']['output'];
  errors: Array<Scalars['String']['output']>;
  /** Operaciones traídas del bróker */
  fetched: Scalars['Float']['output'];
  /** Operaciones nuevas insertadas */
  inserted: Scalars['Float']['output'];
  /** true si no se pudo traer todo el periodo */
  partial: Scalars['Boolean']['output'];
  warnings: Array<Scalars['String']['output']>;
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

/** Un punto de una serie normalizada a base 100 */
export type ComparisonPoint = {
  __typename?: 'ComparisonPoint';
  date: Scalars['String']['output'];
  /** Índice normalizado a 100 en la fecha inicial */
  index: Scalars['Float']['output'];
};

/** Una serie de la comparación */
export type ComparisonSeries = {
  __typename?: 'ComparisonSeries';
  annualized?: Maybe<Scalars['Float']['output']>;
  annualizedStatus: AnnualizedStatus;
  /** PRICE_ONLY significa que el índice va sin dividendos y la comparación le es desfavorable */
  basis: BenchmarkBasis;
  /** Diferencia contra la cartera, en puntos porcentuales */
  excessReturn?: Maybe<Scalars['Float']['output']>;
  /** Identificador: "portfolio" o la clave del índice */
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  points: Array<ComparisonPoint>;
  /** Rentabilidad del periodo en % */
  totalReturn?: Maybe<Scalars['Float']['output']>;
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

/** Tipo de acción corporativa */
export type CorporateActionType =
  | 'DIVIDEND'
  | 'SPLIT';

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

export type CreateApiKeyInput = {
  /** Fecha de expiración; sin ella la key no caduca */
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Nombre para identificarla (ej. "Dashboard Notion") */
  name: Scalars['String']['input'];
  /** Permisos concedidos. Usa [ALL] para acceso total o la lista específica */
  scopes: Array<ApiScope>;
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

export type CreateBrokerConnectionInput = {
  autoSync?: InputMaybe<Scalars['Boolean']['input']>;
  broker: BrokerKind;
  /** Credenciales del bróker. Binance: apiKey, apiSecret. eToro: apiKey, userKey. IBKR: token, queryId. XTB: userId, password. */
  credentials: Scalars['JSON']['input'];
  isDemo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Nombre para distinguirla (ej. "Binance principal") */
  label: Scalars['String']['input'];
};

export type CreateCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  kind: TransactionKind;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
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
};

export type CreateInstrumentInput = {
  assetClass?: InputMaybe<InstrumentAssetClass>;
  /** Marca el instrumento como índice de referencia */
  benchmarkKey?: InputMaybe<BenchmarkKey>;
  /** Código ISO 3166-1 alfa-2 */
  country?: InputMaybe<Scalars['String']['input']>;
  /** Moneda en la que cotiza (ISO 4217) */
  currency: Scalars['String']['input'];
  /** Bolsa (ej. "NASDAQ") */
  exchange?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  isin?: InputMaybe<Scalars['String']['input']>;
  micCode?: InputMaybe<Scalars['String']['input']>;
  /** Nombre del instrumento */
  name: Scalars['String']['input'];
  sector?: InputMaybe<Scalars['String']['input']>;
  /** Ticker (ej. "AAPL", "BTC/USD") */
  symbol: Scalars['String']['input'];
  /** Símbolo a usar contra Twelve Data */
  twelveDataSymbol?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvestmentAccountInput = {
  broker?: InputMaybe<BrokerKind>;
  /** Moneda principal de la cuenta (ISO 4217) */
  currency?: InputMaybe<Scalars['String']['input']>;
  /** Cuenta de payment_methods asociada (reservado) */
  linkedPaymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  /** Nombre de la cuenta (ej. "IBKR Individual") */
  name: Scalars['String']['input'];
};

export type CreateInvestmentTransactionInput = {
  accountId: Scalars['ID']['input'];
  /** Importe bruto y positivo. Si se omite en una compra o venta se calcula como cantidad x precio */
  amount?: InputMaybe<Scalars['Float']['input']>;
  /** Solo TRANSFER_OUT: cuenta destino. Los lotes se reabren allí conservando su base */
  counterpartyAccountId?: InputMaybe<Scalars['ID']['input']>;
  /** Moneda de la operación (ISO 4217) */
  currency?: InputMaybe<Scalars['String']['input']>;
  fee?: InputMaybe<Scalars['Float']['input']>;
  /** Tasa de cambio a la moneda base del usuario */
  fxRate?: InputMaybe<Scalars['Float']['input']>;
  /** Obligatorio en BUY, SELL, SPLIT, TRANSFER_IN y TRANSFER_OUT */
  instrumentId?: InputMaybe<Scalars['ID']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  /** Hora exacta; desempata el orden FIFO dentro del mismo día */
  occurredAt?: InputMaybe<Scalars['DateTime']['input']>;
  /** Fecha de la operación (YYYY-MM-DD) */
  occurredOn: Scalars['String']['input'];
  /** Solo para registrar a propósito dos operaciones idénticas el mismo día */
  occurrenceIndex?: InputMaybe<Scalars['Int']['input']>;
  /** Precio unitario */
  price?: InputMaybe<Scalars['Float']['input']>;
  /** Siempre positiva */
  quantity?: InputMaybe<Scalars['Float']['input']>;
  /** Solo CURRENCY_EXCHANGE */
  settlementAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Solo CURRENCY_EXCHANGE */
  settlementCurrency?: InputMaybe<Scalars['String']['input']>;
  /** Solo SPLIT (ej. 1 en un 2:1) */
  splitRatioDenominator?: InputMaybe<Scalars['Int']['input']>;
  /** Solo SPLIT (ej. 2 en un 2:1) */
  splitRatioNumerator?: InputMaybe<Scalars['Int']['input']>;
  tax?: InputMaybe<Scalars['Float']['input']>;
  type: InvestmentTransactionType;
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
  /** Descuento aplicado a la línea */
  discount: Scalars['Float']['output'];
  expenseId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  quantity: Scalars['Float']['output'];
  /** unit_price * quantity - discount */
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type ExpenseItemInput = {
  /** Artículo existente del catálogo */
  articleId?: InputMaybe<Scalars['ID']['input']>;
  /** Etiqueta libre de la línea */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Descuento en importe sobre la línea (unitPrice * quantity) */
  discount?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento en porcentaje (0-100); alternativa a discount */
  discountPercent?: InputMaybe<Scalars['Float']['input']>;
  /** Crear el artículo en la misma línea (si no existe aún) */
  newArticle?: InputMaybe<CreateArticleInput>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  /** Precio unitario del artículo */
  unitPrice: Scalars['Float']['input'];
};

/** Origen de la tasa de cambio guardada en la operación */
export type FxRateSource =
  | 'ASSUMED_ONE'
  | 'BROKER'
  | 'MANUAL'
  | 'TWELVE_DATA';

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

export type Instrument = {
  __typename?: 'Instrument';
  assetClass: InstrumentAssetClass;
  backfillRequestedFrom?: Maybe<Scalars['String']['output']>;
  benchmarkKey?: Maybe<BenchmarkKey>;
  /** Código ISO 3166-1 alfa-2 */
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Moneda en la que cotiza */
  currency: Scalars['String']['output'];
  exchange?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  isin?: Maybe<Scalars['String']['output']>;
  lastPrice?: Maybe<Scalars['Float']['output']>;
  lastPriceOn?: Maybe<Scalars['String']['output']>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  micCode?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  needsDailyPrice: Scalars['Boolean']['output'];
  priceSource: InstrumentPriceSource;
  sector?: Maybe<Scalars['String']['output']>;
  /** Ticker tal como lo usa el usuario (ej. "AAPL") */
  symbol: Scalars['String']['output'];
  twelveDataSymbol?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Tipo de activo del instrumento */
export type InstrumentAssetClass =
  | 'BOND'
  | 'CASH'
  | 'CFD'
  | 'COMMODITY'
  | 'CRYPTO'
  | 'EQUITY'
  | 'ETF'
  | 'FOREX'
  | 'FUND'
  | 'OTHER';

/** De dónde salen los precios del instrumento */
export type InstrumentPriceSource =
  | 'BROKER'
  | 'MANUAL'
  | 'NONE'
  | 'TWELVE_DATA';

export type InvestmentAccount = {
  __typename?: 'InvestmentAccount';
  broker: BrokerKind;
  connectionId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** Moneda principal de la cuenta */
  currency: Scalars['String']['output'];
  externalAccountId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  linkedPaymentMethodId?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type InvestmentCashBalance = {
  __typename?: 'InvestmentCashBalance';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
};

export type InvestmentLot = {
  __typename?: 'InvestmentLot';
  account: InvestmentAccount;
  accountId: Scalars['ID']['output'];
  closedOn?: Maybe<Scalars['String']['output']>;
  costBasisIsEstimated: Scalars['Boolean']['output'];
  /** Costo unitario en la moneda del lote */
  costPerUnit: Scalars['Float']['output'];
  /** Costo unitario en la moneda base del usuario */
  costPerUnitBase: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instrument: Instrument;
  instrumentId: Scalars['ID']['output'];
  openTransactionId?: Maybe<Scalars['ID']['output']>;
  /** Fecha de apertura del lote (YYYY-MM-DD) */
  openedOn: Scalars['String']['output'];
  /** Cantidad que queda sin vender */
  quantityOpen: Scalars['Float']['output'];
  quantityOriginal: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type InvestmentPositionsFilterInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Valorar a esta fecha (YYYY-MM-DD). Por defecto, hoy */
  asOf?: InputMaybe<Scalars['String']['input']>;
  /** Incluye posiciones cerradas (cantidad 0) */
  includeClosed?: InputMaybe<Scalars['Boolean']['input']>;
  instrumentId?: InputMaybe<Scalars['ID']['input']>;
};

export type InvestmentTransaction = {
  __typename?: 'InvestmentTransaction';
  account: InvestmentAccount;
  accountId: Scalars['ID']['output'];
  /** Importe bruto, siempre positivo */
  amount: Scalars['Float']['output'];
  connectionId?: Maybe<Scalars['ID']['output']>;
  counterpartyAccountId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  externalId?: Maybe<Scalars['String']['output']>;
  fee: Scalars['Float']['output'];
  fxRate: Scalars['Float']['output'];
  fxRateSource: FxRateSource;
  id: Scalars['ID']['output'];
  importBatchId?: Maybe<Scalars['ID']['output']>;
  instrument?: Maybe<Instrument>;
  instrumentId?: Maybe<Scalars['ID']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occurredAt?: Maybe<Scalars['DateTime']['output']>;
  /** Fecha de la operación (YYYY-MM-DD) */
  occurredOn: Scalars['String']['output'];
  occurrenceIndex: Scalars['Int']['output'];
  /** Precio unitario */
  price?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Float']['output']>;
  settlementAmount?: Maybe<Scalars['Float']['output']>;
  settlementCurrency?: Maybe<Scalars['String']['output']>;
  splitRatioDenominator?: Maybe<Scalars['Int']['output']>;
  splitRatioNumerator?: Maybe<Scalars['Int']['output']>;
  tax: Scalars['Float']['output'];
  type: InvestmentTransactionType;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

/** Tipo de operación de inversión */
export type InvestmentTransactionType =
  | 'BUY'
  | 'CURRENCY_EXCHANGE'
  | 'DEPOSIT'
  | 'DIVIDEND'
  | 'FEE'
  | 'INTEREST'
  | 'SELL'
  | 'SPLIT'
  | 'TAX'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'WITHDRAWAL';

export type InvestmentTransactionsFilterInput = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
  /** Desde (YYYY-MM-DD), inclusive */
  from?: InputMaybe<Scalars['String']['input']>;
  instrumentId?: InputMaybe<Scalars['ID']['input']>;
  /** Máximo 500 */
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  /** Hasta (YYYY-MM-DD), inclusive */
  to?: InputMaybe<Scalars['String']['input']>;
  types?: InputMaybe<Array<InvestmentTransactionType>>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Registra la operación correspondiente a una acción corporativa que confirmes que te falta */
  applyCorporateAction: InvestmentTransaction;
  createAccount: Account;
  /** Crea una API key. El token completo solo se devuelve en esta respuesta */
  createApiKey: ApiKeyCreated;
  createArticle: Article;
  /** Guarda una conexión. Las credenciales se cifran con AES-256-GCM y no vuelven a salir. */
  createBrokerConnection: BrokerConnection;
  createCategory: Category;
  createExpense: Expense;
  createIncome: Income;
  /** Registra un instrumento nuevo (acción, ETF, cripto, etc.) */
  createInstrument: Instrument;
  createInvestmentAccount: InvestmentAccount;
  /** Registra una operación. Reconstruye lotes y posiciones en la misma transacción. */
  createInvestmentTransaction: InvestmentTransaction;
  createRecurringExpense: RecurringExpense;
  deleteBrokerConnection: Scalars['Boolean']['output'];
  deleteInvestmentAccount: Scalars['Boolean']['output'];
  deleteInvestmentTransaction: Scalars['Boolean']['output'];
  login: AuthPayload;
  /** Revoca el refresh token (cierra la sesión) */
  logout: Scalars['Boolean']['output'];
  /** Marca el artículo como agotado: cierra el ciclo de consumo y lo agrega a la lista de compras */
  markProductDepleted: Article;
  /** Recalcula lotes, posiciones y efectivo desde el libro de operaciones. Válvula manual: el resultado debe coincidir con el camino incremental. */
  rebuildInvestmentPositions: Scalars['Boolean']['output'];
  /** Reconstruye la serie diaria de la cartera sin llamar al proveedor de precios */
  rebuildPortfolioSnapshots: Scalars['String']['output'];
  /** Recalcula el saldo de la cuenta desde sus movimientos */
  recalculateAccountBalance: Account;
  /** Descarga dividendos y splits anunciados de los instrumentos en cartera (2 créditos por instrumento) */
  refreshCorporateActions: Scalars['String']['output'];
  /** Refresca precios y tasas desde Twelve Data y reconstruye los snapshots. Respeta el presupuesto diario: si se agota, para y retoma en el siguiente ciclo. */
  refreshInvestmentPrices: Scalars['String']['output'];
  /** Rota el refresh token y emite un nuevo par de tokens */
  refreshTokens: AuthPayload;
  register: AuthPayload;
  /** Registra una compra. Acepta un artículo existente (articleId) o crea uno nuevo (newArticle). Abre ciclo de consumo si no hay uno y marca la lista de compras. */
  registerProductPurchase: ProductPurchase;
  removeAccount: Scalars['Boolean']['output'];
  /** Borra la key del registro */
  removeApiKey: Scalars['Boolean']['output'];
  removeArticle: Scalars['Boolean']['output'];
  removeCategory: Scalars['Boolean']['output'];
  removeExpense: Scalars['Boolean']['output'];
  removeIncome: Scalars['Boolean']['output'];
  removeProduct: Scalars['Boolean']['output'];
  removeRecurringExpense: Scalars['Boolean']['output'];
  /** Re-resuelve la tasa de cambio de las operaciones que se guardaron con tasa 1 por no existir todavía caché de tasas. Respeta las tasas escritas a mano. Devuelve cuántas se corrigieron. */
  resolveInvestmentFxRates: Scalars['Int']['output'];
  /** Revoca la key: deja de autenticar de inmediato */
  revokeApiKey: ApiKey;
  /** Vuelve a cifrar las credenciales con la clave actual. Rotación sin cortar el servicio: pon la clave vieja en INVESTMENTS_ENCRYPTION_KEY_PREVIOUS y la nueva en INVESTMENTS_ENCRYPTION_KEY. */
  rotateBrokerCredentials: Scalars['Int']['output'];
  /** Genera los gastos recurrentes vencidos (lo hace también un job diario). Devuelve cuántos se crearon. */
  runDueRecurringExpenses: Scalars['Int']['output'];
  /** Fija manualmente el precio de cierre de un instrumento para una fecha */
  setInstrumentPrice: Instrument;
  /** Corrige la base de costo de un lote estimado (típico de un TRANSFER_IN sin precio) */
  setLotCostBasis: InvestmentLot;
  /** Sincroniza todas las conexiones activas */
  syncAllBrokerConnections: Array<BrokerSyncReport>;
  /** Trae las operaciones del bróker. Es idempotente: resincronizar un periodo ya traído no duplica nada. */
  syncBrokerConnection: BrokerSyncReport;
  /** Transfiere saldo entre cuentas. Transferir a una cuenta de crédito paga la tarjeta. */
  transferBetweenAccounts: AccountTransfer;
  updateAccount: Account;
  /** Cambia nombre, scopes o expiración */
  updateApiKey: ApiKey;
  updateArticle: Article;
  updateBrokerConnection: BrokerConnection;
  updateCategory: Category;
  updateExpense: Expense;
  updateIncome: Income;
  updateInstrument: Instrument;
  updateInvestmentAccount: InvestmentAccount;
  updateInvestmentTransaction: InvestmentTransaction;
  updateProduct: Article;
  updateRecurringExpense: RecurringExpense;
  /** Comprueba las credenciales contra el bróker y actualiza el estado de la conexión */
  verifyBrokerConnection: BrokerConnection;
};


export type MutationApplyCorporateActionArgs = {
  accountId: Scalars['ID']['input'];
  actionId: Scalars['ID']['input'];
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateBrokerConnectionArgs = {
  input: CreateBrokerConnectionInput;
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


export type MutationCreateInstrumentArgs = {
  input: CreateInstrumentInput;
};


export type MutationCreateInvestmentAccountArgs = {
  input: CreateInvestmentAccountInput;
};


export type MutationCreateInvestmentTransactionArgs = {
  input: CreateInvestmentTransactionInput;
};


export type MutationCreateRecurringExpenseArgs = {
  input: CreateRecurringExpenseInput;
};


export type MutationDeleteBrokerConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvestmentAccountArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvestmentTransactionArgs = {
  id: Scalars['ID']['input'];
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


export type MutationRebuildInvestmentPositionsArgs = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationRecalculateAccountBalanceArgs = {
  id: Scalars['ID']['input'];
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


export type MutationRemoveApiKeyArgs = {
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


export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetInstrumentPriceArgs = {
  input: SetInstrumentPriceInput;
};


export type MutationSetLotCostBasisArgs = {
  input: SetLotCostBasisInput;
};


export type MutationSyncBrokerConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransferBetweenAccountsArgs = {
  input: TransferInput;
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


export type MutationUpdateApiKeyArgs = {
  input: UpdateApiKeyInput;
};


export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput;
};


export type MutationUpdateBrokerConnectionArgs = {
  input: UpdateBrokerConnectionInput;
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


export type MutationUpdateInstrumentArgs = {
  input: UpdateInstrumentInput;
};


export type MutationUpdateInvestmentAccountArgs = {
  input: UpdateInvestmentAccountInput;
};


export type MutationUpdateInvestmentTransactionArgs = {
  input: UpdateInvestmentTransactionInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateRecurringExpenseArgs = {
  input: UpdateRecurringExpenseInput;
};


export type MutationVerifyBrokerConnectionArgs = {
  id: Scalars['ID']['input'];
};

export type PaymentMethodType =
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'CREDIT'
  | 'DEBIT'
  | 'DIGITAL_WALLET'
  | 'OTHER';

/** Acción corporativa que parece afectarte y que NO tienes registrada */
export type PendingCorporateAction = {
  __typename?: 'PendingCorporateAction';
  /** Cuentas donde tenías el activo en esa fecha */
  accountIds: Array<Scalars['ID']['output']>;
  /** Dividendo por título anunciado */
  amountPerShare?: Maybe<Scalars['Float']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** Importe bruto estimado = títulos x dividendo por título */
  estimatedAmount?: Maybe<Scalars['Float']['output']>;
  /** Fecha ex-dividendo o de efecto del split */
  exDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instrumentId: Scalars['ID']['output'];
  instrumentName: Scalars['String']['output'];
  /** Títulos que tenías en esa fecha, según tu libro */
  quantityHeld?: Maybe<Scalars['Float']['output']>;
  ratioDenominator?: Maybe<Scalars['Int']['output']>;
  ratioNumerator?: Maybe<Scalars['Int']['output']>;
  symbol: Scalars['String']['output'];
  type: CorporateActionType;
};

/** Distribución de la cartera por un eje */
export type PortfolioAllocation = {
  __typename?: 'PortfolioAllocation';
  /** Fecha de valoración */
  asOf: Scalars['String']['output'];
  /** Moneda base del usuario */
  baseCurrency: Scalars['String']['output'];
  /** Posiciones excluidas por no tener precio */
  missingPriceCount: Scalars['Int']['output'];
  slices: Array<AllocationSlice>;
  /** Total valorado; excluye las posiciones sin precio */
  total: Scalars['Float']['output'];
};

/** Evolución histórica del patrimonio invertido */
export type PortfolioEvolution = {
  __typename?: 'PortfolioEvolution';
  baseCurrency: Scalars['String']['output'];
  /** Días cuya valoración usó precios o tasas arrastrados */
  estimatedDays: Scalars['Int']['output'];
  /** true si se escribieron operaciones después de construir esta serie. Ejecuta rebuildPortfolioSnapshots para ponerla al día. */
  isStale: Scalars['Boolean']['output'];
  points: Array<PortfolioEvolutionPoint>;
};

/** Un día de la evolución del patrimonio */
export type PortfolioEvolutionPoint = {
  __typename?: 'PortfolioEvolutionPoint';
  cash: Scalars['Float']['output'];
  /** Capital aportado acumulado */
  contributions: Scalars['Float']['output'];
  costBasis: Scalars['Float']['output'];
  /** Fecha (YYYY-MM-DD) */
  date: Scalars['String']['output'];
  dividends: Scalars['Float']['output'];
  /** true si algún precio o tasa se arrastró */
  isEstimated: Scalars['Boolean']['output'];
  marketValue: Scalars['Float']['output'];
  missingPriceCount: Scalars['Int']['output'];
  /** Flujo externo neto del día */
  netFlow: Scalars['Float']['output'];
  realizedPnl: Scalars['Float']['output'];
  /** Valor total: posiciones más efectivo */
  totalValue: Scalars['Float']['output'];
  /** Índice TWR encadenado, base 100 */
  twrIndex: Scalars['Float']['output'];
  unrealizedPnl: Scalars['Float']['output'];
};

/** Rentabilidad de la cartera por los tres métodos, que responden preguntas distintas */
export type PortfolioReturns = {
  __typename?: 'PortfolioReturns';
  baseCurrency: Scalars['String']['output'];
  dividends: Scalars['Float']['output'];
  /** Valor de la cartera al final del periodo */
  endingValue: Scalars['Float']['output'];
  /** Inicio del periodo (YYYY-MM-DD) */
  from: Scalars['String']['output'];
  /** Capital aportado neto */
  investedCapital: Scalars['Float']['output'];
  /** true si se escribieron operaciones después del último snapshot. Mientras sea true, el TWR y el XIRR van por detrás de portfolioSummary; ejecuta rebuildPortfolioSnapshots. */
  isStale: Scalars['Boolean']['output'];
  realizedPnl: Scalars['Float']['output'];
  /** Rentabilidad simple: (valor actual - capital aportado) / capital aportado */
  simpleReturn?: Maybe<Scalars['Float']['output']>;
  /** Fin del periodo (YYYY-MM-DD) */
  to: Scalars['String']['output'];
  /** TWR del periodo en %. Neutraliza el momento de los aportes: mide cómo lo hicieron las inversiones */
  twr?: Maybe<Scalars['Float']['output']>;
  /** TWR anualizado. null por debajo de 365 días, a propósito */
  twrAnnualized?: Maybe<Scalars['Float']['output']>;
  /** Por qué twrAnnualized es null, si lo es */
  twrAnnualizedStatus: AnnualizedStatus;
  unrealizedPnl: Scalars['Float']['output'];
  /** XIRR / MWR en %. SÍ depende de cuándo metiste el dinero: es tu rentabilidad real */
  xirr?: Maybe<Scalars['Float']['output']>;
  /** Por qué xirr es null, si lo es */
  xirrStatus: XirrStatus;
};

/** Resumen de la cartera a una fecha, en la moneda base del usuario */
export type PortfolioSummary = {
  __typename?: 'PortfolioSummary';
  /** Fecha de valoración (YYYY-MM-DD) */
  asOf: Scalars['String']['output'];
  /** Moneda base del usuario */
  baseCurrency: Scalars['String']['output'];
  /** Efectivo disponible en moneda base */
  cash: Scalars['Float']['output'];
  /** Patrimonio invertido: base de costo de las posiciones abiertas */
  costBasis: Scalars['Float']['output'];
  /** Dividendos recibidos, netos de retención */
  dividends: Scalars['Float']['output'];
  /** Posiciones cuya base de costo es una estimación */
  estimatedBasisPositionsCount: Scalars['Int']['output'];
  /** Comisiones pagadas */
  fees: Scalars['Float']['output'];
  /** Intereses recibidos, netos */
  interest: Scalars['Float']['output'];
  /** Capital aportado: depósitos menos retiros */
  investedCapital: Scalars['Float']['output'];
  /** Valor actual: posiciones a precio de mercado más efectivo */
  marketValue: Scalars['Float']['output'];
  /** Posiciones sin precio: NO se valoran en 0, se excluyen y se cuentan aquí */
  missingPriceCount: Scalars['Int']['output'];
  /** Posiciones abiertas */
  positionsCount: Scalars['Int']['output'];
  /** Precio más antiguo usado en la valoración */
  pricesAsOf?: Maybe<Scalars['String']['output']>;
  /** true si alguna posición se está valorando con un precio anterior a la fecha pedida */
  pricesStale: Scalars['Boolean']['output'];
  /** Ganancia o pérdida REALIZADA acumulada */
  realizedPnl: Scalars['Float']['output'];
  /** Rentabilidad simple en %: (valor actual - capital aportado) / capital aportado. null sin capital aportado */
  simpleReturn?: Maybe<Scalars['Float']['output']>;
  /** Impuestos pagados */
  taxes: Scalars['Float']['output'];
  /** Ganancia o pérdida NO realizada */
  unrealizedPnl: Scalars['Float']['output'];
};

/** Posición viva valorada a precio de mercado */
export type PositionView = {
  __typename?: 'PositionView';
  account: InvestmentAccount;
  /** Costo promedio de los lotes abiertos */
  averageCost: Scalars['Float']['output'];
  /** Base de costo en la moneda del activo */
  costBasis: Scalars['Float']['output'];
  /** Base de costo en la moneda base */
  costBasisBase: Scalars['Float']['output'];
  /** true si la base de costo salió de un precio de mercado o quedó sin resolver */
  costBasisIsEstimated: Scalars['Boolean']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instrument: Instrument;
  /** Último precio conocido. null si no hay precio disponible */
  lastPrice?: Maybe<Scalars['Float']['output']>;
  lastPriceOn?: Maybe<Scalars['String']['output']>;
  /** Valor de mercado en moneda base. null sin precio */
  marketValueBase?: Maybe<Scalars['Float']['output']>;
  /** true si no hay ningún precio para valorar la posición */
  priceMissing: Scalars['Boolean']['output'];
  quantity: Scalars['Float']['output'];
  realizedPnlToDateBase: Scalars['Float']['output'];
  unrealizedPnlBase?: Maybe<Scalars['Float']['output']>;
  /** Rentabilidad no realizada en % */
  unrealizedReturn?: Maybe<Scalars['Float']['output']>;
};

export type ProductPurchase = {
  __typename?: 'ProductPurchase';
  article: Article;
  articleId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** Descuento aplicado a la compra */
  discount: Scalars['Float']['output'];
  expenseId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  purchasedOn: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  store?: Maybe<Scalars['String']['output']>;
  /** unit_price * quantity - discount (lo realmente pagado) */
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
  /** Transferencias entre cuentas (opcional por cuenta) */
  accountTransfers: Array<AccountTransfer>;
  /** Cuentas del usuario (efectivo, banco, tarjeta, etc.) */
  accounts: Array<Account>;
  apiKey: ApiKey;
  /** API keys del usuario */
  apiKeys: Array<ApiKey>;
  article: Article;
  /** Inflación real (índice de precios) por artículo y categoría. NO es expenseInflation (variación de gasto). */
  articleInflation: ArticleInflationReport;
  /** Catálogo de artículos del usuario (productos, servicios, etc.) */
  articles: Array<Article>;
  /** Compara la curva TWR de la cartera contra S&P 500, Nasdaq-100 o MSCI World */
  benchmarkComparison: BenchmarkComparison;
  brokerConnection: BrokerConnection;
  /** Conexiones con brókers. Las credenciales NUNCA se devuelven: solo hasCredentials. */
  brokerConnections: Array<BrokerConnection>;
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
  instrument: Instrument;
  /** Busca instrumentos por ticker o nombre */
  instrumentSearch: Array<Instrument>;
  investmentAccount: InvestmentAccount;
  /** Cuentas de inversión del usuario */
  investmentAccounts: Array<InvestmentAccount>;
  /** Saldos de efectivo por moneda */
  investmentCashBalances: Array<InvestmentCashBalance>;
  /** Posiciones abiertas valoradas a precio de mercado */
  investmentPositions: Array<PositionView>;
  investmentTransaction: InvestmentTransaction;
  /** Operaciones de inversión. Paginado: el histórico de un bróker pasa fácil de 20 000 filas. */
  investmentTransactions: Array<InvestmentTransaction>;
  /** Total de operaciones que cumplen el filtro */
  investmentTransactionsCount: Scalars['Int']['output'];
  /** Usuario autenticado (requiere Bearer) */
  me: User;
  /** Dividendos y splits anunciados que te afectaban y NO tienes en el libro. Es una sugerencia: nada se registra solo. */
  pendingCorporateActions: Array<PendingCorporateAction>;
  /** Distribución de la cartera por bróker, activo, sector, país, moneda o tipo de activo */
  portfolioAllocation: PortfolioAllocation;
  /** Evolución histórica del patrimonio, día a día, con el índice TWR encadenado */
  portfolioEvolution: PortfolioEvolution;
  /** Rentabilidad simple, TWR (anualizado) y XIRR/MWR. Responden preguntas distintas. */
  portfolioReturns: PortfolioReturns;
  /** Resumen de la cartera: patrimonio invertido, valor actual, capital aportado y P&L */
  portfolioSummary: PortfolioSummary;
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


export type QueryAccountTransfersArgs = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAccountsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryApiKeyArgs = {
  id: Scalars['ID']['input'];
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


export type QueryBenchmarkComparisonArgs = {
  benchmarks: Array<BenchmarkKey>;
  from?: InputMaybe<Scalars['String']['input']>;
  inBaseCurrency?: InputMaybe<Scalars['Boolean']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBrokerConnectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoriesArgs = {
  kind?: InputMaybe<TransactionKind>;
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
};


export type QueryIncomeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryIncomesArgs = {
  filter?: InputMaybe<TransactionsFilterInput>;
};


export type QueryInstrumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInstrumentSearchArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryInvestmentAccountArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvestmentAccountsArgs = {
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryInvestmentCashBalancesArgs = {
  accountId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryInvestmentPositionsArgs = {
  filter?: InputMaybe<InvestmentPositionsFilterInput>;
};


export type QueryInvestmentTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvestmentTransactionsArgs = {
  filter?: InputMaybe<InvestmentTransactionsFilterInput>;
};


export type QueryInvestmentTransactionsCountArgs = {
  filter?: InputMaybe<InvestmentTransactionsFilterInput>;
};


export type QueryPortfolioAllocationArgs = {
  asOf?: InputMaybe<Scalars['String']['input']>;
  dimension: AllocationDimension;
};


export type QueryPortfolioEvolutionArgs = {
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPortfolioReturnsArgs = {
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPortfolioSummaryArgs = {
  asOf?: InputMaybe<Scalars['String']['input']>;
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
  /** Descuento aplicado a la línea */
  discount: Scalars['Float']['output'];
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
  /** Descuento en importe sobre la línea (unitPrice * quantity) */
  discount?: InputMaybe<Scalars['Float']['input']>;
  /** Descuento en porcentaje (0-100); alternativa a discount */
  discountPercent?: InputMaybe<Scalars['Float']['input']>;
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

export type SetInstrumentPriceInput = {
  /** Precio de cierre */
  close: Scalars['Float']['input'];
  instrumentId: Scalars['ID']['input'];
  /** Fecha del precio (YYYY-MM-DD). Por defecto hoy */
  priceOn?: InputMaybe<Scalars['String']['input']>;
};

export type SetLotCostBasisInput = {
  /** Costo unitario real del lote */
  costPerUnit: Scalars['Float']['input'];
  lotId: Scalars['ID']['input'];
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

export type TransferInput = {
  amount: Scalars['Float']['input'];
  /** Cuenta origen */
  fromAccountId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  /** Fecha (YYYY-MM-DD), por defecto hoy */
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  /** Cuenta destino (si es de crédito, se paga la tarjeta) */
  toAccountId: Scalars['ID']['input'];
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

export type UpdateApiKeyInput = {
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  /** Reemplaza los permisos concedidos */
  scopes?: InputMaybe<Array<ApiScope>>;
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

export type UpdateBrokerConnectionInput = {
  autoSync?: InputMaybe<Scalars['Boolean']['input']>;
  /** Solo si quieres reemplazarlas */
  credentials?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  isDemo?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateInstrumentInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  industry?: InputMaybe<Scalars['String']['input']>;
  isin?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sector?: InputMaybe<Scalars['String']['input']>;
  twelveDataSymbol?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvestmentAccountInput = {
  broker?: InputMaybe<BrokerKind>;
  /** Moneda principal de la cuenta (ISO 4217) */
  currency?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  /** Cuenta de payment_methods asociada (reservado) */
  linkedPaymentMethodId?: InputMaybe<Scalars['ID']['input']>;
  /** Nombre de la cuenta (ej. "IBKR Individual") */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvestmentTransactionInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  fee?: InputMaybe<Scalars['Float']['input']>;
  fxRate?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  occurredAt?: InputMaybe<Scalars['DateTime']['input']>;
  occurredOn?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Float']['input']>;
  splitRatioDenominator?: InputMaybe<Scalars['Int']['input']>;
  splitRatioNumerator?: InputMaybe<Scalars['Int']['input']>;
  tax?: InputMaybe<Scalars['Float']['input']>;
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

/** Resultado del cálculo de XIRR */
export type XirrStatus =
  | 'DID_NOT_CONVERGE'
  | 'NOT_ENOUGH_FLOWS'
  | 'NO_SIGN_CHANGE'
  | 'OK';

export type AccountFieldsFragment = { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean };

export type AccountsQueryVariables = Exact<{
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean }> };

export type AccountQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AccountQuery = { __typename?: 'Query', account: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean } };

export type AccountTransfersQueryVariables = Exact<{
  accountId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AccountTransfersQuery = { __typename?: 'Query', accountTransfers: Array<{ __typename?: 'AccountTransfer', id: string, amount: number, occurredOn: string, note?: string | null, fromAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType }, toAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType } }> };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean } };

export type UpdateAccountMutationVariables = Exact<{
  input: UpdateAccountInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean } };

export type RemoveAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveAccountMutation = { __typename?: 'Mutation', removeAccount: boolean };

export type TransferMutationVariables = Exact<{
  input: TransferInput;
}>;


export type TransferMutation = { __typename?: 'Mutation', transferBetweenAccounts: { __typename?: 'AccountTransfer', id: string, amount: number, occurredOn: string, note?: string | null, fromAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean }, toAccount: { __typename?: 'Account', id: string, name: string, type: PaymentMethodType, currency: string, openingBalance: number, balance: number, availableCredit?: number | null, creditLimit?: number | null, statementDay?: number | null, dueDay?: number | null, monthlyRate?: number | null, issuer?: string | null, lastFour?: string | null, isActive: boolean } } };

export type RecalculateAccountBalanceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RecalculateAccountBalanceMutation = { __typename?: 'Mutation', recalculateAccountBalance: { __typename?: 'Account', id: string, balance: number } };

export type ApiKeysQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiKeysQuery = { __typename?: 'Query', apiKeys: Array<{ __typename?: 'ApiKey', id: string, name: string, prefix: string, scopes: Array<ApiScope>, expiresAt?: string | null, lastUsedAt?: string | null, revokedAt?: string | null, isActive: boolean, createdAt: string, updatedAt: string }> };

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { __typename?: 'Mutation', createApiKey: { __typename?: 'ApiKeyCreated', token: string, apiKey: { __typename?: 'ApiKey', id: string, name: string, prefix: string, scopes: Array<ApiScope>, expiresAt?: string | null, lastUsedAt?: string | null, revokedAt?: string | null, isActive: boolean, createdAt: string, updatedAt: string } } };

export type UpdateApiKeyMutationVariables = Exact<{
  input: UpdateApiKeyInput;
}>;


export type UpdateApiKeyMutation = { __typename?: 'Mutation', updateApiKey: { __typename?: 'ApiKey', id: string, name: string, prefix: string, scopes: Array<ApiScope>, expiresAt?: string | null, lastUsedAt?: string | null, revokedAt?: string | null, isActive: boolean, createdAt: string, updatedAt: string } };

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeApiKeyMutation = { __typename?: 'Mutation', revokeApiKey: { __typename?: 'ApiKey', id: string, revokedAt?: string | null, isActive: boolean, updatedAt: string } };

export type RemoveApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveApiKeyMutation = { __typename?: 'Mutation', removeApiKey: boolean };

export type ArticlesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ArticleType>;
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', id: string, name: string, type: ArticleType, brand?: string | null, unit?: UnitOfMeasure | null, packageSize?: number | null, barcode?: string | null, isConsumable: boolean, inStock: boolean, isActive: boolean, notes?: string | null, categoryId?: string | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: { __typename?: 'Article', id: string, name: string, type: ArticleType, brand?: string | null, unit?: UnitOfMeasure | null, isActive: boolean } };

export type UpdateArticleMutationVariables = Exact<{
  input: UpdateArticleInput;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle: { __typename?: 'Article', id: string, name: string, type: ArticleType, brand?: string | null, unit?: UnitOfMeasure | null, isActive: boolean, notes?: string | null, categoryId?: string | null } };

export type RemoveArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveArticleMutation = { __typename?: 'Mutation', removeArticle: boolean };

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

export type InvestmentOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type InvestmentOverviewQuery = { __typename?: 'Query', portfolioSummary: { __typename?: 'PortfolioSummary', asOf: string, baseCurrency: string, marketValue: number, investedCapital: number, costBasis: number, cash: number, unrealizedPnl: number, realizedPnl: number, simpleReturn?: number | null, dividends: number, interest: number, fees: number, taxes: number, positionsCount: number, missingPriceCount: number, estimatedBasisPositionsCount: number, pricesAsOf?: string | null, pricesStale: boolean }, portfolioEvolution: { __typename?: 'PortfolioEvolution', baseCurrency: string, estimatedDays: number, isStale: boolean, points: Array<{ __typename?: 'PortfolioEvolutionPoint', date: string, totalValue: number, marketValue: number, cash: number, contributions: number, netFlow: number, unrealizedPnl: number, realizedPnl: number, dividends: number, twrIndex: number, isEstimated: boolean, missingPriceCount: number }> }, investmentPositions: Array<{ __typename?: 'PositionView', id: string, quantity: number, averageCost: number, costBasisBase: number, marketValueBase?: number | null, unrealizedPnlBase?: number | null, unrealizedReturn?: number | null, realizedPnlToDateBase: number, costBasisIsEstimated: boolean, priceMissing: boolean, lastPrice?: number | null, lastPriceOn?: string | null, currency: string, account: { __typename?: 'InvestmentAccount', id: string, name: string, broker: BrokerKind, currency: string }, instrument: { __typename?: 'Instrument', id: string, symbol: string, name: string, assetClass: InstrumentAssetClass, currency: string, sector?: string | null, country?: string | null, lastPrice?: number | null, lastPriceOn?: string | null } }>, pendingCorporateActions: Array<{ __typename?: 'PendingCorporateAction', id: string, type: CorporateActionType, instrumentId: string, symbol: string, instrumentName: string, exDate: string, amountPerShare?: number | null, quantityHeld?: number | null, estimatedAmount?: number | null, ratioNumerator?: number | null, ratioDenominator?: number | null, currency?: string | null, description?: string | null, accountIds: Array<string> }> };

export type InvestmentReturnsQueryVariables = Exact<{
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
}>;


export type InvestmentReturnsQuery = { __typename?: 'Query', portfolioReturns: { __typename?: 'PortfolioReturns', from: string, to: string, baseCurrency: string, investedCapital: number, endingValue: number, simpleReturn?: number | null, twr?: number | null, twrAnnualized?: number | null, twrAnnualizedStatus: AnnualizedStatus, xirr?: number | null, xirrStatus: XirrStatus, unrealizedPnl: number, realizedPnl: number, dividends: number, isStale: boolean } };

export type InvestmentAllocationQueryVariables = Exact<{
  dimension: AllocationDimension;
}>;


export type InvestmentAllocationQuery = { __typename?: 'Query', portfolioAllocation: { __typename?: 'PortfolioAllocation', asOf: string, baseCurrency: string, total: number, missingPriceCount: number, slices: Array<{ __typename?: 'AllocationSlice', key: string, label: string, marketValue: number, costBasis: number, percentage: number, positionsCount: number }> } };

export type InvestmentBenchmarksQueryVariables = Exact<{
  benchmarks: Array<BenchmarkKey> | BenchmarkKey;
  from?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
}>;


export type InvestmentBenchmarksQuery = { __typename?: 'Query', benchmarkComparison: { __typename?: 'BenchmarkComparison', baseCurrency: string, from: string, to: string, inBaseCurrency: boolean, warnings: Array<string>, series: Array<{ __typename?: 'ComparisonSeries', key: string, label: string, totalReturn?: number | null, annualized?: number | null, annualizedStatus: AnnualizedStatus, excessReturn?: number | null, basis: BenchmarkBasis, points: Array<{ __typename?: 'ComparisonPoint', date: string, index: number }> }> } };

export type InvestmentAccountsQueryVariables = Exact<{
  includeInactive: Scalars['Boolean']['input'];
}>;


export type InvestmentAccountsQuery = { __typename?: 'Query', investmentAccounts: Array<{ __typename?: 'InvestmentAccount', id: string, name: string, broker: BrokerKind, currency: string, isActive: boolean, connectionId?: string | null, externalAccountId?: string | null, linkedPaymentMethodId?: string | null, createdAt: string, updatedAt: string }>, investmentCashBalances: Array<{ __typename?: 'InvestmentCashBalance', currency: string, amount: number }> };

export type InvestmentTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<InvestmentTransactionsFilterInput>;
}>;


export type InvestmentTransactionsQuery = { __typename?: 'Query', investmentTransactionsCount: number, investmentTransactions: Array<{ __typename?: 'InvestmentTransaction', id: string, accountId: string, type: InvestmentTransactionType, instrumentId?: string | null, occurredOn: string, occurredAt?: string | null, quantity?: number | null, price?: number | null, amount: number, fee: number, tax: number, currency: string, fxRate: number, fxRateSource: FxRateSource, settlementCurrency?: string | null, settlementAmount?: number | null, splitRatioNumerator?: number | null, splitRatioDenominator?: number | null, counterpartyAccountId?: string | null, externalId?: string | null, notes?: string | null, occurrenceIndex: number, createdAt: string, updatedAt: string, account: { __typename?: 'InvestmentAccount', id: string, name: string }, instrument?: { __typename?: 'Instrument', id: string, symbol: string, name: string, assetClass: InstrumentAssetClass } | null }> };

export type InvestmentInstrumentSearchQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type InvestmentInstrumentSearchQuery = { __typename?: 'Query', instrumentSearch: Array<{ __typename?: 'Instrument', id: string, symbol: string, name: string, exchange?: string | null, assetClass: InstrumentAssetClass, currency: string, sector?: string | null, industry?: string | null, country?: string | null, isin?: string | null, twelveDataSymbol?: string | null, priceSource: InstrumentPriceSource, lastPrice?: number | null, lastPriceOn?: string | null }> };

export type BrokerConnectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type BrokerConnectionsQuery = { __typename?: 'Query', brokerConnections: Array<{ __typename?: 'BrokerConnection', id: string, broker: BrokerKind, label: string, isDemo: boolean, autoSync: boolean, hasCredentials: boolean, status: BrokerConnectionStatus, lastError?: string | null, lastSyncedAt?: string | null, createdAt: string, updatedAt: string }> };

export type CreateInvestmentAccountMutationVariables = Exact<{
  input: CreateInvestmentAccountInput;
}>;


export type CreateInvestmentAccountMutation = { __typename?: 'Mutation', createInvestmentAccount: { __typename?: 'InvestmentAccount', id: string } };

export type UpdateInvestmentAccountMutationVariables = Exact<{
  input: UpdateInvestmentAccountInput;
}>;


export type UpdateInvestmentAccountMutation = { __typename?: 'Mutation', updateInvestmentAccount: { __typename?: 'InvestmentAccount', id: string } };

export type DeleteInvestmentAccountMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInvestmentAccountMutation = { __typename?: 'Mutation', deleteInvestmentAccount: boolean };

export type RebuildInvestmentPositionsMutationVariables = Exact<{
  accountId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RebuildInvestmentPositionsMutation = { __typename?: 'Mutation', rebuildInvestmentPositions: boolean };

export type CreateInvestmentTransactionMutationVariables = Exact<{
  input: CreateInvestmentTransactionInput;
}>;


export type CreateInvestmentTransactionMutation = { __typename?: 'Mutation', createInvestmentTransaction: { __typename?: 'InvestmentTransaction', id: string } };

export type UpdateInvestmentTransactionMutationVariables = Exact<{
  input: UpdateInvestmentTransactionInput;
}>;


export type UpdateInvestmentTransactionMutation = { __typename?: 'Mutation', updateInvestmentTransaction: { __typename?: 'InvestmentTransaction', id: string } };

export type DeleteInvestmentTransactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteInvestmentTransactionMutation = { __typename?: 'Mutation', deleteInvestmentTransaction: boolean };

export type ResolveInvestmentFxRatesMutationVariables = Exact<{ [key: string]: never; }>;


export type ResolveInvestmentFxRatesMutation = { __typename?: 'Mutation', resolveInvestmentFxRates: number };

export type RefreshInvestmentPricesMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshInvestmentPricesMutation = { __typename?: 'Mutation', refreshInvestmentPrices: string };

export type RebuildPortfolioSnapshotsMutationVariables = Exact<{ [key: string]: never; }>;


export type RebuildPortfolioSnapshotsMutation = { __typename?: 'Mutation', rebuildPortfolioSnapshots: string };

export type RefreshCorporateActionsMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshCorporateActionsMutation = { __typename?: 'Mutation', refreshCorporateActions: string };

export type ApplyCorporateActionMutationVariables = Exact<{
  actionId: Scalars['ID']['input'];
  accountId: Scalars['ID']['input'];
}>;


export type ApplyCorporateActionMutation = { __typename?: 'Mutation', applyCorporateAction: { __typename?: 'InvestmentTransaction', id: string } };

export type CreateInstrumentMutationVariables = Exact<{
  input: CreateInstrumentInput;
}>;


export type CreateInstrumentMutation = { __typename?: 'Mutation', createInstrument: { __typename?: 'Instrument', id: string, symbol: string, name: string } };

export type UpdateInstrumentMutationVariables = Exact<{
  input: UpdateInstrumentInput;
}>;


export type UpdateInstrumentMutation = { __typename?: 'Mutation', updateInstrument: { __typename?: 'Instrument', id: string } };

export type SetInstrumentPriceMutationVariables = Exact<{
  input: SetInstrumentPriceInput;
}>;


export type SetInstrumentPriceMutation = { __typename?: 'Mutation', setInstrumentPrice: { __typename?: 'Instrument', id: string, lastPrice?: number | null, lastPriceOn?: string | null } };

export type CreateBrokerConnectionMutationVariables = Exact<{
  input: CreateBrokerConnectionInput;
}>;


export type CreateBrokerConnectionMutation = { __typename?: 'Mutation', createBrokerConnection: { __typename?: 'BrokerConnection', id: string } };

export type UpdateBrokerConnectionMutationVariables = Exact<{
  input: UpdateBrokerConnectionInput;
}>;


export type UpdateBrokerConnectionMutation = { __typename?: 'Mutation', updateBrokerConnection: { __typename?: 'BrokerConnection', id: string } };

export type DeleteBrokerConnectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBrokerConnectionMutation = { __typename?: 'Mutation', deleteBrokerConnection: boolean };

export type VerifyBrokerConnectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VerifyBrokerConnectionMutation = { __typename?: 'Mutation', verifyBrokerConnection: { __typename?: 'BrokerConnection', id: string, status: BrokerConnectionStatus, lastError?: string | null } };

export type SyncBrokerConnectionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SyncBrokerConnectionMutation = { __typename?: 'Mutation', syncBrokerConnection: { __typename?: 'BrokerSyncReport', connectionId: string, fetched: number, inserted: number, duplicates: number, errors: Array<string>, warnings: Array<string>, partial: boolean } };

export type SyncAllBrokerConnectionsMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncAllBrokerConnectionsMutation = { __typename?: 'Mutation', syncAllBrokerConnections: Array<{ __typename?: 'BrokerSyncReport', connectionId: string, fetched: number, inserted: number, duplicates: number, errors: Array<string>, warnings: Array<string>, partial: boolean }> };

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

export type RecurringFieldsFragment = { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> };

export type RecurringExpensesQueryVariables = Exact<{
  includeInactive?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type RecurringExpensesQuery = { __typename?: 'Query', recurringExpenses: Array<{ __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> }> };

export type CreateRecurringExpenseMutationVariables = Exact<{
  input: CreateRecurringExpenseInput;
}>;


export type CreateRecurringExpenseMutation = { __typename?: 'Mutation', createRecurringExpense: { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type UpdateRecurringExpenseMutationVariables = Exact<{
  input: UpdateRecurringExpenseInput;
}>;


export type UpdateRecurringExpenseMutation = { __typename?: 'Mutation', updateRecurringExpense: { __typename?: 'RecurringExpense', id: string, description: string, amount?: number | null, currency: string, recurrence: Recurrence, startOn: string, endOn?: string | null, nextRunOn: string, isActive: boolean, merchant?: string | null, notes?: string | null, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'RecurringExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type RemoveRecurringExpenseMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveRecurringExpenseMutation = { __typename?: 'Mutation', removeRecurringExpense: boolean };

export type RunDueRecurringExpensesMutationVariables = Exact<{ [key: string]: never; }>;


export type RunDueRecurringExpensesMutation = { __typename?: 'Mutation', runDueRecurringExpenses: number };

export type ExpenseFieldsFragment = { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> };

export type IncomeFieldsFragment = { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null };

export type ExpensesQueryVariables = Exact<{
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type ExpensesQuery = { __typename?: 'Query', expenses: Array<{ __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> }> };

export type IncomesQueryVariables = Exact<{
  filter?: InputMaybe<TransactionsFilterInput>;
}>;


export type IncomesQuery = { __typename?: 'Query', incomes: Array<{ __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null }> };

export type CreateExpenseMutationVariables = Exact<{
  input: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

export type CreateIncomeMutationVariables = Exact<{
  input: CreateIncomeInput;
}>;


export type CreateIncomeMutation = { __typename?: 'Mutation', createIncome: { __typename?: 'Income', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, source?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null } };

export type UpdateExpenseMutationVariables = Exact<{
  input: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, description: string, amount: number, currency: string, exchangeRate: number, occurredOn: string, merchant?: string | null, notes?: string | null, recurrence: Recurrence, accountId?: string | null, categoryId?: string | null, account?: { __typename?: 'Account', id: string, name: string } | null, category?: { __typename?: 'Category', id: string, name: string, icon?: string | null } | null, items: Array<{ __typename?: 'ExpenseItem', id: string, articleId?: string | null, description?: string | null, unitPrice: number, quantity: number, discount: number, subtotal: number, article?: { __typename?: 'Article', id: string, name: string, type: ArticleType } | null }> } };

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

export const AccountFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<AccountFieldsFragment, unknown>;
export const RecurringFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<RecurringFieldsFragment, unknown>;
export const ExpenseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ExpenseFieldsFragment, unknown>;
export const IncomeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<IncomeFieldsFragment, unknown>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const AccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Account"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"account"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<AccountQuery, AccountQueryVariables>;
export const AccountTransfersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountTransfers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountTransfers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"fromAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<AccountTransfersQuery, AccountTransfersQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const RemoveAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveAccountMutation, RemoveAccountMutationVariables>;
export const TransferDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Transfer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferBetweenAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"fromAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"toAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccountFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccountFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Account"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"openingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"availableCredit"}},{"kind":"Field","name":{"kind":"Name","value":"creditLimit"}},{"kind":"Field","name":{"kind":"Name","value":"statementDay"}},{"kind":"Field","name":{"kind":"Name","value":"dueDay"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"issuer"}},{"kind":"Field","name":{"kind":"Name","value":"lastFour"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<TransferMutation, TransferMutationVariables>;
export const RecalculateAccountBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecalculateAccountBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recalculateAccountBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]} as unknown as DocumentNode<RecalculateAccountBalanceMutation, RecalculateAccountBalanceMutationVariables>;
export const ApiKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ApiKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apiKeys"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ApiKeysQuery, ApiKeysQueryVariables>;
export const CreateApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateApiKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"apiKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const UpdateApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateApiKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastUsedAt"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateApiKeyMutation, UpdateApiKeyMutationVariables>;
export const RevokeApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"revokedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>;
export const RemoveApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveApiKeyMutation, RemoveApiKeyMutationVariables>;
export const ArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Articles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"packageSize"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"isConsumable"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<ArticlesQuery, ArticlesQueryVariables>;
export const CreateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArticleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateArticleMutation, CreateArticleMutationVariables>;
export const UpdateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateArticleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}}]}}]}}]} as unknown as DocumentNode<UpdateArticleMutation, UpdateArticleMutationVariables>;
export const RemoveArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveArticleMutation, RemoveArticleMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Categories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionKind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const RemoveCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveCategoryMutation, RemoveCategoryMutationVariables>;
export const ArticleInflationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ArticleInflation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleInflationFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleInflation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}},{"kind":"Field","name":{"kind":"Name","value":"basketSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"articles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"avgUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryName"}},{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ArticleInflationQuery, ArticleInflationQueryVariables>;
export const ExpenseInflationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExpenseInflation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InflationFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenseInflation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"latestAnnualRate"}},{"kind":"Field","name":{"kind":"Name","value":"averageMonthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"monthlyRate"}},{"kind":"Field","name":{"kind":"Name","value":"annualRate"}}]}}]}}]}}]} as unknown as DocumentNode<ExpenseInflationQuery, ExpenseInflationQueryVariables>;
export const InvestmentOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"investedCapital"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"realizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"simpleReturn"}},{"kind":"Field","name":{"kind":"Name","value":"dividends"}},{"kind":"Field","name":{"kind":"Name","value":"interest"}},{"kind":"Field","name":{"kind":"Name","value":"fees"}},{"kind":"Field","name":{"kind":"Name","value":"taxes"}},{"kind":"Field","name":{"kind":"Name","value":"positionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"missingPriceCount"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBasisPositionsCount"}},{"kind":"Field","name":{"kind":"Name","value":"pricesAsOf"}},{"kind":"Field","name":{"kind":"Name","value":"pricesStale"}}]}},{"kind":"Field","name":{"kind":"Name","value":"portfolioEvolution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDays"}},{"kind":"Field","name":{"kind":"Name","value":"isStale"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"totalValue"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"cash"}},{"kind":"Field","name":{"kind":"Name","value":"contributions"}},{"kind":"Field","name":{"kind":"Name","value":"netFlow"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"realizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"dividends"}},{"kind":"Field","name":{"kind":"Name","value":"twrIndex"}},{"kind":"Field","name":{"kind":"Name","value":"isEstimated"}},{"kind":"Field","name":{"kind":"Name","value":"missingPriceCount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"investmentPositions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"averageCost"}},{"kind":"Field","name":{"kind":"Name","value":"costBasisBase"}},{"kind":"Field","name":{"kind":"Name","value":"marketValueBase"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPnlBase"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedReturn"}},{"kind":"Field","name":{"kind":"Name","value":"realizedPnlToDateBase"}},{"kind":"Field","name":{"kind":"Name","value":"costBasisIsEstimated"}},{"kind":"Field","name":{"kind":"Name","value":"priceMissing"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPriceOn"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"broker"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instrument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assetClass"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"sector"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPriceOn"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pendingCorporateActions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentId"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentName"}},{"kind":"Field","name":{"kind":"Name","value":"exDate"}},{"kind":"Field","name":{"kind":"Name","value":"amountPerShare"}},{"kind":"Field","name":{"kind":"Name","value":"quantityHeld"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"ratioNumerator"}},{"kind":"Field","name":{"kind":"Name","value":"ratioDenominator"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"accountIds"}}]}}]}}]} as unknown as DocumentNode<InvestmentOverviewQuery, InvestmentOverviewQueryVariables>;
export const InvestmentReturnsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentReturns"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioReturns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"investedCapital"}},{"kind":"Field","name":{"kind":"Name","value":"endingValue"}},{"kind":"Field","name":{"kind":"Name","value":"simpleReturn"}},{"kind":"Field","name":{"kind":"Name","value":"twr"}},{"kind":"Field","name":{"kind":"Name","value":"twrAnnualized"}},{"kind":"Field","name":{"kind":"Name","value":"twrAnnualizedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"xirr"}},{"kind":"Field","name":{"kind":"Name","value":"xirrStatus"}},{"kind":"Field","name":{"kind":"Name","value":"unrealizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"realizedPnl"}},{"kind":"Field","name":{"kind":"Name","value":"dividends"}},{"kind":"Field","name":{"kind":"Name","value":"isStale"}}]}}]}}]} as unknown as DocumentNode<InvestmentReturnsQuery, InvestmentReturnsQueryVariables>;
export const InvestmentAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dimension"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AllocationDimension"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"portfolioAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dimension"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dimension"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asOf"}},{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"missingPriceCount"}},{"kind":"Field","name":{"kind":"Name","value":"slices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"marketValue"}},{"kind":"Field","name":{"kind":"Name","value":"costBasis"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}},{"kind":"Field","name":{"kind":"Name","value":"positionsCount"}}]}}]}}]}}]} as unknown as DocumentNode<InvestmentAllocationQuery, InvestmentAllocationQueryVariables>;
export const InvestmentBenchmarksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentBenchmarks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"benchmarks"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BenchmarkKey"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"benchmarkComparison"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"benchmarks"},"value":{"kind":"Variable","name":{"kind":"Name","value":"benchmarks"}}},{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"baseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"inBaseCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"totalReturn"}},{"kind":"Field","name":{"kind":"Name","value":"annualized"}},{"kind":"Field","name":{"kind":"Name","value":"annualizedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"excessReturn"}},{"kind":"Field","name":{"kind":"Name","value":"basis"}},{"kind":"Field","name":{"kind":"Name","value":"points"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"index"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InvestmentBenchmarksQuery, InvestmentBenchmarksQueryVariables>;
export const InvestmentAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentAccounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"investmentAccounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"broker"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"connectionId"}},{"kind":"Field","name":{"kind":"Name","value":"externalAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"linkedPaymentMethodId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"investmentCashBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode<InvestmentAccountsQuery, InvestmentAccountsQueryVariables>;
export const InvestmentTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InvestmentTransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"investmentTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"instrumentId"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"fee"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"fxRate"}},{"kind":"Field","name":{"kind":"Name","value":"fxRateSource"}},{"kind":"Field","name":{"kind":"Name","value":"settlementCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"settlementAmount"}},{"kind":"Field","name":{"kind":"Name","value":"splitRatioNumerator"}},{"kind":"Field","name":{"kind":"Name","value":"splitRatioDenominator"}},{"kind":"Field","name":{"kind":"Name","value":"counterpartyAccountId"}},{"kind":"Field","name":{"kind":"Name","value":"externalId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceIndex"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"instrument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assetClass"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"investmentTransactionsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]}]}}]} as unknown as DocumentNode<InvestmentTransactionsQuery, InvestmentTransactionsQueryVariables>;
export const InvestmentInstrumentSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InvestmentInstrumentSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"instrumentSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchange"}},{"kind":"Field","name":{"kind":"Name","value":"assetClass"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"sector"}},{"kind":"Field","name":{"kind":"Name","value":"industry"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"isin"}},{"kind":"Field","name":{"kind":"Name","value":"twelveDataSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"priceSource"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPriceOn"}}]}}]}}]} as unknown as DocumentNode<InvestmentInstrumentSearchQuery, InvestmentInstrumentSearchQueryVariables>;
export const BrokerConnectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BrokerConnections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"brokerConnections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"broker"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"isDemo"}},{"kind":"Field","name":{"kind":"Name","value":"autoSync"}},{"kind":"Field","name":{"kind":"Name","value":"hasCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastError"}},{"kind":"Field","name":{"kind":"Name","value":"lastSyncedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<BrokerConnectionsQuery, BrokerConnectionsQueryVariables>;
export const CreateInvestmentAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvestmentAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInvestmentAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvestmentAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateInvestmentAccountMutation, CreateInvestmentAccountMutationVariables>;
export const UpdateInvestmentAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInvestmentAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInvestmentAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInvestmentAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateInvestmentAccountMutation, UpdateInvestmentAccountMutationVariables>;
export const DeleteInvestmentAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvestmentAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInvestmentAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteInvestmentAccountMutation, DeleteInvestmentAccountMutationVariables>;
export const RebuildInvestmentPositionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RebuildInvestmentPositions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rebuildInvestmentPositions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}]}}]} as unknown as DocumentNode<RebuildInvestmentPositionsMutation, RebuildInvestmentPositionsMutationVariables>;
export const CreateInvestmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvestmentTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInvestmentTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvestmentTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateInvestmentTransactionMutation, CreateInvestmentTransactionMutationVariables>;
export const UpdateInvestmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInvestmentTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInvestmentTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInvestmentTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateInvestmentTransactionMutation, UpdateInvestmentTransactionMutationVariables>;
export const DeleteInvestmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInvestmentTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInvestmentTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteInvestmentTransactionMutation, DeleteInvestmentTransactionMutationVariables>;
export const ResolveInvestmentFxRatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveInvestmentFxRates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveInvestmentFxRates"}}]}}]} as unknown as DocumentNode<ResolveInvestmentFxRatesMutation, ResolveInvestmentFxRatesMutationVariables>;
export const RefreshInvestmentPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshInvestmentPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshInvestmentPrices"}}]}}]} as unknown as DocumentNode<RefreshInvestmentPricesMutation, RefreshInvestmentPricesMutationVariables>;
export const RebuildPortfolioSnapshotsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RebuildPortfolioSnapshots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rebuildPortfolioSnapshots"}}]}}]} as unknown as DocumentNode<RebuildPortfolioSnapshotsMutation, RebuildPortfolioSnapshotsMutationVariables>;
export const RefreshCorporateActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshCorporateActions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshCorporateActions"}}]}}]} as unknown as DocumentNode<RefreshCorporateActionsMutation, RefreshCorporateActionsMutationVariables>;
export const ApplyCorporateActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyCorporateAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyCorporateAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ApplyCorporateActionMutation, ApplyCorporateActionMutationVariables>;
export const CreateInstrumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInstrument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInstrumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInstrument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateInstrumentMutation, CreateInstrumentMutationVariables>;
export const UpdateInstrumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInstrument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInstrumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInstrument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateInstrumentMutation, UpdateInstrumentMutationVariables>;
export const SetInstrumentPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetInstrumentPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetInstrumentPriceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setInstrumentPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPriceOn"}}]}}]}}]} as unknown as DocumentNode<SetInstrumentPriceMutation, SetInstrumentPriceMutationVariables>;
export const CreateBrokerConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBrokerConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBrokerConnectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBrokerConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateBrokerConnectionMutation, CreateBrokerConnectionMutationVariables>;
export const UpdateBrokerConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBrokerConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBrokerConnectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBrokerConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateBrokerConnectionMutation, UpdateBrokerConnectionMutationVariables>;
export const DeleteBrokerConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBrokerConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBrokerConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteBrokerConnectionMutation, DeleteBrokerConnectionMutationVariables>;
export const VerifyBrokerConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyBrokerConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyBrokerConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastError"}}]}}]}}]} as unknown as DocumentNode<VerifyBrokerConnectionMutation, VerifyBrokerConnectionMutationVariables>;
export const SyncBrokerConnectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncBrokerConnection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncBrokerConnection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectionId"}},{"kind":"Field","name":{"kind":"Name","value":"fetched"}},{"kind":"Field","name":{"kind":"Name","value":"inserted"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"}},{"kind":"Field","name":{"kind":"Name","value":"partial"}}]}}]}}]} as unknown as DocumentNode<SyncBrokerConnectionMutation, SyncBrokerConnectionMutationVariables>;
export const SyncAllBrokerConnectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncAllBrokerConnections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncAllBrokerConnections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectionId"}},{"kind":"Field","name":{"kind":"Name","value":"fetched"}},{"kind":"Field","name":{"kind":"Name","value":"inserted"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"warnings"}},{"kind":"Field","name":{"kind":"Name","value":"partial"}}]}}]}}]} as unknown as DocumentNode<SyncAllBrokerConnectionsMutation, SyncAllBrokerConnectionsMutationVariables>;
export const ProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Products"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"packageSize"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"isConsumable"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]}}]} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"closedCycles"}},{"kind":"Field","name":{"kind":"Name","value":"avgDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"minDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"maxDaysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"avgUnitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDepletionDate"}}]}}]}}]} as unknown as DocumentNode<ProductStatsQuery, ProductStatsQueryVariables>;
export const ProductPurchasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductPurchases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productPurchases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"expenseId"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProductPurchasesQuery, ProductPurchasesQueryVariables>;
export const ConsumptionCyclesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConsumptionCycles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"consumptionCycles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedOn"}},{"kind":"Field","name":{"kind":"Name","value":"depletedOn"}},{"kind":"Field","name":{"kind":"Name","value":"daysLasted"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseId"}}]}}]}}]} as unknown as DocumentNode<ConsumptionCyclesQuery, ConsumptionCyclesQueryVariables>;
export const RegisterProductPurchaseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterProductPurchase"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterProductPurchaseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerProductPurchase"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"purchasedOn"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"store"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterProductPurchaseMutation, RegisterProductPurchaseMutationVariables>;
export const MarkProductDepletedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkProductDepleted"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"depletedOn"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markProductDepleted"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"articleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"depletedOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"depletedOn"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"inStock"}}]}}]}}]} as unknown as DocumentNode<MarkProductDepletedMutation, MarkProductDepletedMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"brand"}},{"kind":"Field","name":{"kind":"Name","value":"packageSize"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"barcode"}},{"kind":"Field","name":{"kind":"Name","value":"isConsumable"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const RemoveProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveProductMutation, RemoveProductMutationVariables>;
export const RecurringExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecurringExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recurringExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInactive"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeInactive"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<RecurringExpensesQuery, RecurringExpensesQueryVariables>;
export const CreateRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRecurringExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CreateRecurringExpenseMutation, CreateRecurringExpenseMutationVariables>;
export const UpdateRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRecurringExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RecurringFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RecurringFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RecurringExpense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"startOn"}},{"kind":"Field","name":{"kind":"Name","value":"endOn"}},{"kind":"Field","name":{"kind":"Name","value":"nextRunOn"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRecurringExpenseMutation, UpdateRecurringExpenseMutationVariables>;
export const RemoveRecurringExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveRecurringExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRecurringExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveRecurringExpenseMutation, RemoveRecurringExpenseMutationVariables>;
export const RunDueRecurringExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunDueRecurringExpenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runDueRecurringExpenses"}}]}}]} as unknown as DocumentNode<RunDueRecurringExpensesMutation, RunDueRecurringExpensesMutationVariables>;
export const ExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Expenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<ExpensesQuery, ExpensesQueryVariables>;
export const IncomesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Incomes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionsFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"incomes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<IncomesQuery, IncomesQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const CreateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<CreateIncomeMutation, CreateIncomeMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Expense"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"merchant"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"articleId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"article"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const UpdateIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIncomeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IncomeFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IncomeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Income"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeRate"}},{"kind":"Field","name":{"kind":"Name","value":"occurredOn"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"}},{"kind":"Field","name":{"kind":"Name","value":"accountId"}},{"kind":"Field","name":{"kind":"Name","value":"account"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<UpdateIncomeMutation, UpdateIncomeMutationVariables>;
export const RemoveExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveExpenseMutation, RemoveExpenseMutationVariables>;
export const RemoveIncomeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveIncome"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeIncome"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RemoveIncomeMutation, RemoveIncomeMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;