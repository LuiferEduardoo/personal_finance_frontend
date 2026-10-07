import { graphql } from '@/graphql/generated'

export const MailConnectionsQuery = graphql(`
  query MailConnections {
    mailConnections {
      id
      provider
      emailAddress
      status
      hasToken
      watchExpiresAt
      lastSyncedAt
      lastError
      createdAt
    }
  }
`)

export const GmailAuthUrlQuery = graphql(`
  query GmailAuthUrl {
    gmailAuthUrl
  }
`)

export const MailSendersQuery = graphql(`
  query MailSenders($connectionId: ID) {
    mailSenders(connectionId: $connectionId) {
      id
      connectionId
      emailAddress
      merchantName
      defaultAccountId
      defaultCategoryId
      active
      backfillFrom
      backfillStatus
      backfillError
      createdAt
      updatedAt
    }
  }
`)

export const MailMessagesQuery = graphql(`
  query MailMessages($filter: MailMessagesFilterInput) {
    mailMessages(filter: $filter) {
      id
      connectionId
      gmailMessageId
      senderId
      subject
      receivedAt
      status
      error
      expenseId
      createdAt
      updatedAt
    }
  }
`)

export const CreateMailSenderMutation = graphql(`
  mutation CreateMailSender($input: CreateMailSenderInput!) {
    createMailSender(input: $input) {
      id
      backfillStatus
    }
  }
`)

export const UpdateMailSenderMutation = graphql(`
  mutation UpdateMailSender($input: UpdateMailSenderInput!) {
    updateMailSender(input: $input) {
      id
      active
    }
  }
`)

export const DeleteMailSenderMutation = graphql(`
  mutation DeleteMailSender($id: ID!) {
    deleteMailSender(id: $id)
  }
`)

export const BackfillMailSenderMutation = graphql(`
  mutation BackfillMailSender($id: ID!, $since: String) {
    backfillMailSender(id: $id, since: $since) {
      id
      backfillStatus
      backfillError
    }
  }
`)

export const DisconnectMailConnectionMutation = graphql(`
  mutation DisconnectMailConnection($id: ID!) {
    disconnectMailConnection(id: $id)
  }
`)

export const SyncMailConnectionMutation = graphql(`
  mutation SyncMailConnection($id: ID!) {
    syncMailConnection(id: $id)
  }
`)

export const RetryMailMessageMutation = graphql(`
  mutation RetryMailMessage($id: ID!) {
    retryMailMessage(id: $id) {
      id
      status
      error
      expenseId
      updatedAt
    }
  }
`)
