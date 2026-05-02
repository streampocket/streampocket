import type { FulfillmentStatus, SteamOrderItem } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

export type OrderListParams = {
  status?: FulfillmentStatus | ''
  from?: string
  to?: string
  receiverName?: string
  page?: number
  pageSize?: number
}

export type OrderListResponse = PaginatedResponse<SteamOrderItem>
