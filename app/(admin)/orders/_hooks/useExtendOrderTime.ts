import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useExtendOrderTime() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/extend-time`),
    onSuccess: () => {
      toast.success('예상 완료시각이 10분 연장되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '시간 연장에 실패했습니다.')
    },
  })
}
