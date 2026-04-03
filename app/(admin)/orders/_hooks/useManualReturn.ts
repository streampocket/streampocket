import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useManualReturn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/return`),
    onSuccess: () => {
      toast.success('반품 처리가 완료되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '반품 처리에 실패했습니다.')
    },
  })
}
