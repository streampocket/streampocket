'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import type { OwnProduct } from '@/types/domain'

type CloseResponse = {
  data: OwnProduct
}

export function useCloseOwnProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      userApi.patch<CloseResponse>(`/own/products/${id}/close`),
    onSuccess: (_data, id) => {
      toast.success('상품 모집이 닫혔습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.detail(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '모집 닫기에 실패했습니다.')
    },
  })
}
