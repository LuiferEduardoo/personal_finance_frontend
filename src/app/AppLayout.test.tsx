import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { SessionContext, type SessionValue } from '@/features/auth/SessionContext'
import { AppLayout } from './AppLayout'

const session: SessionValue = {
  user: {
    id: 'user-1',
    email: 'ana@example.com',
    firstName: 'Ana',
    lastName: 'Torres',
    avatar: null,
    baseCurrency: 'COP',
    financeBaseCurrency: 'COP',
    investmentBaseCurrency: 'USD',
    timezone: 'America/Bogota',
  },
  isLoading: false,
  isAuthenticated: true,
  logout: vi.fn(),
}

function renderLayout(initialEntry = '/') {
  return render(
    <SessionContext value={session}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<p>Contenido</p>} />
            <Route path="categorias" element={<p>Categorías</p>} />
            <Route path="inversiones" element={<p>Cartera</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </SessionContext>,
  )
}

describe('AppLayout navigation', () => {
  it('contrae y despliega el sidebar', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('button', { name: 'Contraer menú lateral' }))
    expect(
      screen.getByRole('button', { name: 'Desplegar menú lateral' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Desplegar menú lateral' }))
    expect(
      screen.getByRole('button', { name: 'Contraer menú lateral' }),
    ).toBeInTheDocument()
  })

  it('agrupa categorías y recurrentes bajo Organización', async () => {
    const user = userEvent.setup()
    renderLayout()
    const sidebar = within(screen.getByRole('complementary'))

    await user.click(sidebar.getByRole('button', { name: 'Organización' }))
    expect(sidebar.getByRole('link', { name: 'Categorías' })).toBeInTheDocument()
    expect(
      sidebar.getByRole('link', { name: 'Gastos recurrentes' }),
    ).toBeInTheDocument()
  })

  it('cambia entre finanzas e inversiones desde el selector de espacio', async () => {
    const user = userEvent.setup()
    renderLayout()
    const sidebar = within(screen.getByRole('complementary'))

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Cambiar espacio de trabajo' }),
      'investments',
    )

    expect(screen.getByText('Cartera')).toBeInTheDocument()
    expect(sidebar.getByRole('link', { name: 'Resumen' })).toBeInTheDocument()
    expect(
      sidebar.queryByRole('link', { name: 'Registrar gasto' }),
    ).not.toBeInTheDocument()
  })
})
