import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type UpdateManualOrderNetProfitInput = {
  id: string
  netProfit: number
}

export function useUpdateManualOrderNetProfit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, netProfit }: UpdateManualOrderNetProfitInput) =>
      api.patch(`/steam/admin/orders/${id}/net-profit`, { netProfit }),
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
