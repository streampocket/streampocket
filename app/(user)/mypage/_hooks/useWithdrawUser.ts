'use client'

import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import type { WithdrawalReasonCode } from '@/constants/app'

type WithdrawInput = {
  reason: WithdrawalReasonCode
  reasonDetail?: string
}

type WithdrawResponse = {
  message: string
  data: { withdrawnAt: string }
}

export function useWithdrawUser() {
  return useMutation({
    mutationFn: (input: WithdrawInput) =>
      userApi.post<WithdrawResponse>('/own/users/me/withdraw', input),
  })
}
