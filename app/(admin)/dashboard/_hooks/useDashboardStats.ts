import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DashboardStats, RevenueData } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

type DashboardStatsResponse = {
  cards: {
    totalOrders: number
    confirmedOrders: number
    pendingDecisionOrders: number
    returnedOrders: number
  }
  revenue: RevenueData
}

function mapResponse(raw: DashboardStatsResponse): DashboardStats {
  return {
    totalOrders: raw.cards.totalOrders,
    confirmedOrders: raw.cards.confirmedOrders,
    pendingDecisionOrders: raw.cards.pendingDecisionOrders,
    returnedOrders: raw.cards.returnedOrders,
    revenue: raw.revenue,
  }
}

export function useDashboardStats(period: string = 'today') {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.stats(period),
    queryFn: () =>
      api.get<ApiResponse<DashboardStatsResponse>>(
        `/steam/admin/dashboard/stats?period=${period}`,
      ),
    select: (res) => mapResponse(res.data),
    refetchInterval: 60_000,
  })
}
