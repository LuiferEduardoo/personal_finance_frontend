import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ApiKeyForm } from './ApiKeyForm'

describe('ApiKeyForm', () => {
  it('exige nombre y al menos un permiso', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ApiKeyForm isSaving={false} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Crear clave' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Escribe un nombre para reconocer esta clave.',
    )

    await user.type(screen.getByLabelText('Nombre'), 'Integración contable')
    await user.click(screen.getByRole('button', { name: 'Crear clave' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Selecciona al menos un permiso.',
    )
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('envía el scope seleccionado y una expiración ISO', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ApiKeyForm isSaving={false} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nombre'), 'Dashboard externo')
    await user.click(screen.getByLabelText('Consultar cartera y operaciones'))
    await user.type(
      screen.getByLabelText('Fecha de expiración (opcional)'),
      '2027-12-31',
    )
    await user.click(screen.getByRole('button', { name: 'Crear clave' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Dashboard externo',
      scopes: ['INVESTMENTS_READ'],
      expiresAt: '2027-12-31T23:59:59.999Z',
    })
  })

  it('permite combinar permisos del espacio de inversiones', async () => {
    const user = userEvent.setup()
    render(<ApiKeyForm isSaving={false} onSubmit={vi.fn()} />)

    await user.click(screen.getByLabelText('Consultar cartera y operaciones'))
    await user.click(screen.getByLabelText('Consultar instrumentos y mercado'))

    expect(screen.getByLabelText('Consultar cartera y operaciones')).toBeChecked()
    expect(screen.getByLabelText('Consultar instrumentos y mercado')).toBeChecked()
    expect(screen.queryByLabelText('Todos los permisos')).not.toBeInTheDocument()
  })

  it('separa los permisos financieros de los permisos de inversiones', () => {
    render(<ApiKeyForm isSaving={false} onSubmit={vi.fn()} />)

    expect(screen.getByText('Gastos e Ingresos')).toBeInTheDocument()
    expect(screen.getByText('Inversiones')).toBeInTheDocument()
    expect(screen.getByLabelText('Consultar gastos')).toBeInTheDocument()
    expect(screen.getByLabelText('Consultar cartera y operaciones')).toBeInTheDocument()
  })
})
