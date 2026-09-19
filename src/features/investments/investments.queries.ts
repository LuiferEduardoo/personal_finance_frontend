import { graphql } from '@/graphql/generated'

export const InvestmentOverviewQuery = graphql(`
  query InvestmentOverview {
    portfolioSummary {
      asOf
      baseCurrency
      marketValue
      investedCapital
      costBasis
      cash
      unrealizedPnl
      realizedPnl
      simpleReturn
      dividends
      interest
      fees
      taxes
      positionsCount
      missingPriceCount
      estimatedBasisPositionsCount
      pricesAsOf
      pricesStale
    }
    portfolioEvolution {
      baseCurrency
      estimatedDays
      isStale
      points {
        date
        totalValue
        marketValue
        cash
        contributions
        netFlow
        unrealizedPnl
        realizedPnl
        dividends
        twrIndex
        isEstimated
        missingPriceCount
      }
    }
    investmentPositions {
      id
      quantity
      averageCost
      costBasisBase
      marketValueBase
      unrealizedPnlBase
      unrealizedReturn
      realizedPnlToDateBase
      costBasisIsEstimated
      priceMissing
      lastPrice
      lastPriceOn
      currency
      account {
        id
        name
        broker
        currency
      }
      instrument {
        id
        symbol
        name
        assetClass
        currency
        sector
        country
        lastPrice
        lastPriceOn
      }
    }
    pendingCorporateActions {
      id
      type
      instrumentId
      symbol
      instrumentName
      exDate
      amountPerShare
      quantityHeld
      estimatedAmount
      ratioNumerator
      ratioDenominator
      currency
      description
      accountIds
    }
  }
`)

export const InvestmentReturnsQuery = graphql(`
  query InvestmentReturns($from: String, $to: String) {
    portfolioReturns(from: $from, to: $to) {
      from
      to
      baseCurrency
      investedCapital
      endingValue
      simpleReturn
      twr
      twrAnnualized
      twrAnnualizedStatus
      xirr
      xirrStatus
      unrealizedPnl
      realizedPnl
      dividends
      isStale
    }
  }
`)

export const InvestmentAllocationQuery = graphql(`
  query InvestmentAllocation($dimension: AllocationDimension!) {
    portfolioAllocation(dimension: $dimension) {
      asOf
      baseCurrency
      total
      missingPriceCount
      slices {
        key
        label
        marketValue
        costBasis
        percentage
        positionsCount
      }
    }
  }
`)

export const BenchmarkComparisonQuery = graphql(`
  query InvestmentBenchmarks(
    $benchmarks: [BenchmarkKey!]!
    $from: String
    $to: String
  ) {
    benchmarkComparison(benchmarks: $benchmarks, from: $from, to: $to) {
      baseCurrency
      from
      to
      inBaseCurrency
      warnings
      series {
        key
        label
        totalReturn
        annualized
        annualizedStatus
        excessReturn
        basis
        points {
          date
          index
        }
      }
    }
  }
`)

export const InvestmentAccountsQuery = graphql(`
  query InvestmentAccounts($includeInactive: Boolean!) {
    investmentAccounts(includeInactive: $includeInactive) {
      id
      name
      broker
      currency
      isActive
      connectionId
      externalAccountId
      linkedPaymentMethodId
      createdAt
      updatedAt
    }
    investmentCashBalances {
      currency
      amount
    }
  }
`)

export const InvestmentTransactionsQuery = graphql(`
  query InvestmentTransactions($filter: InvestmentTransactionsFilterInput) {
    investmentTransactions(filter: $filter) {
      id
      accountId
      type
      instrumentId
      occurredOn
      occurredAt
      quantity
      price
      amount
      fee
      tax
      currency
      fxRate
      fxRateSource
      settlementCurrency
      settlementAmount
      splitRatioNumerator
      splitRatioDenominator
      counterpartyAccountId
      externalId
      notes
      occurrenceIndex
      createdAt
      updatedAt
      account {
        id
        name
      }
      instrument {
        id
        symbol
        name
        assetClass
      }
    }
    investmentTransactionsCount(filter: $filter)
  }
`)

export const InstrumentSearchQuery = graphql(`
  query InvestmentInstrumentSearch($query: String!, $limit: Int) {
    instrumentSearch(query: $query, limit: $limit) {
      id
      symbol
      name
      exchange
      assetClass
      currency
      sector
      industry
      country
      isin
      twelveDataSymbol
      priceSource
      lastPrice
      lastPriceOn
    }
  }
`)

