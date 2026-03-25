import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useRetryOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/retry`),
    onSuccess: () => {
      toast.success('재처리 요청이 완료되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '재처리에 실패했습니다.')
    },
  })
}
