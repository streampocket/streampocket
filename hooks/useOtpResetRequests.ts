'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'
import type { PartyType } from '@/types/domain'

// 30초 — 탭 1개당 하루 약 2,900건의 가벼운 조회. 백그라운드 탭은 브라우저가 약 1분으로 늦출 수 있다
const POLL_INTERVAL_MS = 30_000

/** 구매자 OTP 재발급 요청 중 아직 초기화하지 않은 건 (관리자 상단 종) */
export type OtpResetRequest = {
  applicationId: string
  /** 원 신청 주문 id — 없으면 종에서 초기화할 수 없다 (주문관리에서 처리) */
  orderId: string | null
  productOrderId: string | null
  productName: string
  partyType: PartyType
  userName: string | null
  userPhone: string | null
  requestedAt: string
  expiresAt: string
}

/** 미처리 OTP 재발급 요청 — 다른 창을 보고 있을 때도 계속 확인한다 (데스크톱 알림·알림음용) */
export function useOtpResetRequests(enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.otpResetRequests.list(),
    queryFn: () => api.get<ApiResponse<OtpResetRequest[]>>('/steam/admin/orders/otp-reset-requests'),
    select: (res) => res.data,
    enabled,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })
}

/** 종 목록에서 바로 횟수 초기화 — 주문관리 OTP 탭과 같은 API. 두 화면을 함께 갱신한다 */
export function useResetOtpFromRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => api.post(`/steam/admin/orders/${orderId}/party-otp/reset`),
    onSuccess: (_data, orderId) => {
      toast.success('발급 횟수를 초기화했습니다.')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.otpResetRequests.all() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
