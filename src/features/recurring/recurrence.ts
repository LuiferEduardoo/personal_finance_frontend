import type { Recurrence } from '@/graphql/generated/graphql'

/** Los enums se muestran traducidos pero se envían con su valor literal. */
export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  ONCE: 'Una vez',
  DAILY: 'Diario',
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quincenal',
  MONTHLY: 'Mensual',
  BIMONTHLY: 'Bimestral',
  QUARTERLY: 'Trimestral',
  SEMIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
}

/**
 * Recurrencias válidas para una plantilla recurrente: todas menos `ONCE`, que
 * el backend rechaza (una plantilla que no se repite no tiene sentido).
 */
export const RECURRING_OPTIONS = (
  Object.entries(RECURRENCE_LABELS) as [Recurrence, string][]
).filter(([value]) => value !== 'ONCE')
