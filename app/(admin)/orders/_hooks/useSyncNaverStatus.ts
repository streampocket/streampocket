import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { FulfillmentStatus } from '@/types/domain'

type SyncNaverStatusResponse = {
  message: string
  data: {
    changed: boolean
    action: 'returned' | 'recovered' | 'none'
    naverProductOrderStatus: string | null
    naverClaimType: string | null
    naverClaimStatus: string | null
    fulfillmentStatus: FulfillmentStatus
  }
}

// 네이버 상태 수동 재조회 — 주문 1건의 네이버 실제 상태를 DB와 양방향 동기화
export function useSyncNaverStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      api.post<SyncNaverStatusResponse>(`/steam/admin/orders/${id}/sync-naver-status`),
    onSuccess: (res, id) => {
      if (res.data.changed) {
        toast.success(res.message)
      } else {
        toast.info(res.message)
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '네이버 상태 재조회에 실패했습니다.')
    },
  })
}
