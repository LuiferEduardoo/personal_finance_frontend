import { graphql } from '@/graphql/generated'

export const LatestTrmQuery = graphql(`
  query LatestTrm {
    latestTrm {
      value
      validFrom
      validTo
    }
  }
`)
