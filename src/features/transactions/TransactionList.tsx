import { Money } from '@/components/Money'
import { formatDate } from '@/lib/dates'
import { directionOf, type Transaction } from './types'

type TransactionListProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onRemove: (transaction: Transaction) => void
}

/**
 * En móvil, tarjetas apiladas; desde `md:`, tabla real.
 *
 * No se usa una tabla en móvil: cinco columnas en 375px obligan a scroll
 * horizontal o a texto ilegible. Es el mismo dato con dos formas, no dos
 * componentes distintos.
 */
export function TransactionList({
  transactions,
  onEdit,
  onRemove,
}: TransactionListProps) {
  return (
    <>
      <ul className="flex flex-col gap-2 md:hidden">
        {transactions.map((transaction) => (
          <li
            key={`${transaction.kind}-${transaction.id}`}
            className="border-border bg-surface-raised rounded-lg border p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-ink truncate text-sm font-medium">
                  {transaction.description}
                </p>
                <p className="text-ink-muted mt-0.5 text-xs">
                  {formatDate(transaction.occurredOn)}
                  {transaction.categoryName && ` · ${transaction.categoryName}`}
                  {transaction.accountName && ` · ${transaction.accountName}`}
                  {transaction.items.length > 0 &&
                    ` · ${transaction.items.length} ítem${transaction.items.length > 1 ? 's' : ''}`}
                </p>
              </div>
              <Money
                amount={transaction.amount}
                currency={transaction.currency}
                direction={directionOf(transaction.kind)}
                size="sm"
              />
            </div>
            <div className="mt-2 flex gap-1">
              <RowAction onClick={() => onEdit(transaction)}>Editar</RowAction>
              <RowAction onClick={() => onRemove(transaction)}>Eliminar</RowAction>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-border hidden overflow-x-auto rounded-lg border md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-border text-ink-secondary border-b">
            <tr>
              <Th>Descripción</Th>
              <Th>Categoría</Th>
              <Th>Fecha</Th>
              <Th className="text-right">Importe</Th>
              <Th>
                <span className="sr-only">Acciones</span>
              </Th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {transactions.map((transaction) => (
              <tr key={`${transaction.kind}-${transaction.id}`}>
                <td className="text-ink px-4 py-3 font-medium">
                  {transaction.description}
                  {transaction.counterparty && (
                    <span className="text-ink-muted font-normal">
                      {' '}
                      · {transaction.counterparty}
                    </span>
                  )}
                </td>
                <td className="text-ink-secondary px-4 py-3">
                  {transaction.categoryIcon && `${transaction.categoryIcon} `}
                  {transaction.categoryName ?? '—'}
                </td>
                <td className="text-ink-secondary px-4 py-3 whitespace-nowrap">
                  {formatDate(transaction.occurredOn)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Money
                    amount={transaction.amount}
                    currency={transaction.currency}
                    direction={directionOf(transaction.kind)}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <RowAction onClick={() => onEdit(transaction)}>Editar</RowAction>
                    <RowAction onClick={() => onRemove(transaction)}>
                      Eliminar
                    </RowAction>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <th className={`px-4 py-2.5 text-xs font-medium ${className}`}>{children}</th>
}

function RowAction({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-ink-secondary hover:bg-surface-sunken min-h-11 rounded-lg px-3 text-sm"
    >
      {children}
    </button>
  )
}
