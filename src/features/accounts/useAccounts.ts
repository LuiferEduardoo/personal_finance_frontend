import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { AccountsQuery } from './accounts.queries'

/** Cuentas activas del usuario. Guardadas por token, no reciben `userId`. */
export function useAccounts(includeInactive = false) {
  const { data, loading, error } = useQuery(AccountsQuery, {
    variables: { includeInactive },
  })
  const accounts = useMemo(() => data?.accounts ?? [], [data?.accounts])
  return { accounts, loading, error }
}
