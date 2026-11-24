import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/Button'
import { Sheet } from '@/components/Sheet'
import { EmptyState, ErrorState, LoadingRows } from '@/components/states'
import { useSession } from '@/features/auth/SessionContext'
import { getFirstErrorMessage } from '@/graphql/errors'
import { LoanCard } from './LoanCard'
import { LoanForm } from './LoanForm'
import { LoansQuery } from './loans.queries'

export function LoansPage() {
  const navigate = useNavigate()
  const { user } = useSession()
  const [isCreating, setIsCreating] = useState(false)
  const { data, loading, error, refetch } = useQuery(LoansQuery)
  const loans = data?.loans ?? []

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-2xl font-semibold">Créditos</h1>
        <Button onClick={() => setIsCreating(true)}>Nuevo crédito</Button>
      </div>

      <p className="text-ink-secondary mt-2 text-sm">
        Préstamos con su tabla de amortización. Cada cuota pagada y cada abono a capital
        se registran como gasto.
      </p>

      <div className="mt-6">
        {loading && !data ? (
          <LoadingRows rows={3} />
        ) : error ? (
          <ErrorState
            message={getFirstErrorMessage(error)}
            onRetry={() => void refetch()}
          />
        ) : loans.length === 0 ? (
          <EmptyState
            title="Sin créditos"
            description="Registra un préstamo para ver su tabla de cuotas, pagarlas y abonar a capital."
            action={<Button onClick={() => setIsCreating(true)}>Nuevo crédito</Button>}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </ul>
        )}
      </div>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Nuevo crédito"
      >
        {isCreating && (
          <LoanForm
            defaultCurrency={user?.baseCurrency ?? 'COP'}
            onCancel={() => setIsCreating(false)}
            onCreated={(loanId) => {
              setIsCreating(false)
              void navigate(`/creditos/${loanId}`)
            }}
          />
        )}
      </Sheet>
    </div>
  )
}
