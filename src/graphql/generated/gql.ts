/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment AccountFields on Account {\n    id\n    name\n    type\n    currency\n    openingBalance\n    balance\n    availableCredit\n    creditLimit\n    statementDay\n    dueDay\n    monthlyRate\n    issuer\n    lastFour\n    isActive\n  }\n": typeof types.AccountFieldsFragmentDoc,
    "\n  query Accounts($includeInactive: Boolean) {\n    accounts(includeInactive: $includeInactive) {\n      ...AccountFields\n    }\n  }\n": typeof types.AccountsDocument,
    "\n  query Account($id: ID!) {\n    account(id: $id) {\n      ...AccountFields\n    }\n  }\n": typeof types.AccountDocument,
    "\n  query AccountTransfers($accountId: ID) {\n    accountTransfers(accountId: $accountId) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        id\n        name\n        type\n      }\n      toAccount {\n        id\n        name\n        type\n      }\n    }\n  }\n": typeof types.AccountTransfersDocument,
    "\n  mutation CreateAccount($input: CreateAccountInput!) {\n    createAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n": typeof types.CreateAccountDocument,
    "\n  mutation UpdateAccount($input: UpdateAccountInput!) {\n    updateAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n": typeof types.UpdateAccountDocument,
    "\n  mutation RemoveAccount($id: ID!) {\n    removeAccount(id: $id)\n  }\n": typeof types.RemoveAccountDocument,
    "\n  mutation Transfer($input: TransferInput!) {\n    transferBetweenAccounts(input: $input) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        ...AccountFields\n      }\n      toAccount {\n        ...AccountFields\n      }\n    }\n  }\n": typeof types.TransferDocument,
    "\n  mutation RecalculateAccountBalance($id: ID!) {\n    recalculateAccountBalance(id: $id) {\n      id\n      balance\n    }\n  }\n": typeof types.RecalculateAccountBalanceDocument,
    "\n  query ApiKeys {\n    apiKeys {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.ApiKeysDocument,
    "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      token\n      apiKey {\n        id\n        name\n        prefix\n        scopes\n        expiresAt\n        lastUsedAt\n        revokedAt\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": typeof types.CreateApiKeyDocument,
    "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateApiKeyDocument,
    "\n  mutation RevokeApiKey($id: ID!) {\n    revokeApiKey(id: $id) {\n      id\n      revokedAt\n      isActive\n      updatedAt\n    }\n  }\n": typeof types.RevokeApiKeyDocument,
    "\n  mutation RemoveApiKey($id: ID!) {\n    removeApiKey(id: $id)\n  }\n": typeof types.RemoveApiKeyDocument,
    "\n  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {\n    articles(search: $search, type: $type, includeInactive: $includeInactive) {\n      id\n      name\n      type\n      brand\n      unit\n      packageSize\n      barcode\n      isConsumable\n      inStock\n      isActive\n      notes\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.ArticlesDocument,
    "\n  mutation CreateArticle($input: CreateArticleInput!) {\n    createArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n    }\n  }\n": typeof types.CreateArticleDocument,
    "\n  mutation UpdateArticle($input: UpdateArticleInput!) {\n    updateArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n      notes\n      categoryId\n    }\n  }\n": typeof types.UpdateArticleDocument,
    "\n  mutation RemoveArticle($id: ID!) {\n    removeArticle(id: $id)\n  }\n": typeof types.RemoveArticleDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Categories($kind: TransactionKind) {\n    categories(kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n": typeof types.RemoveCategoryDocument,
    "\n  query ArticleInflation($filter: ArticleInflationFilterInput) {\n    articleInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        monthlyRate\n        annualRate\n        basketSize\n      }\n      articles {\n        articleId\n        name\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          avgUnitPrice\n          quantity\n          monthlyRate\n          annualRate\n        }\n      }\n      categories {\n        categoryId\n        categoryName\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          monthlyRate\n          annualRate\n        }\n      }\n    }\n  }\n": typeof types.ArticleInflationDocument,
    "\n  query ExpenseInflation($filter: InflationFilterInput) {\n    expenseInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        total\n        count\n        monthlyRate\n        annualRate\n      }\n    }\n  }\n": typeof types.ExpenseInflationDocument,
    "\n  query Products($search: String, $includeInactive: Boolean) {\n    products(search: $search, includeInactive: $includeInactive) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n      inStock\n      notes\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.ProductsDocument,
    "\n  query ProductStats {\n    productStats {\n      articleId\n      name\n      closedCycles\n      avgDaysLasted\n      minDaysLasted\n      maxDaysLasted\n      avgUnitPrice\n      lastPurchasedOn\n      estimatedDepletionDate\n    }\n  }\n": typeof types.ProductStatsDocument,
    "\n  query ProductPurchases($articleId: ID) {\n    productPurchases(articleId: $articleId) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      expenseId\n      article {\n        id\n        name\n      }\n    }\n  }\n": typeof types.ProductPurchasesDocument,
    "\n  query ConsumptionCycles($articleId: ID!) {\n    consumptionCycles(articleId: $articleId) {\n      id\n      startedOn\n      depletedOn\n      daysLasted\n      quantity\n      purchaseId\n    }\n  }\n": typeof types.ConsumptionCyclesDocument,
    "\n  mutation RegisterProductPurchase($input: RegisterProductPurchaseInput!) {\n    registerProductPurchase(input: $input) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      article {\n        id\n        name\n        inStock\n      }\n    }\n  }\n": typeof types.RegisterProductPurchaseDocument,
    "\n  mutation MarkProductDepleted($articleId: ID!, $depletedOn: String) {\n    markProductDepleted(articleId: $articleId, depletedOn: $depletedOn) {\n      id\n      name\n      inStock\n    }\n  }\n": typeof types.MarkProductDepletedDocument,
    "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n    }\n  }\n": typeof types.UpdateProductDocument,
    "\n  mutation RemoveProduct($id: ID!) {\n    removeProduct(id: $id)\n  }\n": typeof types.RemoveProductDocument,
    "\n  fragment RecurringFields on RecurringExpense {\n    id\n    description\n    amount\n    currency\n    recurrence\n    startOn\n    endOn\n    nextRunOn\n    isActive\n    merchant\n    notes\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n": typeof types.RecurringFieldsFragmentDoc,
    "\n  query RecurringExpenses($includeInactive: Boolean) {\n    recurringExpenses(includeInactive: $includeInactive) {\n      ...RecurringFields\n    }\n  }\n": typeof types.RecurringExpensesDocument,
    "\n  mutation CreateRecurringExpense($input: CreateRecurringExpenseInput!) {\n    createRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n": typeof types.CreateRecurringExpenseDocument,
    "\n  mutation UpdateRecurringExpense($input: UpdateRecurringExpenseInput!) {\n    updateRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n": typeof types.UpdateRecurringExpenseDocument,
    "\n  mutation RemoveRecurringExpense($id: ID!) {\n    removeRecurringExpense(id: $id)\n  }\n": typeof types.RemoveRecurringExpenseDocument,
    "\n  mutation RunDueRecurringExpenses {\n    runDueRecurringExpenses\n  }\n": typeof types.RunDueRecurringExpensesDocument,
    "\n  fragment ExpenseFields on Expense {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    merchant\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      subtotal\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n": typeof types.ExpenseFieldsFragmentDoc,
    "\n  fragment IncomeFields on Income {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    source\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n  }\n": typeof types.IncomeFieldsFragmentDoc,
    "\n  query Expenses($filter: TransactionsFilterInput) {\n    expenses(filter: $filter) {\n      ...ExpenseFields\n    }\n  }\n": typeof types.ExpensesDocument,
    "\n  query Incomes($filter: TransactionsFilterInput) {\n    incomes(filter: $filter) {\n      ...IncomeFields\n    }\n  }\n": typeof types.IncomesDocument,
    "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n": typeof types.CreateExpenseDocument,
    "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n": typeof types.CreateIncomeDocument,
    "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n": typeof types.UpdateExpenseDocument,
    "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n": typeof types.UpdateIncomeDocument,
    "\n  mutation RemoveExpense($id: ID!) {\n    removeExpense(id: $id)\n  }\n": typeof types.RemoveExpenseDocument,
    "\n  mutation RemoveIncome($id: ID!) {\n    removeIncome(id: $id)\n  }\n": typeof types.RemoveIncomeDocument,
    "\n  query Health {\n    health\n  }\n": typeof types.HealthDocument,
};
const documents: Documents = {
    "\n  fragment AccountFields on Account {\n    id\n    name\n    type\n    currency\n    openingBalance\n    balance\n    availableCredit\n    creditLimit\n    statementDay\n    dueDay\n    monthlyRate\n    issuer\n    lastFour\n    isActive\n  }\n": types.AccountFieldsFragmentDoc,
    "\n  query Accounts($includeInactive: Boolean) {\n    accounts(includeInactive: $includeInactive) {\n      ...AccountFields\n    }\n  }\n": types.AccountsDocument,
    "\n  query Account($id: ID!) {\n    account(id: $id) {\n      ...AccountFields\n    }\n  }\n": types.AccountDocument,
    "\n  query AccountTransfers($accountId: ID) {\n    accountTransfers(accountId: $accountId) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        id\n        name\n        type\n      }\n      toAccount {\n        id\n        name\n        type\n      }\n    }\n  }\n": types.AccountTransfersDocument,
    "\n  mutation CreateAccount($input: CreateAccountInput!) {\n    createAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation UpdateAccount($input: UpdateAccountInput!) {\n    updateAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n": types.UpdateAccountDocument,
    "\n  mutation RemoveAccount($id: ID!) {\n    removeAccount(id: $id)\n  }\n": types.RemoveAccountDocument,
    "\n  mutation Transfer($input: TransferInput!) {\n    transferBetweenAccounts(input: $input) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        ...AccountFields\n      }\n      toAccount {\n        ...AccountFields\n      }\n    }\n  }\n": types.TransferDocument,
    "\n  mutation RecalculateAccountBalance($id: ID!) {\n    recalculateAccountBalance(id: $id) {\n      id\n      balance\n    }\n  }\n": types.RecalculateAccountBalanceDocument,
    "\n  query ApiKeys {\n    apiKeys {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n": types.ApiKeysDocument,
    "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      token\n      apiKey {\n        id\n        name\n        prefix\n        scopes\n        expiresAt\n        lastUsedAt\n        revokedAt\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n": types.CreateApiKeyDocument,
    "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateApiKeyDocument,
    "\n  mutation RevokeApiKey($id: ID!) {\n    revokeApiKey(id: $id) {\n      id\n      revokedAt\n      isActive\n      updatedAt\n    }\n  }\n": types.RevokeApiKeyDocument,
    "\n  mutation RemoveApiKey($id: ID!) {\n    removeApiKey(id: $id)\n  }\n": types.RemoveApiKeyDocument,
    "\n  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {\n    articles(search: $search, type: $type, includeInactive: $includeInactive) {\n      id\n      name\n      type\n      brand\n      unit\n      packageSize\n      barcode\n      isConsumable\n      inStock\n      isActive\n      notes\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.ArticlesDocument,
    "\n  mutation CreateArticle($input: CreateArticleInput!) {\n    createArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n    }\n  }\n": types.CreateArticleDocument,
    "\n  mutation UpdateArticle($input: UpdateArticleInput!) {\n    updateArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n      notes\n      categoryId\n    }\n  }\n": types.UpdateArticleDocument,
    "\n  mutation RemoveArticle($id: ID!) {\n    removeArticle(id: $id)\n  }\n": types.RemoveArticleDocument,
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n": types.MeDocument,
    "\n  query Categories($kind: TransactionKind) {\n    categories(kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n": types.RemoveCategoryDocument,
    "\n  query ArticleInflation($filter: ArticleInflationFilterInput) {\n    articleInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        monthlyRate\n        annualRate\n        basketSize\n      }\n      articles {\n        articleId\n        name\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          avgUnitPrice\n          quantity\n          monthlyRate\n          annualRate\n        }\n      }\n      categories {\n        categoryId\n        categoryName\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          monthlyRate\n          annualRate\n        }\n      }\n    }\n  }\n": types.ArticleInflationDocument,
    "\n  query ExpenseInflation($filter: InflationFilterInput) {\n    expenseInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        total\n        count\n        monthlyRate\n        annualRate\n      }\n    }\n  }\n": types.ExpenseInflationDocument,
    "\n  query Products($search: String, $includeInactive: Boolean) {\n    products(search: $search, includeInactive: $includeInactive) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n      inStock\n      notes\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.ProductsDocument,
    "\n  query ProductStats {\n    productStats {\n      articleId\n      name\n      closedCycles\n      avgDaysLasted\n      minDaysLasted\n      maxDaysLasted\n      avgUnitPrice\n      lastPurchasedOn\n      estimatedDepletionDate\n    }\n  }\n": types.ProductStatsDocument,
    "\n  query ProductPurchases($articleId: ID) {\n    productPurchases(articleId: $articleId) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      expenseId\n      article {\n        id\n        name\n      }\n    }\n  }\n": types.ProductPurchasesDocument,
    "\n  query ConsumptionCycles($articleId: ID!) {\n    consumptionCycles(articleId: $articleId) {\n      id\n      startedOn\n      depletedOn\n      daysLasted\n      quantity\n      purchaseId\n    }\n  }\n": types.ConsumptionCyclesDocument,
    "\n  mutation RegisterProductPurchase($input: RegisterProductPurchaseInput!) {\n    registerProductPurchase(input: $input) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      article {\n        id\n        name\n        inStock\n      }\n    }\n  }\n": types.RegisterProductPurchaseDocument,
    "\n  mutation MarkProductDepleted($articleId: ID!, $depletedOn: String) {\n    markProductDepleted(articleId: $articleId, depletedOn: $depletedOn) {\n      id\n      name\n      inStock\n    }\n  }\n": types.MarkProductDepletedDocument,
    "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n    }\n  }\n": types.UpdateProductDocument,
    "\n  mutation RemoveProduct($id: ID!) {\n    removeProduct(id: $id)\n  }\n": types.RemoveProductDocument,
    "\n  fragment RecurringFields on RecurringExpense {\n    id\n    description\n    amount\n    currency\n    recurrence\n    startOn\n    endOn\n    nextRunOn\n    isActive\n    merchant\n    notes\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n": types.RecurringFieldsFragmentDoc,
    "\n  query RecurringExpenses($includeInactive: Boolean) {\n    recurringExpenses(includeInactive: $includeInactive) {\n      ...RecurringFields\n    }\n  }\n": types.RecurringExpensesDocument,
    "\n  mutation CreateRecurringExpense($input: CreateRecurringExpenseInput!) {\n    createRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n": types.CreateRecurringExpenseDocument,
    "\n  mutation UpdateRecurringExpense($input: UpdateRecurringExpenseInput!) {\n    updateRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n": types.UpdateRecurringExpenseDocument,
    "\n  mutation RemoveRecurringExpense($id: ID!) {\n    removeRecurringExpense(id: $id)\n  }\n": types.RemoveRecurringExpenseDocument,
    "\n  mutation RunDueRecurringExpenses {\n    runDueRecurringExpenses\n  }\n": types.RunDueRecurringExpensesDocument,
    "\n  fragment ExpenseFields on Expense {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    merchant\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      subtotal\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n": types.ExpenseFieldsFragmentDoc,
    "\n  fragment IncomeFields on Income {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    source\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n  }\n": types.IncomeFieldsFragmentDoc,
    "\n  query Expenses($filter: TransactionsFilterInput) {\n    expenses(filter: $filter) {\n      ...ExpenseFields\n    }\n  }\n": types.ExpensesDocument,
    "\n  query Incomes($filter: TransactionsFilterInput) {\n    incomes(filter: $filter) {\n      ...IncomeFields\n    }\n  }\n": types.IncomesDocument,
    "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n": types.CreateExpenseDocument,
    "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n": types.CreateIncomeDocument,
    "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n": types.UpdateExpenseDocument,
    "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n": types.UpdateIncomeDocument,
    "\n  mutation RemoveExpense($id: ID!) {\n    removeExpense(id: $id)\n  }\n": types.RemoveExpenseDocument,
    "\n  mutation RemoveIncome($id: ID!) {\n    removeIncome(id: $id)\n  }\n": types.RemoveIncomeDocument,
    "\n  query Health {\n    health\n  }\n": types.HealthDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AccountFields on Account {\n    id\n    name\n    type\n    currency\n    openingBalance\n    balance\n    availableCredit\n    creditLimit\n    statementDay\n    dueDay\n    monthlyRate\n    issuer\n    lastFour\n    isActive\n  }\n"): (typeof documents)["\n  fragment AccountFields on Account {\n    id\n    name\n    type\n    currency\n    openingBalance\n    balance\n    availableCredit\n    creditLimit\n    statementDay\n    dueDay\n    monthlyRate\n    issuer\n    lastFour\n    isActive\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Accounts($includeInactive: Boolean) {\n    accounts(includeInactive: $includeInactive) {\n      ...AccountFields\n    }\n  }\n"): (typeof documents)["\n  query Accounts($includeInactive: Boolean) {\n    accounts(includeInactive: $includeInactive) {\n      ...AccountFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Account($id: ID!) {\n    account(id: $id) {\n      ...AccountFields\n    }\n  }\n"): (typeof documents)["\n  query Account($id: ID!) {\n    account(id: $id) {\n      ...AccountFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AccountTransfers($accountId: ID) {\n    accountTransfers(accountId: $accountId) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        id\n        name\n        type\n      }\n      toAccount {\n        id\n        name\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  query AccountTransfers($accountId: ID) {\n    accountTransfers(accountId: $accountId) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        id\n        name\n        type\n      }\n      toAccount {\n        id\n        name\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAccount($input: CreateAccountInput!) {\n    createAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAccount($input: CreateAccountInput!) {\n    createAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateAccount($input: UpdateAccountInput!) {\n    updateAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAccount($input: UpdateAccountInput!) {\n    updateAccount(input: $input) {\n      ...AccountFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveAccount($id: ID!) {\n    removeAccount(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveAccount($id: ID!) {\n    removeAccount(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Transfer($input: TransferInput!) {\n    transferBetweenAccounts(input: $input) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        ...AccountFields\n      }\n      toAccount {\n        ...AccountFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Transfer($input: TransferInput!) {\n    transferBetweenAccounts(input: $input) {\n      id\n      amount\n      occurredOn\n      note\n      fromAccount {\n        ...AccountFields\n      }\n      toAccount {\n        ...AccountFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RecalculateAccountBalance($id: ID!) {\n    recalculateAccountBalance(id: $id) {\n      id\n      balance\n    }\n  }\n"): (typeof documents)["\n  mutation RecalculateAccountBalance($id: ID!) {\n    recalculateAccountBalance(id: $id) {\n      id\n      balance\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ApiKeys {\n    apiKeys {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query ApiKeys {\n    apiKeys {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      token\n      apiKey {\n        id\n        name\n        prefix\n        scopes\n        expiresAt\n        lastUsedAt\n        revokedAt\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateApiKey($input: CreateApiKeyInput!) {\n    createApiKey(input: $input) {\n      token\n      apiKey {\n        id\n        name\n        prefix\n        scopes\n        expiresAt\n        lastUsedAt\n        revokedAt\n        isActive\n        createdAt\n        updatedAt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateApiKey($input: UpdateApiKeyInput!) {\n    updateApiKey(input: $input) {\n      id\n      name\n      prefix\n      scopes\n      expiresAt\n      lastUsedAt\n      revokedAt\n      isActive\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RevokeApiKey($id: ID!) {\n    revokeApiKey(id: $id) {\n      id\n      revokedAt\n      isActive\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation RevokeApiKey($id: ID!) {\n    revokeApiKey(id: $id) {\n      id\n      revokedAt\n      isActive\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveApiKey($id: ID!) {\n    removeApiKey(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveApiKey($id: ID!) {\n    removeApiKey(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {\n    articles(search: $search, type: $type, includeInactive: $includeInactive) {\n      id\n      name\n      type\n      brand\n      unit\n      packageSize\n      barcode\n      isConsumable\n      inStock\n      isActive\n      notes\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  query Articles($search: String, $type: ArticleType, $includeInactive: Boolean) {\n    articles(search: $search, type: $type, includeInactive: $includeInactive) {\n      id\n      name\n      type\n      brand\n      unit\n      packageSize\n      barcode\n      isConsumable\n      inStock\n      isActive\n      notes\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateArticle($input: CreateArticleInput!) {\n    createArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation CreateArticle($input: CreateArticleInput!) {\n    createArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateArticle($input: UpdateArticleInput!) {\n    updateArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n      notes\n      categoryId\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateArticle($input: UpdateArticleInput!) {\n    updateArticle(input: $input) {\n      id\n      name\n      type\n      brand\n      unit\n      isActive\n      notes\n      categoryId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveArticle($id: ID!) {\n    removeArticle(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveArticle($id: ID!) {\n    removeArticle(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"): (typeof documents)["\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Categories($kind: TransactionKind) {\n    categories(kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"): (typeof documents)["\n  query Categories($kind: TransactionKind) {\n    categories(kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ArticleInflation($filter: ArticleInflationFilterInput) {\n    articleInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        monthlyRate\n        annualRate\n        basketSize\n      }\n      articles {\n        articleId\n        name\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          avgUnitPrice\n          quantity\n          monthlyRate\n          annualRate\n        }\n      }\n      categories {\n        categoryId\n        categoryName\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          monthlyRate\n          annualRate\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ArticleInflation($filter: ArticleInflationFilterInput) {\n    articleInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        monthlyRate\n        annualRate\n        basketSize\n      }\n      articles {\n        articleId\n        name\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          avgUnitPrice\n          quantity\n          monthlyRate\n          annualRate\n        }\n      }\n      categories {\n        categoryId\n        categoryName\n        latestMonthlyRate\n        latestAnnualRate\n        points {\n          period\n          monthlyRate\n          annualRate\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ExpenseInflation($filter: InflationFilterInput) {\n    expenseInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        total\n        count\n        monthlyRate\n        annualRate\n      }\n    }\n  }\n"): (typeof documents)["\n  query ExpenseInflation($filter: InflationFilterInput) {\n    expenseInflation(filter: $filter) {\n      latestMonthlyRate\n      latestAnnualRate\n      averageMonthlyRate\n      points {\n        period\n        total\n        count\n        monthlyRate\n        annualRate\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Products($search: String, $includeInactive: Boolean) {\n    products(search: $search, includeInactive: $includeInactive) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n      inStock\n      notes\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  query Products($search: String, $includeInactive: Boolean) {\n    products(search: $search, includeInactive: $includeInactive) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n      inStock\n      notes\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductStats {\n    productStats {\n      articleId\n      name\n      closedCycles\n      avgDaysLasted\n      minDaysLasted\n      maxDaysLasted\n      avgUnitPrice\n      lastPurchasedOn\n      estimatedDepletionDate\n    }\n  }\n"): (typeof documents)["\n  query ProductStats {\n    productStats {\n      articleId\n      name\n      closedCycles\n      avgDaysLasted\n      minDaysLasted\n      maxDaysLasted\n      avgUnitPrice\n      lastPurchasedOn\n      estimatedDepletionDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ProductPurchases($articleId: ID) {\n    productPurchases(articleId: $articleId) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      expenseId\n      article {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query ProductPurchases($articleId: ID) {\n    productPurchases(articleId: $articleId) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      expenseId\n      article {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ConsumptionCycles($articleId: ID!) {\n    consumptionCycles(articleId: $articleId) {\n      id\n      startedOn\n      depletedOn\n      daysLasted\n      quantity\n      purchaseId\n    }\n  }\n"): (typeof documents)["\n  query ConsumptionCycles($articleId: ID!) {\n    consumptionCycles(articleId: $articleId) {\n      id\n      startedOn\n      depletedOn\n      daysLasted\n      quantity\n      purchaseId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterProductPurchase($input: RegisterProductPurchaseInput!) {\n    registerProductPurchase(input: $input) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      article {\n        id\n        name\n        inStock\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterProductPurchase($input: RegisterProductPurchaseInput!) {\n    registerProductPurchase(input: $input) {\n      id\n      purchasedOn\n      quantity\n      unitPrice\n      totalPrice\n      store\n      article {\n        id\n        name\n        inStock\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MarkProductDepleted($articleId: ID!, $depletedOn: String) {\n    markProductDepleted(articleId: $articleId, depletedOn: $depletedOn) {\n      id\n      name\n      inStock\n    }\n  }\n"): (typeof documents)["\n  mutation MarkProductDepleted($articleId: ID!, $depletedOn: String) {\n    markProductDepleted(articleId: $articleId, depletedOn: $depletedOn) {\n      id\n      name\n      inStock\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProduct($input: UpdateProductInput!) {\n    updateProduct(input: $input) {\n      id\n      name\n      brand\n      packageSize\n      unit\n      barcode\n      isConsumable\n      isActive\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveProduct($id: ID!) {\n    removeProduct(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveProduct($id: ID!) {\n    removeProduct(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RecurringFields on RecurringExpense {\n    id\n    description\n    amount\n    currency\n    recurrence\n    startOn\n    endOn\n    nextRunOn\n    isActive\n    merchant\n    notes\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment RecurringFields on RecurringExpense {\n    id\n    description\n    amount\n    currency\n    recurrence\n    startOn\n    endOn\n    nextRunOn\n    isActive\n    merchant\n    notes\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RecurringExpenses($includeInactive: Boolean) {\n    recurringExpenses(includeInactive: $includeInactive) {\n      ...RecurringFields\n    }\n  }\n"): (typeof documents)["\n  query RecurringExpenses($includeInactive: Boolean) {\n    recurringExpenses(includeInactive: $includeInactive) {\n      ...RecurringFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRecurringExpense($input: CreateRecurringExpenseInput!) {\n    createRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRecurringExpense($input: CreateRecurringExpenseInput!) {\n    createRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRecurringExpense($input: UpdateRecurringExpenseInput!) {\n    updateRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRecurringExpense($input: UpdateRecurringExpenseInput!) {\n    updateRecurringExpense(input: $input) {\n      ...RecurringFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveRecurringExpense($id: ID!) {\n    removeRecurringExpense(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveRecurringExpense($id: ID!) {\n    removeRecurringExpense(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RunDueRecurringExpenses {\n    runDueRecurringExpenses\n  }\n"): (typeof documents)["\n  mutation RunDueRecurringExpenses {\n    runDueRecurringExpenses\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ExpenseFields on Expense {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    merchant\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      subtotal\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ExpenseFields on Expense {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    merchant\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n    items {\n      id\n      articleId\n      description\n      unitPrice\n      quantity\n      discount\n      subtotal\n      article {\n        id\n        name\n        type\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IncomeFields on Income {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    source\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n  }\n"): (typeof documents)["\n  fragment IncomeFields on Income {\n    id\n    description\n    amount\n    currency\n    exchangeRate\n    occurredOn\n    source\n    notes\n    recurrence\n    accountId\n    account {\n      id\n      name\n    }\n    categoryId\n    category {\n      id\n      name\n      icon\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Expenses($filter: TransactionsFilterInput) {\n    expenses(filter: $filter) {\n      ...ExpenseFields\n    }\n  }\n"): (typeof documents)["\n  query Expenses($filter: TransactionsFilterInput) {\n    expenses(filter: $filter) {\n      ...ExpenseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Incomes($filter: TransactionsFilterInput) {\n    incomes(filter: $filter) {\n      ...IncomeFields\n    }\n  }\n"): (typeof documents)["\n  query Incomes($filter: TransactionsFilterInput) {\n    incomes(filter: $filter) {\n      ...IncomeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      ...ExpenseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      ...IncomeFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveExpense($id: ID!) {\n    removeExpense(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveExpense($id: ID!) {\n    removeExpense(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveIncome($id: ID!) {\n    removeIncome(id: $id)\n  }\n"): (typeof documents)["\n  mutation RemoveIncome($id: ID!) {\n    removeIncome(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Health {\n    health\n  }\n"): (typeof documents)["\n  query Health {\n    health\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;