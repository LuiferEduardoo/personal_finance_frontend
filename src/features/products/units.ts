import type { UnitOfMeasure } from '@/graphql/generated/graphql'

/** Los enums se muestran traducidos pero se envían con su valor literal. */
export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  UNIT: 'unidad',
  GRAM: 'g',
  KILOGRAM: 'kg',
  MILLILITER: 'ml',
  LITER: 'L',
  PACK: 'paquete',
  ROLL: 'rollo',
  PAIR: 'par',
  OTHER: 'otro',
}

export const UNIT_OPTIONS = Object.entries(UNIT_LABELS) as [UnitOfMeasure, string][]

/** "400 ml", "1 kg", o cadena vacía si no hay tamaño declarado. */
export function formatPackage(
  packageSize?: number | null,
  unit?: UnitOfMeasure | null,
): string {
  if (packageSize == null) return ''
  const label = unit ? UNIT_LABELS[unit] : ''
  return `${packageSize} ${label}`.trim()
}
