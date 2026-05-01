'use client'

import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'

type ApplyResponse = {
  data: {
    applicationId: string
    price: number
    fee: number
    totalAmount: number
  }
}

export function useApplyParty(productId: string) {
  return useMutation({
    mutationFn: () => userApi.post<ApplyResponse>(`/own/products/${productId}/apply`, {}),
  })
}
