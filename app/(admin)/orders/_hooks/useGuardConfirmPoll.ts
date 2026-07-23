import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ApiResponse } from '@/types/api'

type PollResult =
  | { status: 'pending' }
  | { status: 'completed'; inviteLink1: string; inviteLink2: string; friendCode: string | null }

// 양식 C 승인(DeviceConfirmation) 방식 — 폰 승인 완료를 3초 간격으로 폴링.
// 완료를 감지하면 호출측에서 enabled를 false로 바꿔(세션 초기화) 폴링을 중단한다.
export function useGuardConfirmPoll(
  orderId: string,
  sessionId: string | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ['autoFriendLinkPoll', orderId, sessionId],
    queryFn: () =>
      api.post<ApiResponse<PollResult>>(
        `/steam/admin/orders/${orderId}/auto-friend-link/status`,
        { sessionId },
      ),
    enabled: enabled && sessionId !== null,
    refetchInterval: 3000,
    select: (res) => res.data,
  })
}
