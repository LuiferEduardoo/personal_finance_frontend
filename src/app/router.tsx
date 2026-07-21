import { createBrowserRouter } from 'react-router'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { SettingsPage } from '@/features/settings/SettingsPage'
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
          {
            path: '/movimientos',
            element: <PagePlaceholder title="Movimientos" phase="fase 2" />,
          },
          {
            path: '/movimientos/nuevo',
            element: <PagePlaceholder title="Registrar gasto" phase="fase 2" />,
          },
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
