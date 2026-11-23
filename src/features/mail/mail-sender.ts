import type { MailSenderKind } from '@/graphql/generated/graphql'

export const SENDER_KIND_LABELS: Record<MailSenderKind, string> = {
  INVOICE: 'Facturas electrónicas',
  XTB_ORDER_CONFIRMATION: 'Confirmaciones de órdenes XTB',
}

/** Etiqueta corta para la insignia de la lista. */
export const SENDER_KIND_SHORT: Record<MailSenderKind, string> = {
  INVOICE: 'Facturas',
  XTB_ORDER_CONFIRMATION: 'Órdenes XTB',
}

/** "1 operación registrada" / "3 operaciones registradas". */
export function formatOperations(count: number): string {
  return count === 1 ? '1 operación registrada' : `${count} operaciones registradas`
}
