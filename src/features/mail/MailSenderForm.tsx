import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { MailSendersQuery } from '@/graphql/generated/graphql'
import { CreateMailSenderMutation, UpdateMailSenderMutation } from './mail.queries'
import { SENDER_KIND_LABELS } from './mail-sender'
import { PasswordBadge } from './PasswordBadge'

export type MailSender = MailSendersQuery['mailSenders'][number]

type Option = { id: string; name: string }

const schema = z.object({
  kind: z.enum(['INVOICE', 'XTB_ORDER_CONFIRMATION']),
  connectionId: z.string(),
  emailAddress: z.email('Introduce un correo válido'),
  merchantName: z.string().trim().min(1, 'El nombre es obligatorio'),
  defaultAccountId: z.string(),
  defaultCategoryId: z.string(),
  investmentAccountId: z.string(),
  // No se recorta: los espacios pueden ser parte de la contraseña del PDF.
  attachmentPassword: z.string(),
  backfillFrom: z.string(),
})

type FormValues = z.infer<typeof schema>

/**
 * Alta y edición de un remitente.
 *
 * Dos tipos con campos distintos (verificado en `MailSendersService`):
 *   - `INVOICE`: cuenta y categoría por defecto del gasto.
 *   - `XTB_ORDER_CONFIRMATION`: cuenta de inversión + contraseña del PDF. El
 *     backend no las exige al guardar, pero sin ellas cada correo queda
 *     `FAILED`; por eso aquí son obligatorias.
 *
 * La contraseña es de solo escritura: nunca llega del backend. Al editar,
 * dejarla vacía conserva la guardada (no se envía el campo).
 */
