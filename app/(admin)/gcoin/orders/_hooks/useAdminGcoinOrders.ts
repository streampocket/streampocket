'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type {
  GcoinOrder,
  GcoinOrderStatusCounts,
  AdminGcoinOrderListParams,
} from '../_types'

type GcoinOrdersResponse = {
  data: GcoinOrder[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  counts: GcoinOrderStatusCounts
}

export function useAdminGcoinOrders(params: AdminGcoinOrderListParams = {}) {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('pageSize', String(params.pageSize ?? 20))

  const qs = searchParams.toString()

  return useQuery({
    queryKey: QUERY_KEYS.adminGcoinOrders.list(params),
    queryFn: () => api.get<GcoinOrdersResponse>(`/gcoin/admin/orders?${qs}`),
  })
}
