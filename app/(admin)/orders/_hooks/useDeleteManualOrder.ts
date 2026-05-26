import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useDeleteManualOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/steam/admin/orders/${id}`),
    onSuccess: () => {
      toast.success('수동 주문이 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '수동 주문 삭제에 실패했습니다.')
    },
  })
}
