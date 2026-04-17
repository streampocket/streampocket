import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useMarkGiftCompleted() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/gift-complete`),
    onSuccess: (_, id) => {
      toast.success('선물 접수 완료 처리되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '선물 접수 완료 처리에 실패했습니다.')
    },
  })
}
