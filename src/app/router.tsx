import { createBrowserRouter } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { CategoriesPage } from '@/features/categories/CategoriesPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
import { TransactionsPage } from '@/features/transactions/TransactionsPage'
import { AppLayout } from './AppLayout'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'

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
          { index: true, element: <PagePlaceholder title="Inicio" phase="fase 3" /> },
          { path: '/movimientos', element: <TransactionsPage /> },
          // Misma pantalla: la ruta solo abre el formulario al entrar (la usa el FAB).
          { path: '/movimientos/nuevo', element: <TransactionsPage /> },
          { path: '/categorias', element: <CategoriesPage /> },
          {
            path: '/productos',
            element: <PagePlaceholder title="Productos" phase="fase 5" />,
          },
          { path: '/ajustes', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <PagePlaceholder title="Página no encontrada" phase="—" /> },
])
