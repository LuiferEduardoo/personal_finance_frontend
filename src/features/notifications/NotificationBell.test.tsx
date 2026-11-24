import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { NOTIFICATIONS_PAGE_SIZE } from './notification'
import { NotificationBell } from './NotificationBell'
import {
  MarkAllNotificationsReadMutation,
  NotificationsQuery,
  UnreadNotificationsCountQuery,
} from './notifications.queries'

function notification(id: string, title: string, read = false) {
  return {
    __typename: 'Notification' as const,
    id,
    type: 'BUDGET_EXCEEDED' as const,
    title,
    body: 'Detalle',
    link: '/presupuestos',
    read,
    readAt: null,
    createdAt: new Date().toISOString(),
  }
}

function renderBell(count: number, extraMocks: MockedResponse[] = []) {
  const mocks: MockedResponse[] = [
    {
      request: { query: UnreadNotificationsCountQuery },
      result: { data: { unreadNotificationsCount: count } },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    ...extraMocks,
  ]
  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <NotificationBell />
      </MemoryRouter>
    </MockedProvider>,
  )
}

describe('NotificationBell', () => {
  it('muestra el conteo en el badge y en el nombre accesible', async () => {
    renderBell(3)
    expect(
      await screen.findByRole('button', { name: 'Notificaciones, 3 sin leer' }),
    ).toHaveTextContent('3')
  })

  it('topa el badge en 99+', async () => {
    renderBell(120)
    expect(
      await screen.findByRole('button', { name: 'Notificaciones, 120 sin leer' }),
    ).toHaveTextContent('99+')
  })

  it('abre el panel, lista y marca todas como leídas', async () => {
    const user = userEvent.setup()
    const markAllResult = vi.fn(() => ({ data: { markAllNotificationsRead: 2 } }))
    renderBell(2, [
      {
        request: {
          query: NotificationsQuery,
          variables: { filter: { limit: NOTIFICATIONS_PAGE_SIZE, offset: 0 } },
        },
        result: {
          data: {
            notifications: [
              notification('n1', 'Presupuesto excedido'),
              notification('n2', 'Cuota vencida'),
            ],
          },
        },
      },
      { request: { query: MarkAllNotificationsReadMutation }, result: markAllResult },
    ])

    await user.click(
      await screen.findByRole('button', { name: 'Notificaciones, 2 sin leer' }),
    )
    expect(screen.getByRole('dialog', { name: 'Notificaciones' })).toBeInTheDocument()
    expect(await screen.findByText('Presupuesto excedido')).toBeInTheDocument()
    expect(screen.getAllByText(', sin leer')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }))

    // Optimista: el badge y las marcas de "sin leer" desaparecen al instante.
    expect(
      await screen.findByRole('button', { name: 'Notificaciones' }),
    ).not.toHaveTextContent('2')
    expect(screen.queryAllByText(', sin leer')).toHaveLength(0)
    expect(
      screen.getByRole('button', { name: 'Marcar todas como leídas' }),
    ).toBeDisabled()
    await vi.waitFor(() => expect(markAllResult).toHaveBeenCalledOnce())
  })

  it('muestra el estado vacío y cierra con Escape', async () => {
    const user = userEvent.setup()
    renderBell(0, [
      {
        request: {
          query: NotificationsQuery,
          variables: { filter: { limit: NOTIFICATIONS_PAGE_SIZE, offset: 0 } },
        },
        result: { data: { notifications: [] } },
      },
    ])

    const bell = await screen.findByRole('button', { name: 'Notificaciones' })
    await user.click(bell)
    expect(await screen.findByText('No tienes notificaciones')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Marcar todas como leídas' }),
    ).toBeDisabled()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(bell).toHaveFocus()
  })
})
