import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { RevenueChartItem } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useRevenueChart(days: number = 30) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.revenueChart(days),
    queryFn: () =>
      api.get<ApiResponse<RevenueChartItem[]>>(
        `/steam/admin/dashboard/revenue-chart?days=${days}`,
      ),
    select: (res) => res.data,
    refetchInterval: 300_000,
  })
}
