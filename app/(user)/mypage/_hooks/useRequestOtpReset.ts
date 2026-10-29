'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/lib/userApi'
import { QUERY_KEYS } from '@/constants/queryKeys'

type OtpResetRequestResponse = {
  data: { resetRequestedAt: string }
}

// 발급 횟수 소진 후 OTP 재발급 요청 — 서버가 관리자 디스코드로 알린다 (처리 전까지 1번만)
export function useRequestOtpReset(applicationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      userApi.post<OtpResetRequestResponse>(`/own/applications/${applicationId}/otp/reset-request`),
    onSettled: () => {
      // 성공·실패(이미 요청함 등) 모두 서버 상태로 다시 맞춘다 — 버튼 ↔ "요청 완료" 전환
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyApplications.my() })
    },
  })
}
