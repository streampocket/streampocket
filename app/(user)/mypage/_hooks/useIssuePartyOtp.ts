'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { OtpIssueResult } from '../_types'

type OtpIssueResponse = {
  data: OtpIssueResult
}

// 파티 OTP 발급/재발급 — 서버가 세션(10분) 내 재호출은 횟수 차감 없이 처리
export function useIssuePartyOtp(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      userApi.post<OtpIssueResponse>(`/own/applications/${applicationId}/otp`),
    onSuccess: () => {
      // 발급 횟수(otpIssueCount) 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.my() })
    },
  })
}
