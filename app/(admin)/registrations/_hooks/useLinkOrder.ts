import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function useLinkOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, orderItemId }: { id: string; orderItemId: string }) =>
      api.post(`/steam/admin/registrations/${id}/link`, { orderItemId }),
    onSuccess: () => {
      toast.success('주문에 연결되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.steamRegistrations.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '주문 연결에 실패했습니다.')
    },
  })
}
