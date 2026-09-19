import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { SessionContext, type SessionValue } from '@/features/auth/SessionContext'
import { ProfileMenu } from './ProfileMenu'

function renderMenu(logout = vi.fn()) {
  const value: SessionValue = {
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
    logout,
  }
  render(
    <SessionContext value={value}>
      <MemoryRouter>
        <ProfileMenu />
      </MemoryRouter>
    </SessionContext>,
  )
  return logout
}

describe('ProfileMenu', () => {
  it('muestra perfil, sección de desarrollador y API keys', async () => {
    const user = userEvent.setup()
    renderMenu()

    await user.click(screen.getByLabelText('Abrir menú de perfil'))
    expect(screen.getByText('Ana Torres')).toBeInTheDocument()
    expect(screen.getByText('Desarrollador')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'API keys' })).toHaveAttribute(
      'href',
      '/api-keys',
    )
    expect(
      screen.getByRole('link', { name: 'Configuración del perfil' }),
    ).toHaveAttribute('href', '/ajustes')
  })

  it('cierra la sesión desde el menú', async () => {
    const user = userEvent.setup()
    const logout = renderMenu()

    await user.click(screen.getByLabelText('Abrir menú de perfil'))
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(logout).toHaveBeenCalledOnce()
  })
})
