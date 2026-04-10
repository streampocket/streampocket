'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`/own/admin/payments/${id}`),
    onSuccess: () => {
      toast.success('결제가 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminPayments.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '삭제에 실패했습니다.')
    },
  })
}