export const BrokerConnectionsQuery = graphql(`
  query BrokerConnections {
    brokerConnections {
      id
      broker
      label
      isDemo
      autoSync
      hasCredentials
      status
      lastError
      lastSyncedAt
      createdAt
      updatedAt
    }
  }
`)

export const CreateInvestmentAccountMutation = graphql(`
  mutation CreateInvestmentAccount($input: CreateInvestmentAccountInput!) {
    createInvestmentAccount(input: $input) {
      id
    }
  }
`)
export const UpdateInvestmentAccountMutation = graphql(`
  mutation UpdateInvestmentAccount($input: UpdateInvestmentAccountInput!) {
    updateInvestmentAccount(input: $input) {
      id
    }
  }
`)
export const DeleteInvestmentAccountMutation = graphql(`
  mutation DeleteInvestmentAccount($id: ID!) {
    deleteInvestmentAccount(id: $id)
  }
`)
export const RebuildInvestmentPositionsMutation = graphql(`
  mutation RebuildInvestmentPositions($accountId: ID) {
    rebuildInvestmentPositions(accountId: $accountId)
  }
`)
export const CreateInvestmentTransactionMutation = graphql(`
  mutation CreateInvestmentTransaction($input: CreateInvestmentTransactionInput!) {
    createInvestmentTransaction(input: $input) {
      id
    }
  }
`)
export const UpdateInvestmentTransactionMutation = graphql(`
  mutation UpdateInvestmentTransaction($input: UpdateInvestmentTransactionInput!) {
    updateInvestmentTransaction(input: $input) {
      id
    }
  }
`)
export const DeleteInvestmentTransactionMutation = graphql(`
  mutation DeleteInvestmentTransaction($id: ID!) {
    deleteInvestmentTransaction(id: $id)
  }
`)
export const ResolveInvestmentFxRatesMutation = graphql(`
  mutation ResolveInvestmentFxRates {
    resolveInvestmentFxRates
  }
`)
export const RefreshInvestmentPricesMutation = graphql(`
  mutation RefreshInvestmentPrices {
    refreshInvestmentPrices
  }
`)
export const RebuildPortfolioSnapshotsMutation = graphql(`
  mutation RebuildPortfolioSnapshots {
    rebuildPortfolioSnapshots
  }
`)
export const RefreshCorporateActionsMutation = graphql(`
  mutation RefreshCorporateActions {
    refreshCorporateActions
  }
`)
export const ApplyCorporateActionMutation = graphql(`
  mutation ApplyCorporateAction($actionId: ID!, $accountId: ID!) {
    applyCorporateAction(actionId: $actionId, accountId: $accountId) {
      id
    }
  }
`)
export const CreateInstrumentMutation = graphql(`
  mutation CreateInstrument($input: CreateInstrumentInput!) {
    createInstrument(input: $input) {
      id
      symbol
      name
    }
  }
`)
export const UpdateInstrumentMutation = graphql(`
  mutation UpdateInstrument($input: UpdateInstrumentInput!) {
    updateInstrument(input: $input) {
      id
    }
  }
`)
export const SetInstrumentPriceMutation = graphql(`
  mutation SetInstrumentPrice($input: SetInstrumentPriceInput!) {
    setInstrumentPrice(input: $input) {
      id
      lastPrice
      lastPriceOn
    }
  }
`)
export const CreateBrokerConnectionMutation = graphql(`
  mutation CreateBrokerConnection($input: CreateBrokerConnectionInput!) {
    createBrokerConnection(input: $input) {
      id
    }
  }
`)
export const UpdateBrokerConnectionMutation = graphql(`
  mutation UpdateBrokerConnection($input: UpdateBrokerConnectionInput!) {
    updateBrokerConnection(input: $input) {
      id
    }
  }
`)
export const DeleteBrokerConnectionMutation = graphql(`
  mutation DeleteBrokerConnection($id: ID!) {
    deleteBrokerConnection(id: $id)
  }
`)
export const VerifyBrokerConnectionMutation = graphql(`
  mutation VerifyBrokerConnection($id: ID!) {
    verifyBrokerConnection(id: $id) {
      id
      status
      lastError
    }
  }
`)
export const SyncBrokerConnectionMutation = graphql(`
  mutation SyncBrokerConnection($id: ID!) {
    syncBrokerConnection(id: $id) {
      connectionId
      fetched
      inserted
      duplicates
      errors
      warnings
      partial
    }
  }
`)
export const SyncAllBrokerConnectionsMutation = graphql(`
  mutation SyncAllBrokerConnections {
    syncAllBrokerConnections {
      connectionId
      fetched
      inserted
      duplicates
      errors
      warnings
      partial
    }
  }
`)
