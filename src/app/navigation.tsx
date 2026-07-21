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

/** Cuatro destinos: más no caben cómodamente en una tab bar de móvil. */
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
    to: '/productos',
    label: 'Productos',
    icon: (
      <svg {...iconProps}>
        <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5z" />
        <path d="M3 8.5 12 13l9-4.5M12 13v7" />
      </svg>
    ),
  },
  {
    to: '/ajustes',
    label: 'Ajustes',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-12.8-1.4 1.4m-10 10-1.4 1.4" />
      </svg>
    ),
  },
]
