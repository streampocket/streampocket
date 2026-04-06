'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'

type DeleteProductPayload = {
  partnerId: string
  productId: string
}

export function useAdminDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ partnerId, productId }: DeleteProductPayload) =>
      api.delete(`/own/admin/partners/${partnerId}/products/${productId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminPartners.detail(variables.partnerId),
      })
      toast.success('파티가 삭제되었습니다.')
    },
    onError: (error: Error) => {
      toast.error(error.message || '파티 삭제에 실패했습니다.')
    },
  })
}
