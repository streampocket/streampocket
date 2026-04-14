import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DashboardExtras } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useDashboardExtras() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.extras(),
    queryFn: () =>
      api.get<ApiResponse<DashboardExtras>>(
        '/steam/admin/dashboard/extras',
      ),
    select: (res) => res.data,
    staleTime: 300_000,
  })
}
