import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ManualRevenue } from '@/types/domain'
import type { ManualRevenueListParams } from '../_types'

type ManualRevenuesResponse = {
  data: ManualRevenue[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export function useManualRevenues(params: ManualRevenueListParams) {
  const queryParams = new URLSearchParams()
  if (params.yearMonth) queryParams.set('yearMonth', params.yearMonth)
  if (params.dateOrder) queryParams.set('dateOrder', params.dateOrder)
  if (params.page) queryParams.set('page', String(params.page))
  if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))

  return useQuery({
    queryKey: QUERY_KEYS.manualRevenues.list(params as Record<string, unknown>),
    queryFn: () =>
      api.get<ManualRevenuesResponse>(`/steam/admin/manual-revenues?${queryParams.toString()}`),
  })
}
