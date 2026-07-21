import { ApolloProvider } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { SessionProvider } from '@/features/auth/SessionProvider'
import { apolloClient } from '@/graphql/client'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Falta #root en index.html')

createRoot(container).render(
  <StrictMode>
    {/* SessionProvider va dentro de ApolloProvider: usa el cliente para `me`. */}
    <ApolloProvider client={apolloClient}>
      <SessionProvider>
        <RouterProvider router={router} />
      </SessionProvider>
    </ApolloProvider>
  </StrictMode>,
)
