import { NavLink, Outlet } from 'react-router'
import { NAV_ITEMS } from './navigation'

function PlusIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

/** Flecha hacia arriba: "entra dinero", misma iconografía direccional que <Money>. */
function IncomeIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 20V5M6 11l6-6 6 6" />
    </svg>
  )
}

/**
 * Un solo layout para las dos formas:
 *   - móvil: tab bar inferior fija + FAB flotante, al alcance del pulgar;
 *   - `lg:` en adelante: sidebar lateral fija con la acción principal dentro.
 *
 * En desktop la acción va EN EL FLUJO, dentro de la sidebar. Antes era el mismo
 * botón `fixed` recolocado a la esquina superior derecha, y ahí tapaba los
 * filtros de periodo de las páginas, que viven justo en esa esquina.
 */
export function AppLayout() {
  return (
    <div className="bg-surface min-h-dvh lg:flex">
      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col">
        {/*
         * El padding inferior tiene que despejar la tab bar (4.5rem) Y el FAB,
         * que flota por encima de ella (3.5rem más un margen). Con solo el alto
         * de la tab bar, la última fila de una lista queda bajo el botón.
         */}
        {/* Despeja la tab bar y los DOS FAB apilados (gasto + ingreso). */}
        <main className="flex-1 pb-[calc(12rem+var(--spacing-safe-bottom))] lg:pb-8">
          <Outlet />
        </main>
      </div>

      <TabBar />
      <QuickActionFabs />
    </div>
  )
}

function SidebarNav() {
  return (
    <nav
      aria-label="Principal"
      className="border-border bg-surface-raised hidden w-60 shrink-0 border-r lg:sticky lg:top-0 lg:block lg:h-dvh"
    >
      <p className="text-ink flex items-center gap-2 px-5 py-6 text-base font-semibold">
        <img src="/logo.webp" alt="" className="size-7 shrink-0" />
        Kuantico
      </p>

      {/* Las acciones principales, dentro del flujo de la sidebar: no pueden
          tapar el contenido como hacía el FAB reposicionado. */}
      <div className="flex flex-col gap-2 px-3 pb-4">
        <NavLink
          to="/movimientos/nuevo"
          className="bg-ink text-surface flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium hover:opacity-90"
        >
          <PlusIcon className="size-4" />
          Registrar gasto
        </NavLink>
        <NavLink
          to="/movimientos/nuevo-ingreso"
          className="border-border text-ink hover:bg-surface-sunken flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium"
        >
          <IncomeIcon className="text-income size-4" />
          Registrar ingreso
        </NavLink>
      </div>

      <ul className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? 'bg-surface-sunken text-ink'
                    : 'text-ink-secondary hover:bg-surface-sunken'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function TabBar() {
  return (
    <nav
      aria-label="Principal"
      className="border-border bg-surface-raised fixed inset-x-0 bottom-0 z-20 border-t pb-[var(--spacing-safe-bottom)] lg:hidden"
    >
      <ul className="flex">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                // min-h-14 mantiene el área táctil por encima de los 44px.
                `flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[0.625rem] ${
                  isActive ? 'text-ink font-medium' : 'text-ink-muted'
                }`
              }
            >
              {item.icon}
              {/* Con 5 pestañas la etiqueta no debe romper en dos líneas. */}
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Registrar gasto e ingreso son las acciones frecuentes, disponibles en toda la
 * app. Dos FAB apilados sobre la tab bar (solo móvil, `lg:hidden`; en desktop
 * viven en la sidebar). El gasto es la acción primaria (más frecuente): FAB
 * mayor y sólido; el ingreso, secundario, encima, con la flecha "entra dinero".
 * Cada uno lleva `aria-label` y el icono direccional, así que no dependen del
 * color para distinguirse.
 */
function QuickActionFabs() {
  return (
    <div className="lg:hidden">
      <NavLink
        to="/movimientos/nuevo-ingreso"
        aria-label="Registrar ingreso"
        className="border-border bg-surface-raised text-income fixed right-4 bottom-[calc(8.75rem+var(--spacing-safe-bottom))] z-20 flex size-12 items-center justify-center rounded-full border shadow-lg"
      >
        <IncomeIcon className="size-6" />
      </NavLink>
      <NavLink
        to="/movimientos/nuevo"
        aria-label="Registrar gasto"
        className="bg-ink text-surface fixed right-4 bottom-[calc(4.5rem+var(--spacing-safe-bottom))] z-20 flex size-14 items-center justify-center rounded-full shadow-lg"
      >
        <PlusIcon className="size-6" />
      </NavLink>
    </div>
  )
}
