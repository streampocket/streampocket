import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useMarkInProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/in-progress`),
    onSuccess: () => {
      toast.success('진행중으로 전환되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '진행중 전환에 실패했습니다.')
    },
  })
}
