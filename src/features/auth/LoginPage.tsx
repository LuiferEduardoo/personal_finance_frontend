import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { getFirstErrorMessage } from '@/graphql/errors'
import { LoginMutation } from './auth.queries'
import { setTokens } from './tokenStore'

const schema = z.object({
  email: z.email('Introduce un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [login, { loading }] = useMutation(LoginMutation)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const { data } = await login({ variables: { input: values } })
      if (!data) return
      setTokens({
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
      })
      await navigate('/', { replace: true })
    } catch (error) {
      // El backend devuelve el mismo mensaje genérico tanto si el correo no
      // existe como si la contraseña es incorrecta; no lo desglosamos.
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <img src="/logo.webp" alt="" className="size-14 shrink-0" />
        <span className="text-ink text-2xl font-semibold">Kuantico</span>
      </div>
      <h1 className="text-ink text-2xl font-semibold">Entrar</h1>
      <p className="text-ink-secondary mt-1 text-sm">
        Accede para ver tus gastos e ingresos.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <Field
          label="Correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {formError && (
          <p role="alert" className="text-expense text-sm">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={loading} className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="text-ink-secondary mt-6 text-center text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-ink font-medium underline">
          Crear una
        </Link>
      </p>
    </main>
  )
}
