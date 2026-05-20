import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OrderListParams, OrderStatusCounts, SteamOrderItem } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

export type OrderListResponse = PaginatedResponse<SteamOrderItem> & {
  counts: OrderStatusCounts
}

export function useOrders(params: OrderListParams = {}) {
  const {
    status,
    from,
    to,
    receiverName,
    excludeStatuses,
    excludeWithExpense,
    page = 1,
    pageSize = 20,
  } = params

  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('pageSize', String(pageSize))
  if (status) searchParams.set('status', status)
  if (from) searchParams.set('from', from)
  if (to) searchParams.set('to', to)
  if (receiverName) searchParams.set('receiverName', receiverName)
  if (excludeStatuses && excludeStatuses.length > 0) {
    searchParams.set('excludeStatuses', excludeStatuses.join(','))
  }
  if (excludeWithExpense) searchParams.set('excludeWithExpense', 'true')

  return useQuery({
    queryKey: QUERY_KEYS.orders.list(params),
    queryFn: () =>
      api.get<OrderListResponse>(`/steam/admin/orders?${searchParams.toString()}`),
  })
}
