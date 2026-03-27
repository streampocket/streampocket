import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamOrderItem } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

export function useOrderDetail(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id ?? ''),
    queryFn: () => api.get<ApiResponse<SteamOrderItem>>(`/steam/admin/orders/${id}`),
    select: (res) => res.data,
    enabled: id !== null,
  })
}
