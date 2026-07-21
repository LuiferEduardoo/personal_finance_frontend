import { NavLink, Outlet } from 'react-router'
import { NAV_ITEMS } from './navigation'

/**
 * Un solo layout para las dos formas:
 *   - móvil: tab bar inferior fija + FAB, todo al alcance del pulgar;
 *   - `lg:` en adelante: sidebar lateral fija y el FAB pasa a la cabecera.
 */
export function AppLayout() {
  return (
    <div className="bg-surface min-h-dvh lg:flex">
      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* pb deja hueco para la tab bar y el inset inferior de iOS. */}
        <main className="flex-1 pb-[calc(4.5rem+var(--spacing-safe-bottom))] lg:pb-8">
          <Outlet />
        </main>
      </div>

      <TabBar />
      <AddExpenseButton />
    </div>
  )
}

function SidebarNav() {
  return (
    <nav
      aria-label="Principal"
      className="border-border bg-surface-raised hidden w-60 shrink-0 border-r lg:sticky lg:top-0 lg:block lg:h-dvh"
    >
      <p className="text-ink px-5 py-6 text-base font-semibold">Finanzas</p>
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
                `flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] ${
                  isActive ? 'text-ink font-medium' : 'text-ink-muted'
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

/**
 * Registrar un gasto es la acción más frecuente, así que tiene botón propio.
 * En móvil flota sobre la tab bar; en desktop se ancla arriba a la derecha.
 */
function AddExpenseButton() {
  return (
    <NavLink
      to="/movimientos/nuevo"
      className="bg-ink text-surface fixed right-4 bottom-[calc(4.5rem+var(--spacing-safe-bottom))] z-20 flex size-14 items-center justify-center rounded-full shadow-lg lg:top-6 lg:right-6 lg:bottom-auto lg:size-auto lg:gap-2 lg:rounded-lg lg:px-4 lg:py-2.5 lg:text-sm lg:font-medium lg:shadow-none"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="size-6 lg:size-4"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="sr-only lg:not-sr-only">Registrar gasto</span>
    </NavLink>
  )
}
