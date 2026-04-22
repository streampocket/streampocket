'use client'

import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'

type VerifyResponse = {
  data: {
    paymentId: string
    status: 'paid'
    applicationId: string
  }
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (paymentId: string) =>
      userApi.post<VerifyResponse>(`/own/payments/${paymentId}/verify`),
  })
}
