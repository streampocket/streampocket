import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { SteamOrderItem } from '@/types/domain'
import type { PaginatedResponse } from '@/types/api'

// 수동 연결용 주문 검색 — 수신자명으로 기존 주문을 찾는다.
export function useOrderSearch(receiverName: string) {
  const trimmed = receiverName.trim()

  return useQuery({
    queryKey: QUERY_KEYS.orders.list({ receiverName: trimmed, source: 'naver' }),
    queryFn: () =>
      api.get<PaginatedResponse<SteamOrderItem>>(
        // 스팀 등록 수동 연결은 네이버 주문 대상 — 수동 주문 제외
        `/steam/admin/orders?receiverName=${encodeURIComponent(trimmed)}&pageSize=20&source=naver`,
      ),
    enabled: trimmed.length > 0,
  })
}
