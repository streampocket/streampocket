import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamOrderItem } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

// 수동 연결용 주문 검색 — 수신자명으로 기존 주문을 찾는다.
export function useOrderSearch(receiverName: string) {
  const trimmed = receiverName.trim()

  return useQuery({
    queryKey: QUERY_KEYS.orders.list({ receiverName: trimmed }),
    queryFn: () =>
      api.get<PaginatedResponse<SteamOrderItem>>(
        `/steam/admin/orders?receiverName=${encodeURIComponent(trimmed)}&pageSize=20`,
      ),
    enabled: trimmed.length > 0,
  })
}
