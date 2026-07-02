import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function usePurchaseDecideOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/purchase-decide`),
    onSuccess: () => {
      toast.success('구매확정 처리되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '구매확정 처리에 실패했습니다.')
    },
  })
}
