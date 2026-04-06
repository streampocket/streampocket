'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toast } from 'sonner'
import type { OwnProduct } from '@/types/domain'

type CreateOwnProductPayload = {
  name: string
  durationDays: number
  price: number
  totalSlots: number
  imagePath?: string | null
  notes?: string | null
}

type CreateResponse = {
  data: OwnProduct
}

export function useCreateOwnProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOwnProductPayload) =>
      userApi.post<CreateResponse>('/own/products', data),
    onSuccess: () => {
      toast.success('상품이 등록되었습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ownProducts.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '상품 등록에 실패했습니다.')
    },
  })
}
