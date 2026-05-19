'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'

export function useSendOrderStatusAlimtalk() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/steam/admin/orders/${id}/order-status-alimtalk`),
    onSuccess: (_, id) => {
      toast.success('주문상황 알림톡이 발송되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '알림톡 발송에 실패했습니다.')
    },
  })
}
