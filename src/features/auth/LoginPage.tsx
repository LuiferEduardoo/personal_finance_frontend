import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type FormEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { getFirstErrorMessage } from '@/graphql/errors'
import { LoginMutation } from './auth.queries'
import { setTokens } from './tokenStore'

const loginSchema = z.object({
  email: z.email('Introduce un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

const twoFactorSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Introduce el código de 6 dígitos'),
})

type LoginFormValues = z.infer<typeof loginSchema>
type TwoFactorFormValues = z.infer<typeof twoFactorSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<LoginFormValues | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [login, { loading }] = useMutation(LoginMutation)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const authenticate = async (
    values: LoginFormValues & { twoFactorCode?: string },
  ): Promise<string | null> => {
    try {
      const { data } = await login({ variables: { input: values } })
      if (!data) return 'No fue posible completar el inicio de sesión.'
      setTokens({
        accessToken: data.login.accessToken,
        refreshToken: data.login.refreshToken,
      })
      await navigate('/', { replace: true })
      return null
    } catch (error) {
      return getFirstErrorMessage(error)
    }
  }

  if (credentials) {
    return (
      <TwoFactorView
        email={credentials.email}
        isLoading={loading}
        onBack={() => setCredentials(null)}
        onVerify={(code) => authenticate({ ...credentials, twoFactorCode: code })}
      />
    )
  }

  return (
    <LoginCredentialsView
      errors={errors}
      isLoading={loading}
      register={register}
      formError={formError}
      onSubmit={(event) => {
        setFormError(null)
        void handleSubmit(async (values) => {
          const message = await authenticate(values)
          if (message?.includes('TWO_FACTOR_REQUIRED')) {
            setCredentials(values)
            return
          }
          if (message) setFormError(message)
        })(event)
      }}
    />
  )
}

function LoginCredentialsView({
  errors,
  isLoading,
  register,
  formError,
  onSubmit,
}: {
  errors: ReturnType<typeof useForm<LoginFormValues>>['formState']['errors']
  isLoading: boolean
  register: ReturnType<typeof useForm<LoginFormValues>>['register']
  formError: string | null
  onSubmit: FormEventHandler<HTMLFormElement>
}) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <BrandHeader />
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

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="text-ink-secondary mt-6 text-center text-sm">
        <Link to="/recuperar-contrasena" className="text-ink font-medium underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="text-ink-secondary mt-3 text-center text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-ink font-medium underline">
          Crear una
        </Link>
      </p>
    </main>
  )
}

function TwoFactorView({
  email,
  isLoading,
  onBack,
  onVerify,
}: {
  email: string
  isLoading: boolean
  onBack: () => void
  onVerify: (code: string) => Promise<string | null>
}) {
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormValues>({ resolver: zodResolver(twoFactorSchema) })

  const submit = handleSubmit(async ({ code }) => {
    setFormError(null)
    const message = await onVerify(code)
    if (message) setFormError(message)
  })

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <BrandHeader />
      <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
        Verificación en dos pasos
      </p>
      <h1 className="text-ink mt-2 text-2xl font-semibold">Ingresa tu código</h1>
      <p className="text-ink-secondary mt-1 text-sm">
        Usa el código de tu aplicación autenticadora o el que enviamos a{' '}
        <span className="text-ink font-medium">{email}</span>.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4" noValidate>
        <Field
          label="Código de seguridad"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          error={errors.code?.message}
          {...register('code')}
        />

        {formError && (
          <p role="alert" className="text-expense text-sm">
            {formError}
          </p>
        )}

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Verificar y entrar
        </Button>
        <Button type="button" variant="ghost" onClick={onBack}>
          Volver al inicio de sesión
        </Button>
      </form>
    </main>
  )
}

function BrandHeader() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <img src="/logo.webp" alt="" className="size-14 shrink-0" />
      <span className="text-ink text-2xl font-semibold">Kairos</span>
    </div>
  )
}
