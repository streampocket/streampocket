import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamRegistration } from '@/types/domain'
import type { ApiResponse } from '@/types/api'

// 주문에 연결된 스팀 등록 접수 조회 (연결된 접수가 없으면 data: null)
export function useOrderRegistration(orderId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.steamRegistrations.byOrder(orderId ?? ''),
    queryFn: () =>
      api.get<ApiResponse<SteamRegistration | null>>(
        `/steam/admin/registrations/by-order?orderItemId=${orderId}`,
      ),
    select: (res) => res.data,
    enabled: orderId !== null,
  })
}
