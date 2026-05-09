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

export type OrderStatusCounts = {
  total: number
  pending: number
  completed: number
  purchase_decided: number
  manual_review: number
  failed: number
  returned: number
}

export type OrderListResponse = PaginatedResponse<SteamOrderItem> & {
  counts: OrderStatusCounts
}
