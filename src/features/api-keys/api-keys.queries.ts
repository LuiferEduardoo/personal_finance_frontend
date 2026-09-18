import { graphql } from '@/graphql/generated'

export const ApiKeysQuery = graphql(`
  query ApiKeys {
    apiKeys {
      id
      name
      prefix
      scopes
      expiresAt
      lastUsedAt
      revokedAt
      isActive
      createdAt
      updatedAt
    }
  }
`)

export const CreateApiKeyMutation = graphql(`
  mutation CreateApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input) {
      token
      apiKey {
        id
        name
        prefix
        scopes
        expiresAt
        lastUsedAt
        revokedAt
        isActive
        createdAt
        updatedAt
      }
    }
  }
`)

export const UpdateApiKeyMutation = graphql(`
  mutation UpdateApiKey($input: UpdateApiKeyInput!) {
    updateApiKey(input: $input) {
      id
      name
      prefix
      scopes
      expiresAt
      lastUsedAt
      revokedAt
      isActive
      createdAt
      updatedAt
    }
  }
`)

export const RevokeApiKeyMutation = graphql(`
  mutation RevokeApiKey($id: ID!) {
    revokeApiKey(id: $id) {
      id
      revokedAt
      isActive
      updatedAt
    }
  }
`)

export const RemoveApiKeyMutation = graphql(`
  mutation RemoveApiKey($id: ID!) {
    removeApiKey(id: $id)
  }
`)
