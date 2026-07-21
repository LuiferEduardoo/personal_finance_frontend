import { graphql } from '@/graphql/generated'

export const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
      }
    }
  }
`)

export const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
      }
    }
  }
`)

export const LogoutMutation = graphql(`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`)

/**
 * El usuario autenticado. `id` es imprescindible: categorías, gastos e ingresos
 * lo reciben como argumento explícito porque aún no están migrados al token.
 */
export const MeQuery = graphql(`
  query Me {
    me {
      id
      email
      firstName
      lastName
      avatar
      baseCurrency
      timezone
    }
  }
`)
