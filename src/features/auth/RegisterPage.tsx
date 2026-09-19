import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { getFirstErrorMessage } from '@/graphql/errors'
import { RegisterMutation } from './auth.queries'
import { setTokens } from './tokenStore'

const schema = z.object({
  email: z.email('Introduce un correo válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  // El backend acepta lastName opcional.
  lastName: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [registerUser, { loading }] = useMutation(RegisterMutation)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const { data } = await registerUser({
        variables: {
          input: {
            ...values,
            // Un apellido en blanco es "no lo dio", no una cadena vacía.
            lastName: values.lastName?.trim() || undefined,
          },
        },
      })
      if (!data) return
      setTokens({
        accessToken: data.register.accessToken,
        refreshToken: data.register.refreshToken,
      })
      await navigate('/', { replace: true })
    } catch (error) {
      // CONFLICT ("el email ya está registrado") llega con mensaje del backend
      // ya en español, así que se muestra tal cual.
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <img src="/logo.webp" alt="" className="size-14 shrink-0" />
        <span className="text-ink text-2xl font-semibold">Kairos</span>
      </div>
      <h1 className="text-ink text-2xl font-semibold">Crear cuenta</h1>
      <p className="text-ink-secondary mt-1 text-sm">
        Empieza a registrar tus gastos e ingresos.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <Field
          label="Nombre"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Field
          label="Apellido (opcional)"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {formError && (
          <p role="alert" className="text-expense text-sm">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={loading} className="mt-2">
          Crear cuenta
        </Button>
      </form>

      <p className="text-ink-secondary mt-6 text-center text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/entrar" className="text-ink font-medium underline">
          Entrar
        </Link>
      </p>
    </main>
  )
}
