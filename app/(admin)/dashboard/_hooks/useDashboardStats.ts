import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DashboardStats } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.stats(),
    queryFn: () => api.get<ApiResponse<DashboardStats>>('/steam/admin/dashboard/stats'),
    select: (res) => res.data,
    refetchInterval: 60_000,
  })
}
