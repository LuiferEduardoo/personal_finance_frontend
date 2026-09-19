import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import {
  INVESTMENT_NAV_ITEMS,
  NAV_ITEMS,
  ORGANIZATION_ITEMS,
  type NavItem,
} from './navigation'
import { ProfileMenu } from './ProfileMenu'

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

function PanelIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  )
}

function ScanIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
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
  const location = useLocation()
  const isInvestments = location.pathname.startsWith('/inversiones')
  return (
    <div className="bg-surface min-h-dvh lg:flex">
      <SidebarNav />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-surface/95 sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <div className="min-w-0 flex-1">
            <WorkspaceSwitch />
          </div>
          <div className="ml-auto">
            <ProfileMenu />
          </div>
        </header>
        {/*
         * El padding inferior tiene que despejar la tab bar (4.5rem) Y el FAB,
         * que flota por encima de ella (3.5rem más un margen). Con solo el alto
         * de la tab bar, la última fila de una lista queda bajo el botón.
         */}
        {/* Despeja la tab bar y los DOS FAB apilados (gasto + ingreso). */}
        <main
          className={`flex-1 lg:pb-8 ${
            isInvestments
              ? 'pb-[calc(8rem+var(--spacing-safe-bottom))]'
              : 'pb-[calc(12rem+var(--spacing-safe-bottom))]'
          }`}
        >
          <Outlet />
        </main>
      </div>

      <TabBar />
      <QuickActionFabs />
    </div>
  )
}

function SidebarNav() {
  const location = useLocation()
  const isInvestments = location.pathname.startsWith('/inversiones')
  const items = isInvestments ? INVESTMENT_NAV_ITEMS : NAV_ITEMS
  const organizationActive = ORGANIZATION_ITEMS.some((item) =>
    location.pathname.startsWith(item.to),
  )
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [organizationOpen, setOrganizationOpen] = useState(organizationActive)

  return (
    <aside
      className={`border-border bg-surface-raised hidden shrink-0 border-r transition-[width] lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      <div className="flex min-h-20 items-center justify-between gap-2 px-3">
        <p className="text-ink flex min-w-0 items-center gap-2 text-lg font-semibold">
          <img src="/logo.webp" alt="" className="size-10 shrink-0" />
          {!isCollapsed && <span className="truncate">Kuantico</span>}
        </p>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label="Contraer menú lateral"
            className="text-ink-muted hover:bg-surface-sunken flex size-10 shrink-0 items-center justify-center rounded-lg"
          >
            <PanelIcon className="size-5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label="Desplegar menú lateral"
          className="text-ink-secondary hover:bg-surface-sunken mx-auto mb-3 flex size-11 items-center justify-center rounded-lg"
        >
          <PanelIcon className="size-5" />
        </button>
      )}

      {/* Las acciones principales, dentro del flujo de la sidebar: no pueden
          tapar el contenido como hacía el FAB reposicionado. */}
      {!isInvestments && (
        <div className="flex flex-col gap-2 px-3 pb-4">
          <NavLink
            to="/movimientos/nuevo"
            aria-label={isCollapsed ? 'Registrar gasto' : undefined}
            title={isCollapsed ? 'Registrar gasto' : undefined}
            className="bg-ink text-surface flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium hover:opacity-90"
          >
            <PlusIcon className="size-4" />
            {!isCollapsed && 'Registrar gasto'}
          </NavLink>
          <NavLink
            to="/movimientos/nuevo-ingreso"
            aria-label={isCollapsed ? 'Registrar ingreso' : undefined}
            title={isCollapsed ? 'Registrar ingreso' : undefined}
            className="border-border text-ink hover:bg-surface-sunken flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium"
          >
            <IncomeIcon className="text-income size-4" />
            {!isCollapsed && 'Registrar ingreso'}
          </NavLink>
          <NavLink
            to="/facturas"
            aria-label={isCollapsed ? 'Escanear factura' : undefined}
            title={isCollapsed ? 'Escanear factura' : undefined}
            className="border-border text-ink hover:bg-surface-sunken flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium"
          >
            <ScanIcon className="size-4" />
            {!isCollapsed && 'Escanear factura'}
          </NavLink>
        </div>
      )}

      {isInvestments && (
        <div className="px-3 pb-4">
          <NavLink
            to="/inversiones/operaciones/nueva"
            aria-label={isCollapsed ? 'Registrar operación' : undefined}
            className="bg-ink text-surface flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium hover:opacity-90"
          >
            <PlusIcon className="size-4" />
            {!isCollapsed && 'Registrar operación'}
          </NavLink>
        </div>
      )}

      <nav aria-label="Principal" className="flex flex-1 flex-col px-3">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <SidebarItem key={item.to} item={item} isCollapsed={isCollapsed} />
          ))}
        </ul>

        {!isInvestments && (
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false)
                setOrganizationOpen(true)
              } else {
                setOrganizationOpen((open) => !open)
              }
            }}
            aria-expanded={!isCollapsed && organizationOpen}
            aria-controls="organization-navigation"
            aria-label={isCollapsed ? 'Desplegar Organización' : undefined}
            title={isCollapsed ? 'Organización' : undefined}
            className={`mt-3 flex min-h-11 w-full items-center rounded-lg px-3 text-sm font-medium ${
              organizationActive
                ? 'text-ink'
                : 'text-ink-secondary hover:bg-surface-sunken'
            } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
          >
            <OrganizationIcon className="size-6 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">Organización</span>
                <ChevronIcon
                  className={`size-4 transition-transform ${organizationOpen ? 'rotate-180' : ''}`}
                />
              </>
            )}
          </button>
        )}

        {!isInvestments && !isCollapsed && organizationOpen && (
          <ul id="organization-navigation" className="mt-1 flex flex-col gap-1 pl-3">
            {ORGANIZATION_ITEMS.map((item) => (
              <SidebarItem key={item.to} item={item} isCollapsed={false} compact />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  )
}

function SidebarItem({
  item,
  isCollapsed,
  compact = false,
}: {
  item: NavItem
  isCollapsed: boolean
  compact?: boolean
}) {
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.to === '/' || item.to === '/inversiones'}
        aria-label={isCollapsed ? item.label : undefined}
        title={isCollapsed ? item.label : undefined}
        className={({ isActive }) =>
          `flex min-h-11 items-center rounded-lg text-sm font-medium ${
            isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
          } ${compact ? 'text-[0.8125rem]' : ''} ${
            isActive
              ? 'bg-surface-sunken text-ink'
              : 'text-ink-secondary hover:bg-surface-sunken'
          }`
        }
      >
        {item.icon}
        {!isCollapsed && item.label}
      </NavLink>
    </li>
  )
}

function OrganizationIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 6h6l2 3h8v9H4z" />
    </svg>
  )
}

function ChevronIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  )
}

function TabBar() {
  const location = useLocation()
  const items = location.pathname.startsWith('/inversiones')
    ? INVESTMENT_NAV_ITEMS
    : NAV_ITEMS
  return (
    <nav
      aria-label="Principal"
      className="border-border bg-surface-raised fixed inset-x-0 bottom-0 z-20 border-t pb-[var(--spacing-safe-bottom)] lg:hidden"
    >
      <ul className="flex">
        {items.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/' || item.to === '/inversiones'}
              className={({ isActive }) =>
                // min-h-14 mantiene el área táctil por encima de los 44px.
                `flex min-h-14 flex-col items-center justify-center gap-0.5 px-0.5 text-[0.625rem] ${
                  isActive ? 'text-ink font-medium' : 'text-ink-muted'
                }`
              }
            >
              {item.icon}
              {/* Las etiquetas no deben romper en dos líneas. */}
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
  const location = useLocation()
  if (location.pathname.startsWith('/inversiones')) {
    return (
      <NavLink
        to="/inversiones/operaciones/nueva"
        aria-label="Registrar operación"
        className="bg-ink text-surface fixed right-4 bottom-[calc(4.5rem+var(--spacing-safe-bottom))] z-20 flex size-14 items-center justify-center rounded-full shadow-lg lg:hidden"
      >
        <PlusIcon className="size-6" />
      </NavLink>
    )
  }
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

function WorkspaceSwitch() {
  const location = useLocation()
  const navigate = useNavigate()
  const value = location.pathname.startsWith('/inversiones') ? 'investments' : 'finance'

  return (
    <label className="block max-w-64">
      <span className="sr-only">Espacio de trabajo</span>
      <span className="relative block">
        <select
          aria-label="Cambiar espacio de trabajo"
          value={value}
          onChange={(event) =>
            navigate(event.target.value === 'investments' ? '/inversiones' : '/')
          }
          className="border-border bg-surface text-ink min-h-10 w-full appearance-none truncate rounded-lg border py-2 pr-10 pl-3 text-sm font-medium"
        >
          <option value="finance">Gastos e ingresos</option>
          <option value="investments">Inversiones</option>
        </select>
        <ChevronIcon className="text-ink-muted pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
      </span>
    </label>
  )
}
