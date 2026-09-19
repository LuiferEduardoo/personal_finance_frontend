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
      financeBaseCurrency
      investmentBaseCurrency
      timezone
      authentication {
        twoFactorMethod
      }
    }
  }
`)

export const UpdateBaseCurrenciesMutation = graphql(`
  mutation UpdateBaseCurrencies(
    $financeBaseCurrency: String!
    $investmentBaseCurrency: String!
  ) {
    updateBaseCurrencies(
      financeBaseCurrency: $financeBaseCurrency
      investmentBaseCurrency: $investmentBaseCurrency
    ) {
      id
      baseCurrency
      financeBaseCurrency
      investmentBaseCurrency
    }
  }
`)

export const RequestPasswordResetMutation = graphql(`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`)
export const ResetPasswordMutation = graphql(`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input)
  }
`)
export const ChangePasswordMutation = graphql(`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`)
export const BeginTwoFactorMutation = graphql(`
  mutation BeginTwoFactor($method: TwoFactorMethod!) {
    beginTwoFactorSetup(method: $method) {
      method
      secret
      otpauthUri
    }
  }
`)
export const ConfirmTwoFactorMutation = graphql(`
  mutation ConfirmTwoFactor($method: TwoFactorMethod!, $code: String!) {
    confirmTwoFactorSetup(method: $method, code: $code)
  }
`)
export const DisableTwoFactorMutation = graphql(`
  mutation DisableTwoFactor($code: String!) {
    disableTwoFactor(code: $code)
  }
`)
