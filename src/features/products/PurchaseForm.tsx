import { useMutation } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Select } from '@/components/Select'
import { getFirstErrorMessage } from '@/graphql/errors'
import type { UnitOfMeasure } from '@/graphql/generated/graphql'
import { todayIso } from '@/lib/dates'
import {
  ProductPurchasesQuery,
  ProductStatsQuery,
  ProductsQuery,
  RegisterProductPurchaseMutation,
} from './products.queries'
import { UNIT_OPTIONS } from './units'

/**
 * `productId` y `newProduct` son EXCLUYENTES: enviar los dos o ninguno da
 * BAD_REQUEST ("Envía solo uno: productId o newProduct, no ambos"). El
 * formulario lo modela con un interruptor, de forma que la combinación
 * inválida no se pueda expresar.
 */
const schema = z
  .object({
    mode: z.enum(['existing', 'new']),
    productId: z.string().optional(),
    name: z.string().optional(),
    brand: z.string().optional(),
    packageSize: z.number().optional(),
    unit: z.string().optional(),
    quantity: z.number().positive('Debe ser mayor que 0').optional(),
    unitPrice: z.number().nonnegative('No puede ser negativo').optional(),
    store: z.string().optional(),
    purchasedOn: z.string().min(1, 'La fecha es obligatoria'),
  })
  .refine((values) => values.mode !== 'existing' || !!values.productId, {
    message: 'Elige un producto del catálogo',
    path: ['productId'],
  })
  .refine((values) => values.mode !== 'new' || !!values.name?.trim(), {
    message: 'El nombre es obligatorio',
    path: ['name'],
  })

type FormValues = z.infer<typeof schema>

type PurchaseFormProps = {
  products: { id: string; name: string }[]
  /** Preselecciona un producto al comprar desde su ficha. */
  defaultProductId?: string
  onDone: () => void
}

export function PurchaseForm({
  products,
  defaultProductId,
  onDone,
}: PurchaseFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const [registerPurchase] = useMutation(RegisterProductPurchaseMutation, {
    // La compra cambia `inStock` y las estadísticas a la vez; sin refrescar,
    // la ficha seguiría diciendo que no hay producto.
    refetchQueries: [
      { query: ProductsQuery, variables: {} },
      { query: ProductStatsQuery },
      { query: ProductPurchasesQuery, variables: {} },
    ],
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: defaultProductId ? 'existing' : products.length > 0 ? 'existing' : 'new',
      productId: defaultProductId ?? '',
      purchasedOn: todayIso(),
      quantity: 1,
      unit: 'UNIT',
    },
  })

  const mode = watch('mode')

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    const optional = (value: string | undefined) => value?.trim() || undefined

    try {
      await registerPurchase({
        variables: {
          input: {
            // Exactamente uno de los dos, nunca ambos.
            ...(values.mode === 'existing'
              ? { productId: values.productId }
              : {
                  newProduct: {
                    name: values.name!.trim(),
                    brand: optional(values.brand),
                    packageSize: values.packageSize ?? undefined,
                    unit: (values.unit as UnitOfMeasure) ?? undefined,
                  },
                }),
            quantity: values.quantity ?? undefined,
            unitPrice: values.unitPrice ?? undefined,
            store: optional(values.store),
            purchasedOn: values.purchasedOn,
          },
        },
      })
      onDone()
    } catch (error) {
      setFormError(getFirstErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Select label="Producto" {...register('mode')}>
        <option value="existing" disabled={products.length === 0}>
          Del catálogo
        </option>
        <option value="new">Crear uno nuevo</option>
      </Select>

      {mode === 'existing' ? (
        <Select
          label="Cuál"
          error={errors.productId?.message}
          {...register('productId')}
        >
          <option value="">Elige…</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
      ) : (
        <>
          <Field
            label="Nombre"
            placeholder="Shampoo Head & Shoulders"
            error={errors.name?.message}
            {...register('name')}
          />
          <Field label="Marca (opcional)" placeholder="P&G" {...register('brand')} />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Tamaño"
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="400"
              {...register('packageSize', {
                setValueAs: (value: string) =>
                  value === '' ? undefined : Number(value),
              })}
            />
            <Select label="Unidad" {...register('unit')}>
              {UNIT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Cantidad"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          error={errors.quantity?.message}
          {...register('quantity', {
            setValueAs: (value: string) => (value === '' ? undefined : Number(value)),
          })}
        />
        <Field
          label="Precio unitario"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          placeholder="0"
          error={errors.unitPrice?.message}
          {...register('unitPrice', {
            setValueAs: (value: string) => (value === '' ? undefined : Number(value)),
          })}
        />
      </div>

      <Field label="Tienda (opcional)" placeholder="D1" {...register('store')} />

      <Field
        label="Fecha de compra"
        type="date"
        error={errors.purchasedOn?.message}
        {...register('purchasedOn')}
      />

      {formError && (
        <p role="alert" className="text-expense text-sm">
          {formError}
        </p>
      )}

      <p className="text-ink-muted text-xs">
        El total se calcula solo. Si el producto es consumible y no tenía ciclo abierto,
        la compra lo marca como disponible.
      </p>

      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onDone} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1">
          Registrar compra
        </Button>
      </div>
    </form>
  )
}
