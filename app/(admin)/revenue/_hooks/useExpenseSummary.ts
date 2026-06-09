import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RevenueData } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useExpenseSummary(yearMonth?: string, store?: string) {
  const params = new URLSearchParams()
  if (yearMonth) params.set('yearMonth', yearMonth)
  if (store) params.set('store', store)
  const queryString = params.toString() ? `?${params.toString()}` : ''

  return useQuery({
    queryKey: QUERY_KEYS.expenses.summary({ yearMonth, store }),
    queryFn: () =>
      api.get<ApiResponse<RevenueData>>(`/steam/admin/expenses/summary${queryString}`),
    select: (res) => res.data,
  })
}
