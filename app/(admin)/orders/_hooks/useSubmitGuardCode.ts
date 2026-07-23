import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import type { ApiResponse } from '@/types/api'

type GuardCodeResult = {
  status: 'completed'
  inviteLink1: string
  inviteLink2: string
  friendCode: string | null
}

// 양식 C 코드 방식 — 인증번호 제출 → 친구링크 2개 생성·저장
export function useSubmitGuardCode(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, code }: { sessionId: string; code: string }) =>
      api.post<ApiResponse<GuardCodeResult>>(
        `/steam/admin/orders/${orderId}/auto-friend-link/guard-code`,
        { sessionId, code },
      ),
    onSuccess: (res) => {
      toast.success(
        res.data.friendCode
          ? '인증 완료 — 친구링크 2개와 친구 코드를 저장했습니다.'
          : '인증 완료 — 친구링크 2개를 저장했습니다.',
      )
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? '인증번호 제출에 실패했습니다.')
    },
  })
}
