import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { getFirstErrorMessage } from '@/graphql/errors'
import { RequestPasswordResetMutation, ResetPasswordMutation } from './auth.queries'

export function PasswordRecoveryPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [request, requesting] = useMutation(RequestPasswordResetMutation)
  const [reset, resetting] = useMutation(ResetPasswordMutation)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage(null)
    try {
      if (token) {
        await reset({ variables: { input: { token, newPassword: password } } })
        setMessage('Contraseña actualizada. Ya puedes iniciar sesión.')
      } else {
        await request({ variables: { email } })
        setMessage('Si el correo existe, recibirás un enlace en unos minutos.')
      }
    } catch (error) {
      setMessage(getFirstErrorMessage(error))
    }
  }
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-ink text-2xl font-semibold">
        {token ? 'Nueva contraseña' : 'Recuperar contraseña'}
      </h1>
      <p className="text-ink-secondary mt-2 text-sm">
        {token
          ? 'Usa al menos 10 caracteres, una letra y un número.'
          : 'Te enviaremos un enlace válido durante 30 minutos.'}
      </p>
      <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
        {token ? (
          <Field
            label="Nueva contraseña"
            type="password"
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        ) : (
          <Field
            label="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        {message && (
          <p role="status" className="text-ink-secondary text-sm">
            {message}
          </p>
        )}
        <Button type="submit" isLoading={requesting.loading || resetting.loading}>
          {token ? 'Cambiar contraseña' : 'Enviar enlace'}
        </Button>
      </form>
      <Link to="/entrar" className="text-ink mt-6 text-sm underline">
        Volver al inicio de sesión
      </Link>
    </main>
  )
}
