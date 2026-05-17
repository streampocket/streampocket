import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OrderTracking } from '../_types'

type TrackingResponse = { data: OrderTracking }

/**
 * 더 이상 진행사항이 바뀌지 않는 종결 상태인지 판정 — 폴링 중단 조건.
 * completed/purchase_decided라도 completedAt이 없으면 관리자 완료 처리를 기다리는
 * "진행중"이므로 폴링을 계속한다.
 */
function isTrackingTerminal(data: OrderTracking): boolean {
  return (
    data.completedAt != null ||
    data.fulfillmentStatus === 'returned' ||
    data.fulfillmentStatus === 'failed'
  )
}

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
      const data = query.state.data?.data
      return data && isTrackingTerminal(data) ? false : 5000
    },
    select: (res) => res.data,
  })
}
