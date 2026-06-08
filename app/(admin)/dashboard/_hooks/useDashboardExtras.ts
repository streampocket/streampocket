import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { DashboardExtras } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useDashboardExtras(store: string = '') {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard.extras(store),
    queryFn: () =>
      api.get<ApiResponse<DashboardExtras>>(
        `/steam/admin/dashboard/extras${store ? `?store=${store}` : ''}`,
      ),
    select: (res) => res.data,
    staleTime: 300_000,
  })
}
