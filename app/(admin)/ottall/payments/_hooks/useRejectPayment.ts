'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

export function useRejectPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      api.patch(`/own/admin/payments/${id}/reject`, { adminNote }),
    onSuccess: () => {
      toast.success('결제가 거절되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPayments.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '거절에 실패했습니다.')
    },
  })
}