export function MailSenderForm({
  sender,
  connections,
  accounts,
  categories,
  investmentAccounts,
  onSaved,
  onCancel,
}: {
  sender?: MailSender
  connections: ReadonlyArray<{ id: string; emailAddress: string }>
  accounts: readonly Option[]
  categories: readonly Option[]
  investmentAccounts: readonly Option[]
  onSaved: (message: string) => void | Promise<void>
  onCancel?: () => void
}) {
  const isEditing = sender != null
  const hasPassword = sender?.hasAttachmentPassword ?? false
  const [formError, setFormError] = useState<string | null>(null)
  const [createSender] = useMutation(CreateMailSenderMutation)
  const [updateSender] = useMutation(UpdateMailSenderMutation)

  const formSchema = schema.superRefine((values, context) => {
    if (!isEditing && !values.connectionId) {
      context.addIssue({
        code: 'custom',
        path: ['connectionId'],
        message: 'Elige un buzón',
      })
    }
    if (values.kind !== 'XTB_ORDER_CONFIRMATION') return
    if (!values.investmentAccountId) {
      context.addIssue({
        code: 'custom',
        path: ['investmentAccountId'],
        message: 'Elige la cuenta de inversión donde se registran las órdenes',
      })
    }
    if (!hasPassword && !values.attachmentPassword.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['attachmentPassword'],
        message: 'Sin la contraseña no se puede abrir el PDF de XTB',
      })
    }
    if (values.attachmentPassword && !values.attachmentPassword.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['attachmentPassword'],
        message: 'La contraseña no puede ser solo espacios',
      })
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kind: sender?.kind ?? 'INVOICE',
      connectionId: sender?.connectionId ?? connections[0]?.id ?? '',
      emailAddress: sender?.emailAddress ?? '',
      merchantName: sender?.merchantName ?? '',
      defaultAccountId: sender?.defaultAccountId ?? '',
      defaultCategoryId: sender?.defaultCategoryId ?? '',
      investmentAccountId: sender?.investmentAccountId ?? '',
      attachmentPassword: '',
      backfillFrom: '',
    },
  })

  const kind = watch('kind')
  const isXtb = kind === 'XTB_ORDER_CONFIRMATION'

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const password = values.attachmentPassword ? values.attachmentPassword : undefined
    try {
      if (isEditing) {
        await updateSender({
          variables: {
            input: {
              id: sender.id,
              kind: values.kind,
              emailAddress: values.emailAddress,
              merchantName: values.merchantName,
              // Solo se tocan los campos del tipo elegido; '' → null los quita.
              ...(values.kind === 'XTB_ORDER_CONFIRMATION'
                ? {
                    investmentAccountId: values.investmentAccountId,
                    ...(password ? { attachmentPassword: password } : {}),
                  }
                : {
                    defaultAccountId: values.defaultAccountId || null,
                    defaultCategoryId: values.defaultCategoryId || null,
                  }),
            },
          },
        })
        await onSaved('Remitente actualizado.')
        return
      }

      await createSender({
        variables: {
          input: {
            connectionId: values.connectionId,
            kind: values.kind,
            emailAddress: values.emailAddress,
            merchantName: values.merchantName,
            ...(values.kind === 'XTB_ORDER_CONFIRMATION'
              ? {
                  investmentAccountId: values.investmentAccountId,
                  ...(password ? { attachmentPassword: password } : {}),
                }
              : {
                  ...(values.defaultAccountId
                    ? { defaultAccountId: values.defaultAccountId }
                    : {}),
                  ...(values.defaultCategoryId
                    ? { defaultCategoryId: values.defaultCategoryId }
                    : {}),
                }),
            ...(values.backfillFrom ? { backfillFrom: values.backfillFrom } : {}),
          },
        },
      })
      reset({
        ...values,
        emailAddress: '',
        merchantName: '',
        attachmentPassword: '',
        backfillFrom: '',
      })
      await onSaved(
        values.backfillFrom
          ? 'Remitente creado; iniciamos la lectura histórica.'
          : 'Remitente creado.',
      )
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(event) => void onSubmit(event)}
      noValidate
    >
      <Select
        label="Tipo de remitente"
        error={errors.kind?.message}
        {...register('kind')}
      >
        {(
          Object.keys(SENDER_KIND_LABELS) as Array<keyof typeof SENDER_KIND_LABELS>
        ).map((value) => (
          <option key={value} value={value}>
            {SENDER_KIND_LABELS[value]}
          </option>
        ))}
      </Select>
      {!isEditing && (
        <Select
          label="Buzón"
          error={errors.connectionId?.message}
          {...register('connectionId')}
        >
          {connections.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.emailAddress}
            </option>
          ))}
        </Select>
      )}
      <Field
        label="Correo del remitente"
        type="email"
        autoComplete="off"
        placeholder={isXtb ? 'confirmaciones@xtb.com' : 'facturas@comercio.com'}
        error={errors.emailAddress?.message}
        {...register('emailAddress')}
      />
      <Field
        label={isXtb ? 'Nombre para identificarlo' : 'Nombre del comercio'}
        placeholder={isXtb ? 'XTB' : undefined}
        error={errors.merchantName?.message}
        {...register('merchantName')}
      />

      {isXtb ? (
        <>
          <Select
            label="Cuenta de inversión"
            error={errors.investmentAccountId?.message}
            {...register('investmentAccountId')}
          >
            <option value="">Elige una cuenta</option>
            {investmentAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <div>
            <Field
              label={
                hasPassword
                  ? 'Nueva contraseña del PDF (opcional)'
                  : 'Contraseña del PDF'
              }
              type="password"
              autoComplete="new-password"
              placeholder={hasPassword ? 'Vacío = conservar la actual' : undefined}
              error={errors.attachmentPassword?.message}
              {...register('attachmentPassword')}
            />
            <p className="text-ink-muted mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              {hasPassword && <PasswordBadge />}
              Se guarda cifrada y nunca se vuelve a mostrar.
            </p>
          </div>
          {investmentAccounts.length === 0 && (
            <p className="text-ink-secondary text-sm sm:col-span-2">
              Aún no tienes cuentas de inversión: créala en Inversiones › Cuentas.
            </p>
          )}
        </>
      ) : (
        <>
          <Select
            label="Cuenta predeterminada (opcional)"
            {...register('defaultAccountId')}
          >
            <option value="">Sin cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <Select
            label="Categoría predeterminada (opcional)"
            {...register('defaultCategoryId')}
          >
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </>
      )}

      {/* La lectura histórica solo se programa al crear (no existe en UpdateMailSenderInput). */}
      {!isEditing && (
        <Field
          label="Leer correos desde (opcional)"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          {...register('backfillFrom')}
        />
      )}

      {formError && (
        <p role="alert" className="text-expense text-sm sm:col-span-2">
          {formError}
        </p>
      )}

      <div className="flex gap-2 sm:col-span-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting}
          className={onCancel ? 'flex-1' : ''}
        >
          {isEditing ? 'Guardar' : 'Guardar remitente'}
        </Button>
      </div>
    </form>
  )
}
