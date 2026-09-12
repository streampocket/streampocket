import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'
import type { PartyOtpInfo } from '../_types'

export function usePartyOtpInfo(orderId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: QUERY_KEYS.partyOtp.detail(orderId ?? ''),
    queryFn: () => api.get<ApiResponse<PartyOtpInfo>>(`/steam/admin/orders/${orderId}/party-otp`),
    select: (res) => res.data,
    enabled: orderId !== null && enabled,
    // 전역 기본값(1분)을 쓰지 않는 이유: 이 응답은 계정의 현재 상태를 그대로 비추는 값이다.
    // 파티원 목록·시크릿 불일치 경고가 캐시로 낡으면, 관리자가 드라마 계정 관리에서 방금 고친 것을
    // 반영하지 못한 화면을 보고 "구매자가 틀린 코드를 받는지"를 판단하게 된다.
    // 신청 관리 상세(useAdminApplicationDetail)와 같은 설정으로 맞춰 두 화면이 어긋나지 않게 한다.
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
