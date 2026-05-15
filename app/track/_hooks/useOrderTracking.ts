import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { FulfillmentStatus } from '@/types/domain'
import type { OrderTracking } from '../_types'

type TrackingResponse = { data: OrderTracking }

// 더 이상 상태가 바뀌지 않는 종결 상태 — 폴링 중단
const TERMINAL_STATUSES: FulfillmentStatus[] = [
  'completed',
  'purchase_decided',
  'returned',
  'failed',
]

/**
 * 구매자용 진행상황 조회 훅.
 * productOrderId가 있을 때만 조회하며, 진행 중인 주문은 5초마다 자동 재조회한다.
 */
export function useOrderTracking(productOrderId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.orderTracking.detail(productOrderId ?? ''),
    queryFn: () =>
      api.get<TrackingResponse>(`/steam/track/${encodeURIComponent(productOrderId ?? '')}`),
    enabled: !!productOrderId,
    staleTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.data.fulfillmentStatus
      return status && TERMINAL_STATUSES.includes(status) ? false : 5000
    },
    select: (res) => res.data,
  })
}
