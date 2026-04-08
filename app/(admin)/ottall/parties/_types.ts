import type { OwnProductStatus } from '@/types/domain'

export type PartyTabStatus = 'all' | OwnProductStatus

export type AdminPartyListParams = {
  status?: OwnProductStatus
  search?: string
  page?: number
  pageSize?: number
}
