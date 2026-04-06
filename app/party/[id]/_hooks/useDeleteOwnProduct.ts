'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'

export function useDeleteOwnProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      userApi.delete(`/own/products/${id}`),
    onSuccess: () => {
      toast.success('상품이 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '상품 삭제에 실패했습니다.')
    },
  })
}
