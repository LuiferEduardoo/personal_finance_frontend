// oxlint-disable react/only-export-components -- un archivo de rutas exporta
// el router, no componentes; la regla de fast refresh no aplica aquí.
import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { AppLayout } from './AppLayout'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'

/**
 * Las pantallas de datos se cargan bajo demanda.
 *
 * El dashboard arrastra Recharts, que pesa más que el resto de la aplicación
 * junta; cargarlo por adelantado penalizaría al usuario que solo entra a
 * registrar un gasto. Login y registro sí van en el bundle inicial: son la
 * primera pantalla y un salto de carga ahí se nota.
 */
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const TransactionsPage = lazy(() =>
  import('@/features/transactions/TransactionsPage').then((module) => ({
    default: module.TransactionsPage,
  })),
)
const CategoriesPage = lazy(() =>
  import('@/features/categories/CategoriesPage').then((module) => ({
    default: module.CategoriesPage,
  })),
)
const ArticlesPage = lazy(() =>
  import('@/features/articles/ArticlesPage').then((module) => ({
    default: module.ArticlesPage,
  })),
)
const InvoiceScanPage = lazy(() =>
  import('@/features/invoices/InvoiceScanPage').then((module) => ({
    default: module.InvoiceScanPage,
  })),
)
const InflationPage = lazy(() =>
  import('@/features/inflation/InflationPage').then((module) => ({
    default: module.InflationPage,
  })),
)
const AccountsPage = lazy(() =>
  import('@/features/accounts/AccountsPage').then((module) => ({
    default: module.AccountsPage,
  })),
)
const AccountDetailPage = lazy(() =>
  import('@/features/accounts/AccountDetailPage').then((module) => ({
    default: module.AccountDetailPage,
  })),
)
const RecurringPage = lazy(() =>
  import('@/features/recurring/RecurringPage').then((module) => ({
    default: module.RecurringPage,
  })),
)
const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
)
const ApiKeysPage = lazy(() =>
  import('@/features/api-keys/ApiKeysPage').then((module) => ({
    default: module.ApiKeysPage,
  })),
)

/** Evita que el layout parpadee mientras llega el trozo de código de la ruta. */
function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 sm:px-6">
          <div className="bg-surface-sunken h-64 animate-pulse rounded-lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/entrar', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Lazy>
                <DashboardPage />
              </Lazy>
            ),
          },
          {
            path: '/movimientos',
            element: (
              <Lazy>
                <TransactionsPage />
              </Lazy>
            ),
          },
          // Misma pantalla: la ruta solo abre el formulario al entrar (la usan los
          // botones/FAB globales). `nuevo` abre gasto; `nuevo-ingreso`, ingreso.
          {
            path: '/movimientos/nuevo',
            element: (
              <Lazy>
                <TransactionsPage />
              </Lazy>
            ),
          },
          {
            path: '/movimientos/nuevo-ingreso',
            element: (
              <Lazy>
                <TransactionsPage />
              </Lazy>
            ),
          },
          {
            path: '/facturas',
            element: (
              <Lazy>
                <InvoiceScanPage />
              </Lazy>
            ),
          },
          {
            path: '/articulos',
            element: (
              <Lazy>
                <ArticlesPage />
              </Lazy>
            ),
          },
          // La antigua ruta de productos ahora es la pestaña "Productos" de Artículos.
          { path: '/productos', element: <Navigate to="/articulos" replace /> },
          {
            path: '/inflacion',
            element: (
              <Lazy>
                <InflationPage />
              </Lazy>
            ),
          },
          {
            path: '/categorias',
            element: (
              <Lazy>
                <CategoriesPage />
              </Lazy>
            ),
          },
          {
            path: '/cuentas',
            element: (
              <Lazy>
                <AccountsPage />
              </Lazy>
            ),
          },
          {
            path: '/cuentas/:id',
            element: (
              <Lazy>
                <AccountDetailPage />
              </Lazy>
            ),
          },
          {
            path: '/recurrentes',
            element: (
              <Lazy>
                <RecurringPage />
              </Lazy>
            ),
          },
          {
            path: '/api-keys',
            element: (
              <Lazy>
                <ApiKeysPage />
              </Lazy>
            ),
          },
          {
            path: '/ajustes',
            element: (
              <Lazy>
                <SettingsPage />
              </Lazy>
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <PagePlaceholder title="Página no encontrada" phase="—" /> },
])
