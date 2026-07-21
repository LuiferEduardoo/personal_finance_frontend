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
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Categories($userId: ID!, $kind: TransactionKind) {\n    categories(userId: $userId, kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": typeof types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": typeof types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n": typeof types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n": typeof types.RemoveCategoryDocument,
    "\n  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {\n    expenses(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.ExpensesDocument,
    "\n  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {\n    incomes(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.IncomesDocument,
    "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.CreateExpenseDocument,
    "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.CreateIncomeDocument,
    "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.UpdateExpenseDocument,
    "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": typeof types.UpdateIncomeDocument,
    "\n  mutation RemoveExpense($id: ID!) {\n    removeExpense(id: $id)\n  }\n": typeof types.RemoveExpenseDocument,
    "\n  mutation RemoveIncome($id: ID!) {\n    removeIncome(id: $id)\n  }\n": typeof types.RemoveIncomeDocument,
    "\n  query Health {\n    health\n  }\n": typeof types.HealthDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      refreshToken\n      user {\n        id\n        email\n        firstName\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation Logout($refreshToken: String!) {\n    logout(refreshToken: $refreshToken)\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      firstName\n      lastName\n      avatar\n      baseCurrency\n      timezone\n    }\n  }\n": types.MeDocument,
    "\n  query Categories($userId: ID!, $kind: TransactionKind) {\n    categories(userId: $userId, kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": types.CategoriesDocument,
    "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n": types.CreateCategoryDocument,
    "\n  mutation UpdateCategory($input: UpdateCategoryInput!) {\n    updateCategory(input: $input) {\n      id\n      name\n      icon\n      color\n      isActive\n    }\n  }\n": types.UpdateCategoryDocument,
    "\n  mutation RemoveCategory($id: ID!) {\n    removeCategory(id: $id)\n  }\n": types.RemoveCategoryDocument,
    "\n  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {\n    expenses(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.ExpensesDocument,
    "\n  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {\n    incomes(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.IncomesDocument,
    "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.CreateExpenseDocument,
    "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.CreateIncomeDocument,
    "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.UpdateExpenseDocument,
    "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.UpdateIncomeDocument,
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
export function graphql(source: "\n  query Categories($userId: ID!, $kind: TransactionKind) {\n    categories(userId: $userId, kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"): (typeof documents)["\n  query Categories($userId: ID!, $kind: TransactionKind) {\n    categories(userId: $userId, kind: $kind) {\n      id\n      name\n      icon\n      color\n      kind\n      parentId\n      userId\n      isActive\n    }\n  }\n"];
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
export function graphql(source: "\n  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {\n    expenses(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  query Expenses($userId: ID!, $filter: TransactionsFilterInput) {\n    expenses(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {\n    incomes(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  query Incomes($userId: ID!, $filter: TransactionsFilterInput) {\n    incomes(userId: $userId, filter: $filter) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateExpense($input: CreateExpenseInput!) {\n    createExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIncome($input: CreateIncomeInput!) {\n    createIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateExpense($input: UpdateExpenseInput!) {\n    updateExpense(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      merchant\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIncome($input: UpdateIncomeInput!) {\n    updateIncome(input: $input) {\n      id\n      description\n      amount\n      currency\n      exchangeRate\n      occurredOn\n      source\n      notes\n      recurrence\n      categoryId\n      category {\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
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