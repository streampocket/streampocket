import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type UpdateManualOrderNetProfitInput = {
  id: string
  netProfit: number
  /** 배그 주문(전화번호만 수집) 수신자명 후입력 등 — 보내면 함께 수정 */
  receiverName?: string
}

export function useUpdateManualOrderNetProfit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, netProfit, receiverName }: UpdateManualOrderNetProfitInput) =>
      api.patch(`/steam/admin/orders/${id}/net-profit`, {
        netProfit,
        ...(receiverName !== undefined ? { receiverName } : {}),
      }),
    onSuccess: (_, variables) => {
      toast.success('순수익이 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '순수익 수정에 실패했습니다.')
    },
  })
}
