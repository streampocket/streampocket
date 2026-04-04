import type { AccountStatus } from '@/types/domain'

export type AccountListParams = {
  productId?: string
  status?: AccountStatus | ''
}

export type BulkCreateBody = {
  productId: string
  accounts: Array<{
    username: string
    password: string
    email: string
    emailPassword: string
    emailSiteUrl: string
    secondaryEmail?: string
    secondaryEmailPassword?: string
    secondaryEmailSiteUrl?: string
  }>
}
