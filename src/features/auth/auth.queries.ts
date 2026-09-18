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

/** El usuario autenticado que alimenta el menú de perfil y los ajustes. */
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
