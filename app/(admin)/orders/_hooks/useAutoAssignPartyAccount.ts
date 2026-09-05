import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { describeAutoDeliverReason } from '@/constants/app'
import type { ApiResponse } from '@/types/api'

type AutoAssignResponse = {
  assigned: boolean
  sent: boolean
  account: { id: string; email: string; dueAt: string | null; freeSlots: number } | null
  reason: string | null
}

/**
 * 계정 자동 배정 + 알림톡 발송 재시도 — 승인 시 자동발송이 꺼져 있었거나 실패한 건 보정용.
 * 이미 배정된 건이면 서버가 배정은 건너뛰고 발송만 다시 시도한다.
 */
export function useAutoAssignPartyAccount(orderId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.post<ApiResponse<AutoAssignResponse>>(
        `/steam/admin/orders/${orderId}/party-otp/auto-assign`,
        {},
      ),
    onSuccess: (response) => {
      const result = response.data
      if (result.sent) {
        toast.success(
          result.assigned
            ? `계정을 배정하고 알림톡을 보냈습니다. (${result.account?.email ?? ''})`
            : '알림톡을 다시 보냈습니다.',
        )
      } else {
        // 배정은 됐지만 발송이 실패한 상태 — 자리는 이미 잡혔으므로 실패로 끝내지 않고 알린다
        toast.warning(`계정은 배정했지만 알림톡 발송에 실패했습니다. ${describeAutoDeliverReason(result.reason)}`)
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partyOtp.detail(orderId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminApplications.all() })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : '자동 배정에 실패했습니다.')
    },
  })
}
