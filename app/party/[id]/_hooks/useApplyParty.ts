'use client'

import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import type { PayMethod } from '@/constants/app'

type ApplyResponse = {
  data: {
    applicationId: string
    paymentId: string
    amount: number
    orderName: string
    payMethod: PayMethod
    pgProvider: 'kakaopay' | 'galaxia'
  }
}

type ApplyInput = {
  payMethod: PayMethod
}

export function useApplyParty(productId: string) {
  return useMutation({
    mutationFn: (input: ApplyInput) =>
      userApi.post<ApplyResponse>(`/own/products/${productId}/apply`, {
        payMethod: input.payMethod,
      }),
  })
}
