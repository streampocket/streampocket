import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { SteamOrderItem } from '@/types/domain'

// 상태(대기)·결제일시(생성 시각)는 서버가 자동 설정한다.
type CreateManualOrderInput = {
  productName: string
  receiverName: string
  netProfit: number
}

export function useCreateManualOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateManualOrderInput) =>
      api.post<ApiResponse<SteamOrderItem>>('/steam/admin/orders/manual', input),
    onSuccess: () => {
      toast.success('수동 주문이 생성되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '수동 주문 생성에 실패했습니다.')
    },
  })
}
