'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import type { OwnProduct } from '@/types/domain'

type UpdateOwnProductPayload = {
  name?: string
  durationDays?: number
  price?: number
  totalSlots?: number
  imagePath?: string | null
  notes?: string | null
}

type UpdateResponse = {
  data: OwnProduct
}

export function useUpdateOwnProduct(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateOwnProductPayload) =>
      userApi.patch<UpdateResponse>(`/own/products/${id}`, data),
    onSuccess: () => {
      toast.success('파티가 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.detail(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '파티 수정에 실패했습니다.')
    },
  })
}
