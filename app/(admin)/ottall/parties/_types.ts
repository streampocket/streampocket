import type { OwnProductStatus } from '@/types/domain'

export type PartyTabStatus = 'all' | OwnProductStatus

export type AdminPartyListParams = {
  status?: OwnProductStatus
  search?: string
  page?: number
  pageSize?: number
}

export type RuleTemplate = {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}
