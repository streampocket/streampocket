import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OrderListParams, OrderListResponse } from '../_types'

export function useOrders(params: OrderListParams = {}) {
  const { status, from, to, receiverName, page = 1, pageSize = 20 } = params

  const searchParams = new URLSearchParams()
  searchParams.set('page', String(page))
  searchParams.set('pageSize', String(pageSize))
  if (status) searchParams.set('status', status)
  if (from) searchParams.set('from', from)
  if (to) searchParams.set('to', to)
  if (receiverName) searchParams.set('receiverName', receiverName)

  return useQuery({
    queryKey: QUERY_KEYS.orders.list(params),
    queryFn: () =>
      api.get<OrderListResponse>(`/steam/admin/orders?${searchParams.toString()}`),
  })
}
