import type { ReactNode } from 'react'

export type NavItem = {
  to: string
  label: string
  icon: ReactNode
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  className: 'size-6',
} as const

/** Destinos financieros principales de la tab bar y el sidebar. */
export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Inicio',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    to: '/movimientos',
    label: 'Movimientos',
    icon: (
      <svg {...iconProps}>
        <path d="M4 7h16M4 7l3-3M4 7l3 3" />
        <path d="M20 17H4m16 0-3-3m3 3-3 3" />
      </svg>
    ),
  },
  {
    to: '/articulos',
    label: 'Artículos',
    icon: (
      <svg {...iconProps}>
        <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" />
        <path d="M3 8.5 12 13l9-4.5M12 13v7" />
      </svg>
    ),
  },
  {
    to: '/cuentas',
    label: 'Cuentas',
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    ),
  },
]

/** Tareas de organización menos frecuentes, agrupadas en el sidebar. */
export const ORGANIZATION_ITEMS: NavItem[] = [
  {
    to: '/categorias',
    label: 'Categorías',
    icon: (
      <svg {...iconProps}>
        <path d="M4 6h7l2 3h7v9H4z" />
        <path d="M8 13h8" />
      </svg>
    ),
  },
  {
    to: '/recurrentes',
    label: 'Gastos recurrentes',
    icon: (
      <svg {...iconProps}>
        <path d="M20 11a8 8 0 1 0-2.3 5.7" />
        <path d="M20 5v6h-6" />
        <path d="M12 8v4l2.5 1.5" />
      </svg>
    ),
  },
]
