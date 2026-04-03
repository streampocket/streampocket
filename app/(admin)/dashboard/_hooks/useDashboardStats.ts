import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DashboardStats, RevenueData } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

type DashboardStatsResponse = {
  today: { orderCount: number }
  orders: { pending: number; manualReview: number; failed: number }
  stock: Array<{ productId: string; productName: string; availableCodes: number }>
  revenue: RevenueData
}

function mapResponse(raw: DashboardStatsResponse): DashboardStats {
  return {
    todayOrders: raw.today.orderCount,
    pendingOrders: raw.orders.pending,
    manualReviewOrders: raw.orders.manualReview,
    lowStockProducts: raw.stock.filter((s) => s.availableCodes <= 2).length,
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
