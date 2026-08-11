'use client'

import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'

type ApplyResponse = {
  data: {
    applicationId: string
    price: number
    fee: number
    totalAmount: number
    /** 서버가 정한 실제 사용액 (min(잔액, 총액)) */
    usedPoint: number
    /** 실제로 낼 금액 = totalAmount - usedPoint */
    payableAmount: number
  }
}

type ApplyInput = {
  /** 쓸지 말지만 보낸다 — 금액을 보내면 조작 여지가 생겨 서버가 무시한다 */
  usePoint: boolean
}

export function useApplyParty(productId: string) {
  return useMutation({
    mutationFn: (input: ApplyInput) =>
      userApi.post<ApplyResponse>(`/own/products/${productId}/apply`, {
        usePoint: input.usePoint,
      }),
  })
}
