import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RevenueData } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useExpenseSummary(yearMonth?: string) {
  const queryParams = yearMonth ? `?yearMonth=${yearMonth}` : ''

  return useQuery({
    queryKey: QUERY_KEYS.expenses.summary({ yearMonth }),
    queryFn: () =>
      api.get<ApiResponse<RevenueData>>(`/steam/admin/expenses/summary${queryParams}`),
    select: (res) => res.data,
  })
}
